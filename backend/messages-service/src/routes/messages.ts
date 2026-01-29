import { config, configService } from '@/utils/config';
import { createCorrelationId } from '@/utils/logger';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';

// Validation schemas
const createMessageSchema = z.object({
  fromName: z.string().min(2).max(100),
  fromEmail: z.string().email(),
  phone: z.string().optional(),
  body: z.string().min(5).max(5000),
  context: z.any().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
});

// JSON Schema for Fastify
const createMessageJsonSchema = {
  type: 'object',
  required: ['fromName', 'fromEmail', 'body'],
  properties: {
    fromName: { type: 'string', minLength: 2, maxLength: 100 },
    fromEmail: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    body: { type: 'string', minLength: 5, maxLength: 5000 },
    context: { type: 'object' },
    propertyId: { type: 'string' },
    agentId: { type: 'string' }
  },
  additionalProperties: false
};

// Simple authentication - accepts API key OR x-user headers from api-gateway
async function authenticateRequest(request: FastifyRequest): Promise<boolean> {
  // Check for x-user headers from api-gateway (JWT-based auth)
  const userId = request.headers['x-user-id'] as string;
  const userRole = request.headers['x-user-role'] as string;

  // If we have user info from api-gateway, user is authenticated
  if (userId && userRole) {
    return true;
  }

  // Fallback to API key validation
  const apiKey = request.headers[config.API_KEY_HEADER] as string;
  const allowedKeysSet = configService.allowedApiKeys;

  if (allowedKeysSet.size === 0) {
    return true; // No API key validation if not configured
  }

  return !!(apiKey && allowedKeysSet.has(apiKey));
}


