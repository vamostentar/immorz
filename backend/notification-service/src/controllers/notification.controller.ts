import { NotificationService } from '@/services/notification.service';
import { NotificationType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

interface NotificationQuery {
  page?: string;
  limit?: string;
  unreadOnly?: string;
  type?: NotificationType;
}

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * GET /notifications
   */
  async list(
    request: FastifyRequest<{ Querystring: NotificationQuery }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const { page, limit, unreadOnly, type } = request.query;

    const result = await this.notificationService.findByUser(userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      unreadOnly: unreadOnly === 'true',
      type,
    });

    return reply.send({ success: true, ...result });
  }

  /**
   * GET /notifications/unread-count
   */
  async unreadCount(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const count = await this.notificationService.getUnreadCount(userId);
    return reply.send({ success: true, data: { count } });
  }

  /**
   * PATCH /notifications/:id/read
   */
  async markAsRead(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const success = await this.notificationService.markAsRead(request.params.id, userId);
    if (!success) {
      return reply.status(404).send({ success: false, error: 'Notification not found' });
    }

    return reply.send({ success: true });
  }

  /**
   * PATCH /notifications/read-all
   */
  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const count = await this.notificationService.markAllAsRead(userId);
    return reply.send({ success: true, data: { updated: count } });
  }

  /**
   * DELETE /notifications/:id
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const success = await this.notificationService.delete(request.params.id, userId);
    if (!success) {
      return reply.status(404).send({ success: false, error: 'Notification not found' });
    }

    return reply.send({ success: true });
  }

  /**
   * POST /notifications
   */
  async create(
    request: FastifyRequest<{
      Body: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        metadata?: Record<string, any>;
      };
    }>,
    reply: FastifyReply
  ) {
    const notification = await this.notificationService.create(request.body);
    return reply.status(201).send({ success: true, data: notification });
  }
}
