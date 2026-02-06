import { createLogger } from '@/utils/logger';
import { Message, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email.service';
import { MetricsService } from '../metrics.service';
import { MessageCoreService } from './message-core.service';

export class EmailReplyService {
  private logger = createLogger({ service: 'EmailReplyService' });

  constructor(
    private prisma: PrismaClient,
    private emailService: EmailService,
    private metricsService: MetricsService,
    private coreService: MessageCoreService
  ) { }

  /**
   * Reply to a message and persist the reply
   */
  async replyToMessage(
    originalMessageId: string,
    body: string,
    subject?: string,
    toEmail?: string,
    attachments: { name: string; url: string; type: string; size: number }[] = []
  ): Promise<Message> {
    const startTime = Date.now();
    const correlationId = uuidv4();
    const messageLogger = this.logger.child({ correlationId, operation: 'replyToMessage' });

    try {
      const originalMessage = await this.prisma.message.findUnique({
        where: { id: originalMessageId },
      });

      if (!originalMessage) {
        throw new Error('Original message not found');
      }

      const replySubject = subject || `Re: Contacto de ${originalMessage.fromName}`;
      const recipient = toEmail || originalMessage.fromEmail;

      // Prepare attachments for Nodemailer
      const emailAttachments = attachments.map(att => ({
        filename: att.name,
        path: att.url,
        contentType: att.type
      }));

      const emailResult = await this.emailService.sendCustomEmail(
        recipient,
        replySubject,
        `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
            <div style="margin-bottom: 24px;">
              ${body.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p style="margin: 0; font-weight: bold; color: #2563eb;">Equipa RibeirAzul</p>
              <p style="margin: 4px 0 0 0;">Mediação Imobiliária</p>
            </div>

            <div style="margin-top: 24px; padding: 12px; background-color: #f9f9f9; border-radius: 4px; color: #999; font-size: 11px; text-align: center;">
              Esta é uma resposta à sua mensagem enviada através do nosso portal RibeirAzul. 
              Pode responder diretamente a este email se tiver mais questões.
            </div>
          </div>
        `,
        body,
        emailAttachments
      );

      const { config } = await import('@/utils/config');
      const conversationId = originalMessage.conversationId || originalMessageId;

      const message = await this.prisma.message.create({
        data: {
          fromName: 'Ribeira Azul',
          fromEmail: config.EMAIL_FROM,
          body: body,
          status: 'SENT',
          type: 'OUTBOUND',
          parentMessageId: originalMessageId,
          conversationId: conversationId,
          emailMessageId: emailResult.messageId,
          attachments: attachments.length > 0 ? attachments : undefined,
          context: {
            originalMessageId,
            toEmail: recipient,
            replyTo: recipient,
            subject: replySubject,
            correlationId,
            emailMessageId: emailResult.messageId,
          },
          events: {
            create: {
              type: 'OUTBOUND_SENT',
              details: { 
                correlationId, 
                originalMessageId, 
                emailMessageId: emailResult.messageId,
                attachmentsCount: attachments.length
              },
            },
          },
        },
        include: {
          events: true,
        },
      });

      if (!originalMessage.conversationId) {
        await this.prisma.message.update({
          where: { id: originalMessageId },
          data: { conversationId: conversationId },
        });
      }

      const duration = Date.now() - startTime;
      messageLogger.info('Reply sent and persisted successfully', {
        messageId: message.id,
        originalMessageId,
        duration,
        attachmentsCount: attachments.length
      });

      this.metricsService.incrementCounter('messages_replied_total');
      this.metricsService.recordHistogram('message_reply_duration_ms', duration);

      return message;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      messageLogger.error('Failed to reply to message', {
        error: error.message,
        originalMessageId,
        duration,
      });
      throw error;
    }
  }

  /**
   * Create a message from an incoming IMAP email
   */
  async createFromEmail(data: {
    fromName: string;
    fromEmail: string;
    body: string;
    subject?: string;
    messageId?: string;
    inReplyTo?: string;
    conversationId?: string | null;
    attachments?: any;
  }): Promise<Message> {
    const startTime = Date.now();
    const correlationId = uuidv4();

    try {
      let parentMessageId: string | undefined;
      if (data.inReplyTo) {
        const parent = await this.prisma.message.findFirst({
          where: { emailMessageId: data.inReplyTo },
          select: { id: true },
        });
        parentMessageId = parent?.id;
      }

      const message = await this.prisma.message.create({
        data: {
          fromName: data.fromName,
          fromEmail: data.fromEmail,
          body: data.body,
          status: 'RECEIVED',
          type: 'INBOUND',
          emailMessageId: data.messageId,
          parentMessageId,
          conversationId: data.conversationId || undefined,
          attachments: data.attachments,
          context: {
            subject: data.subject,
            inReplyTo: data.inReplyTo,
            source: 'imap',
            correlationId,
          },
          events: {
            create: {
              type: 'INBOUND_RECEIVED',
              details: {
                source: 'imap',
                subject: data.subject,
                messageId: data.messageId,
                correlationId,
              },
            },
          },
        },
        include: {
          events: true,
        },
      });

      if (!data.conversationId && parentMessageId) {
        await this.prisma.message.update({
          where: { id: message.id },
          data: { conversationId: parentMessageId },
        });

        const parent = await this.prisma.message.findUnique({
          where: { id: parentMessageId },
          select: { conversationId: true },
        });
        if (!parent?.conversationId) {
          await this.prisma.message.update({
            where: { id: parentMessageId },
            data: { conversationId: parentMessageId },
          });
        }
      }

      const duration = Date.now() - startTime;
      this.logger.info('Created message from IMAP email', {
        messageId: message.id,
        fromEmail: data.fromEmail,
        conversationId: data.conversationId,
        parentMessageId,
        duration,
      });

      this.metricsService.incrementCounter('imap_messages_created_total');

      return message;
    } catch (error: any) {
      this.logger.error('Failed to create message from email', {
        fromEmail: data.fromEmail,
        error: error.message,
      });
      throw error;
    }
  }
}