export async function registerMessageRoutes(app: FastifyInstance) {
  const { messageService, metricsService } = app.diContainer;

  // Add correlation ID
  app.addHook('onRequest', async (request) => {
    const correlationId = (request.headers['x-correlation-id'] as string) || createCorrelationId();
    request.correlationId = correlationId;
  });

  // Authentication for POST requests
  app.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/v1/messages') && request.method !== 'GET') {
      const isAuthenticated = await authenticateRequest(request);
      if (!isAuthenticated) {
        metricsService.incrementCounter('unauthorized_requests_total');
        return reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Valid API key required',
        });
      }
    }
  });

  // Create message
  app.post<{
    Body: z.infer<typeof createMessageSchema>;
  }>('/api/v1/messages', {
    schema: {
      body: createMessageJsonSchema,
    },
  }, async (request, reply) => {
    const startTime = Date.now();
    const { fromName, fromEmail, phone, body, context, propertyId, agentId } = request.body;
    const correlationId = request.correlationId!;

    try {
      request.log.info(`Creating message from ${fromEmail} (${correlationId})`);

      const message = await messageService.createMessage({
        fromName,
        fromEmail,
        phone,
        body,
        context: {
          ...context,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          correlationId,
        },
        propertyId,
        agentId,
        correlationId,
      });

      const duration = Date.now() - startTime;
      request.log.info(`Message created: ${message.id} in ${duration}ms`);

      return reply.code(201).send({
        success: true,
        data: {
          id: message.id,
          status: message.status,
        },
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      request.log.error(`Failed to create message: ${error.message} (${duration}ms)`);

      metricsService.incrementCounter('message_creation_errors_total');

      return reply.code(500).send({
        success: false,
        error: 'MESSAGE_CREATION_FAILED',
        message: 'Failed to create message',
      });
    }
  });

  // Get message by ID
  app.get<{
    Params: { id: string };
  }>('/api/v1/messages/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const message = await messageService.getMessageById(id);

      if (!message) {
        return reply.code(404).send({
          success: false,
          error: 'NOT_FOUND',
          message: 'Message not found',
        });
      }

      request.log.info(`Message retrieved: ${id}`);

      return reply.send({
        success: true,
        data: message,
      });
    } catch (error: any) {
      request.log.error(`Failed to get message ${id}: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'FETCH_FAILED',
        message: 'Failed to fetch message',
      });
    }
  });

  // Get messages with pagination
  app.get('/api/v1/messages', async (request, reply) => {
    const query = request.query as any;
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);

    try {
      const filters: any = {};
      if (query.status) filters.status = query.status;
      if (query.type) filters.type = query.type;  // INBOUND or OUTBOUND
      if (query.fromEmail) filters.fromEmail = query.fromEmail;
      if (query.dateFrom) filters.dateFrom = new Date(query.dateFrom);
      if (query.dateTo) filters.dateTo = new Date(query.dateTo);
      if (query.agentId) filters.agentId = query.agentId;
      if (query.propertyId) filters.propertyId = query.propertyId;
      if (query.read !== undefined) filters.read = query.read === 'true';
      if (query.deleted !== undefined) filters.deleted = query.deleted === 'true';
      if (query.search) filters.search = query.search;


      const result = await messageService.getMessages(page, limit, filters);

      request.log.info(`Messages retrieved: ${result.data.length}/${result.total}`);

      return reply.send({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error: any) {
      request.log.error(`Failed to get messages: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'FETCH_FAILED',
        message: 'Failed to fetch messages',
      });
    }
  });

  // Get statistics
  app.get('/api/v1/messages/stats', async (request, reply) => {
    try {
      const { agentId } = request.query as { agentId?: string };
      const stats = await messageService.getMessageStats(agentId);
      const logMessage = agentId
        ? `Stats retrieved: ${stats.total} total messages for agent ${agentId}`
        : `Stats retrieved: ${stats.total} total messages`;
      request.log.info(logMessage);

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      request.log.error(`Failed to get stats: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'STATS_FAILED',
        message: 'Failed to fetch statistics',
      });
    }
  });

  // Retry failed messages
  app.post('/api/v1/messages/retry', async (request, reply) => {
    try {
      const retriedCount = await messageService.retryFailedMessages();
      request.log.info(`Retried ${retriedCount} messages`);

      return reply.send({
        success: true,
        data: { retriedCount },
      });
    } catch (error: any) {
      request.log.error(`Failed to retry messages: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'RETRY_FAILED',
        message: 'Failed to retry messages',
      });
    }
  });

  // Reply to a message
  app.post<{
    Params: { id: string };
    Body: { body: string; subject?: string };
  }>('/api/v1/messages/:id/reply', {
    schema: {
      body: {
        type: 'object',
        required: ['body'],
        properties: {
          body: { type: 'string', minLength: 5, maxLength: 10000 },
          subject: { type: 'string', minLength: 1, maxLength: 200 },
        },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { body: replyBody, subject } = request.body;

    try {
      // Use service method which handles email sending and persistence
      const replyMessage = await messageService.replyToMessage(id, replyBody, subject);

      // Mark original message as read
      await messageService.markAsRead(id);

      const context = replyMessage.context as any;

      request.log.info({
        replyMessageId: replyMessage.id,
        to: context?.replyTo
      }, `Reply sent to ${context?.replyTo} for message ${id}`);

      return reply.send({
        success: true,
        data: {
          messageId: id,
          repliedTo: context?.replyTo,
          replyMessageId: replyMessage.id
        },
      });
    } catch (error: any) {
      request.log.error(`Failed to send reply for message ${id}: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'REPLY_FAILED',
        message: 'Failed to send reply',
      });
    }
  });

  // Mark message as read
  app.patch<{
    Params: { id: string };
  }>('/api/v1/messages/:id/read', async (request, reply) => {
    const { id } = request.params;

    try {
      await messageService.markAsRead(id);

      return reply.send({
        success: true,
        data: { id, read: true },
      });
    } catch (error: any) {
      request.log.error(`Failed to mark message ${id} as read: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'UPDATE_FAILED',
        message: 'Failed to update message',
      });
    }
  });

  // Mark message as unread
  app.patch<{
    Params: { id: string };
  }>('/api/v1/messages/:id/unread', async (request, reply) => {
    const { id } = request.params;

    try {
      await messageService.markAsUnread(id);

      return reply.send({
        success: true,
        data: { id, read: false },
      });
    } catch (error: any) {
      request.log.error(`Failed to mark message ${id} as unread: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'UPDATE_FAILED',
        message: 'Failed to update message',
      });
    }
  });

  // Delete message
  app.delete<{
    Params: { id: string };
  }>('/api/v1/messages/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await messageService.deleteMessage(id);

      request.log.info(`Message moved to trash: ${id}`);

      return reply.send({
        success: true,
        data: { id, deleted: true },
      });
    } catch (error: any) {
      request.log.error(`Failed to delete message ${id}: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'DELETE_FAILED',
        message: 'Failed to delete message',
      });
    }
  });

  // Restore message from trash
  app.patch<{
    Params: { id: string };
  }>('/api/v1/messages/:id/restore', async (request, reply) => {
    const { id } = request.params;

    try {
      await messageService.restoreMessage(id);

      request.log.info(`Message restored: ${id}`);

      return reply.send({
        success: true,
        data: { id, restored: true },
      });
    } catch (error: any) {
      request.log.error(`Failed to restore message ${id}: ${error.message}`);

      return reply.code(500).send({
        success: false,
        error: 'RESTORE_FAILED',
        message: 'Failed to restore message',
      });
    }
  });
}
