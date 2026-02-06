import { NotificationController } from '@/controllers/notification.controller';
import { FastifyInstance } from 'fastify';

export function registerNotificationRoutes(
  fastify: FastifyInstance,
  controller: NotificationController
) {
  // List notifications
  fastify.get('/notifications', controller.list.bind(controller));

  // Create notification
  fastify.post('/notifications', controller.create.bind(controller));

  // Get unread count
  fastify.get('/notifications/unread-count', controller.unreadCount.bind(controller));

  // Mark single notification as read
  fastify.patch('/notifications/:id/read', controller.markAsRead.bind(controller));

  // Mark all notifications as read
  fastify.patch('/notifications/read-all', controller.markAllAsRead.bind(controller));

  // Delete notification
  fastify.delete('/notifications/:id', controller.delete.bind(controller));
}
