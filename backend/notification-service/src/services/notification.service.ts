import { logger } from '@/utils/logger';
import { NotificationChannel, NotificationType, Prisma, PrismaClient } from '@prisma/client';

export class NotificationService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new notification
   */
  async create(data: {
    userId: string;
    type: NotificationType;
    channel?: NotificationChannel;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        channel: data.channel || NotificationChannel.IN_APP,
        title: data.title,
        message: data.message,
        metadata: data.metadata || undefined,
      },
    });

    logger.info({ notificationId: notification.id }, 'Notification created');
    return notification;
  }

  /**
   * Get notifications for a user
   */
  async findByUser(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
      type?: NotificationType;
    }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(options?.unreadOnly && { isRead: false }),
      ...(options?.type && { type: options.type }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });

    logger.info({ notificationId: id }, 'Notification marked as read');
    return notification.count > 0;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    logger.info({ userId, count: result.count }, 'All notifications marked as read');
    return result.count;
  }

  /**
   * Delete (archive) a notification
   */
  async delete(id: string, userId: string) {
    const notification = await this.prisma.notification.deleteMany({
      where: { id, userId },
    });

    return notification.count > 0;
  }

  /**
   * Update notification status after email send
   */
  async markAsSent(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { sentAt: new Date() },
    });
  }

  /**
   * Mark notification as failed
   */
  async markAsFailed(id: string, errorReason: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { failedAt: new Date(), errorReason },
    });
  }
}
