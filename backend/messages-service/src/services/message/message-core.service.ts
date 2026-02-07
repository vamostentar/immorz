import { createLogger } from '@/utils/logger';
import { EventType, Message, MessageStatus, PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from '../cache.service';
import { EmailService } from '../email.service';
import { MetricsService } from '../metrics.service';
import { CreateMessageDto, MessageWithEvents, PaginatedMessages } from './types';

export class MessageCoreService {
  private logger = createLogger({ service: 'MessageCoreService' });

  constructor(
    private prisma: PrismaClient,
    private metricsService: MetricsService,
    private cacheService: CacheService,
    private emailService: EmailService,
    private emailQueue?: Queue
  ) { }

  /**
   * Create and process a new message
   */
  async createMessage(data: CreateMessageDto): Promise<Message> {
    const startTime = Date.now();
    const correlationId = data.correlationId || uuidv4();
    const messageLogger = this.logger.child({ correlationId, operation: 'createMessage' });

    try {
      messageLogger.info('Creating new message', {
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        hasPhone: !!data.phone,
        bodyLength: data.body.length,
      });

      // If propertyId is provided but agentId is not, fetch agentId from the property
      let agentId = data.agentId;
      if (data.propertyId && !agentId) {
        try {
          // Fetch property to get agentId
          const property = await this.prisma.$queryRaw`
            SELECT "agentId" FROM properties.properties WHERE id = ${data.propertyId}::uuid LIMIT 1
          ` as any[];

          if (property && property[0] && property[0].agentId) {
            agentId = property[0].agentId;
            messageLogger.info('Auto-assigned agentId from property', {
              propertyId: data.propertyId,
              agentId,
            });
          }
        } catch (propertyError: any) {
          messageLogger.warn('Failed to fetch property for agentId', {
            propertyId: data.propertyId,
            error: propertyError.message,
          });
        }
      }

      // Fetch agent email if agentId is present
      let agentEmail: string | undefined;
      if (agentId) {
        try {
          const user = await this.prisma.$queryRaw`
            SELECT email FROM auth.users WHERE id = ${agentId} LIMIT 1
          ` as any[];

          if (user && user[0] && user[0].email) {
            agentEmail = user[0].email;
            messageLogger.info('Found agent email', { agentId, email: agentEmail });
          }
        } catch (error: any) {
           messageLogger.warn('Failed to fetch agent email', { agentId, error: error.message });
        }
      }

      const message = await this.prisma.message.create({
        data: {
          fromName: data.fromName,
          fromEmail: data.fromEmail,
          phone: data.phone,
          body: data.body,
          context: data.context,
          attachments: data.attachments,
          propertyId: data.propertyId,
          agentId: agentId,
          status: 'QUEUED',
          events: {
            create: {
              type: 'OUTBOUND_QUEUED',
              details: { correlationId },
            },
          },
        },
        include: {
          events: true,
        },
      });

      const dbDuration = Date.now() - startTime;
      messageLogger.database('create', 'Message', dbDuration, { messageId: message.id });

      if (this.emailQueue) {
        await this.emailQueue.add(
          'send-contact-email',
          {
            messageId: message.id,
            fromName: data.fromName,
            fromEmail: data.fromEmail,
            phone: data.phone,
            body: data.body,
            to: agentEmail,
            correlationId,
          },
          {
            jobId: `email-${message.id}`,
            delay: 0,
          }
        );

        messageLogger.queue('add', 'email', `email-${message.id}`, {
          messageId: message.id,
        });
      } else {
        try {
          const { config } = await import('@/utils/config');
          const recipients = [config.EMAIL_FROM];
          if (agentEmail) {
            recipients.push(agentEmail);
          }

          await this.emailService.sendContactEmail({
            fromName: data.fromName,
            fromEmail: data.fromEmail,
            phone: data.phone,
            body: data.body,
            to: recipients.join(','),
          });

          await this.updateMessageStatus(message.id, 'SENT', correlationId);
        } catch (error: any) {
          messageLogger.error('Failed to send email synchronously', {
            error: error.message,
            messageId: message.id,
          });

          await this.updateMessageStatus(message.id, 'FAILED', correlationId, error.message);
        }
      }

      this.metricsService.incrementCounter('messages_created_total');
      this.metricsService.recordHistogram('message_creation_duration_ms', Date.now() - startTime);

      messageLogger.business('message_created', {
        messageId: message.id,
        fromEmail: data.fromEmail,
        status: message.status,
      });

      messageLogger.audit('message_created', {
        messageId: message.id,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        ipAddress: data.context?.ipAddress,
        userAgent: data.context?.userAgent,
      });

      return message;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      messageLogger.error('Failed to create message', {
        error: error.message,
        duration,
        fromEmail: data.fromEmail,
      });

      this.metricsService.incrementCounter('messages_creation_errors_total');
      throw error;
    }
  }

  /**
   * Send an outbound message (new thread)
   */
  async sendOutboundMessage(data: any): Promise<Message> {
    const startTime = Date.now();
    const correlationId = uuidv4();
    const messageLogger = this.logger.child({ correlationId, operation: 'sendOutboundMessage' });

    try {
      messageLogger.info('Sending outbound message', {
        toEmail: data.toEmail,
        subject: data.subject,
        agentId: data.agentId
      });

      // Find latest conversation ID to thread messages if possible
      let conversationId = uuidv4();
      try {
        const lastMessage = await this.prisma.message.findFirst({
           where: {
             OR: [
               { fromEmail: data.toEmail },
               {
                 type: 'OUTBOUND',
                 context: {
                   path: ['toEmail'],
                   equals: data.toEmail
                 }
               }
             ]
           },
           orderBy: { createdAt: 'desc' },
           select: { conversationId: true }
        });
        if (lastMessage?.conversationId) {
          conversationId = lastMessage.conversationId;
        }
      } catch (err) {
        // ignore
      }

      const { config } = await import('@/utils/config');

      // Create message in DB
      const message = await this.prisma.message.create({
        data: {
          type: 'OUTBOUND',
          status: 'QUEUED',
          fromEmail: config.EMAIL_FROM,
          fromName: 'RibeirAzul',
          body: data.body,
          context: {
             subject: data.subject,
             toEmail: data.toEmail,
             agentId: data.agentId,
             replyTo: config.EMAIL_FROM,
             reason: data.subject
          },
          attachments: data.attachments,
          conversationId,
          agentId: data.agentId,
          read: true,
           events: {
            create: {
              type: 'OUTBOUND_QUEUED',
              details: { correlationId },
            },
          },
        }
      });

      // Prepare attachments for Nodemailer
      const emailAttachments = data.attachments?.map((att: any) => ({
        filename: att.name,
        path: att.url, 
        contentType: att.type
      }));

      // Send Email
      await this.emailService.sendCustomEmail(
        data.toEmail,
        data.subject,
        data.body, 
        undefined, 
        emailAttachments
      );

      // Update status to SENT
      await this.updateMessageStatus(message.id, 'SENT', correlationId);
      
      this.metricsService.incrementCounter('outbound_messages_sent_total');
      
      messageLogger.business('outbound_message_sent', {
        messageId: message.id,
        toEmail: data.toEmail,
        status: 'SENT'
      });

      return message;
    } catch (error: any) {
       messageLogger.error('Failed to send outbound message', {
        error: error.message,
        toEmail: data.toEmail
      });
      throw error;
    }
  }

  /**
   * Update message status with event logging
   */
  async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
    correlationId: string,
    error?: string
  ): Promise<Message> {
    const messageLogger = this.logger.child({ correlationId, messageId, operation: 'updateStatus' });

    try {
      const eventType = this.getEventTypeFromStatus(status);

      const message = await this.prisma.message.update({
        where: { id: messageId },
        data: {
          status,
          error,
          retries: status === 'FAILED' ? { increment: 1 } : undefined,
          events: {
            create: {
              type: eventType,
              details: error ? { error, correlationId } : { correlationId },
            },
          },
        },
        include: {
          events: true,
        },
      });

      messageLogger.info('Message status updated', {
        messageId,
        oldStatus: status,
        newStatus: message.status,
        eventType,
      });

      this.metricsService.incrementCounter(`messages_${status.toLowerCase()}_total`);
      await this.cacheService.delete(`message:${messageId}`);

      return message;
    } catch (error: any) {
      messageLogger.error('Failed to update message status', {
        error: error.message,
        messageId,
        status,
      });
      throw error;
    }
  }

  /**
   * Get message by ID with caching
   */
  async getMessageById(id: string, useCache = true): Promise<MessageWithEvents | null> {
    const cacheKey = `message:${id}`;

    if (useCache) {
      const cached = await this.cacheService.get<MessageWithEvents>(cacheKey);
      if (cached) {
        this.metricsService.incrementCounter('messages_cache_hits_total');
        return cached;
      }
    }

    const startTime = Date.now();

    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
        include: {
          events: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!message) {
        this.metricsService.incrementCounter('messages_not_found_total');
        return null;
      }

      if (useCache) {
        await this.cacheService.set(cacheKey, message, 300);
        this.metricsService.incrementCounter('messages_cache_misses_total');
      }

      const duration = Date.now() - startTime;
      this.logger.database('findUnique', 'Message', duration, { messageId: id });

      return message as MessageWithEvents;
    } catch (error: any) {
      this.logger.error('Failed to get message by ID', {
        error: error.message,
        messageId: id,
      });
      throw error;
    }
  }

  /**
   * Get paginated messages with filtering
   */
  async getMessages(
    page = 1,
    limit = 20,
    filters: {
      status?: MessageStatus;
      type?: 'INBOUND' | 'OUTBOUND';
      fromEmail?: string;
      dateFrom?: Date;
      dateTo?: Date;
      propertyId?: string;
      agentId?: string;
      read?: boolean;
      deleted?: boolean;
      search?: string;
    } = {}
  ): Promise<PaginatedMessages> {
    const startTime = Date.now();
    const offset = (page - 1) * limit;

    try {
      const where: any = {
        deleted: filters.deleted ?? false,
      };

      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;

      if (filters.fromEmail) {
        where.fromEmail = {
          contains: filters.fromEmail,
          mode: 'insensitive',
        };
      }

      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) where.createdAt.lte = filters.dateTo;
      }

      if (filters.propertyId) where.propertyId = filters.propertyId;
      
      // Allow agents to see their own messages AND unassigned messages (inbound)
      if (filters.agentId) {
        where.OR = [
          { agentId: filters.agentId },
          { agentId: null }
        ];
      }
      
      if (filters.read !== undefined) where.read = filters.read;

      if (filters.search) {
        where.OR = [
          { body: { contains: filters.search, mode: 'insensitive' } },
          { fromName: { contains: filters.search, mode: 'insensitive' } },
          { fromEmail: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [messages, total] = await Promise.all([
        this.prisma.message.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        this.prisma.message.count({ where }),
      ]);

      const duration = Date.now() - startTime;
      this.logger.database('findMany', 'Message', duration, {
        count: messages.length,
        total,
        page,
        limit,
      });

      return {
        data: messages,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      this.logger.error('Failed to get messages', {
        error: error.message,
        page,
        limit,
        filters,
      });
      throw error;
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { read: true },
      });
      await this.cacheService.delete(`message:${messageId}`);
      this.logger.info('Message marked as read', { messageId });
    } catch (error: any) {
      this.logger.error('Failed to mark message as read', { error: error.message, messageId });
      throw error;
    }
  }

  async markAsUnread(messageId: string): Promise<void> {
    try {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { read: false },
      });
      await this.cacheService.delete(`message:${messageId}`);
      this.logger.info('Message marked as unread', { messageId });
    } catch (error: any) {
      this.logger.error('Failed to mark message as unread', { error: error.message, messageId });
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { deleted: true },
      });
      await this.cacheService.delete(`message:${messageId}`);
      this.logger.info('Message moved to trash', { messageId });
    } catch (error: any) {
      this.logger.error('Failed to delete message', { error: error.message, messageId });
      throw error;
    }
  }

  async restoreMessage(messageId: string): Promise<void> {
    try {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { deleted: false },
      });
      await this.cacheService.delete(`message:${messageId}`);
      this.logger.info('Message restored from trash', { messageId });
    } catch (error: any) {
      this.logger.error('Failed to restore message', { error: error.message, messageId });
      throw error;
    }
  }

  async permanentlyDeleteMessage(messageId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.messageEvent.deleteMany({
          where: { messageId },
        });
        await tx.message.delete({
          where: { id: messageId },
        });
      });
      await this.cacheService.delete(`message:${messageId}`);
      this.logger.info('Message permanently deleted', { messageId });
    } catch (error: any) {
      this.logger.error('Failed to permanently delete message', { error: error.message, messageId });
      throw error;
    }
  }

  private getEventTypeFromStatus(status: MessageStatus): EventType {
    switch (status) {
      case 'QUEUED': return 'OUTBOUND_QUEUED';
      case 'SENT': return 'OUTBOUND_SENT';
      case 'FAILED': return 'OUTBOUND_FAILED';
      case 'RECEIVED': return 'INBOUND_RECEIVED';
      default: return 'OUTBOUND_QUEUED';
    }
  }
}
