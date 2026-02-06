import { createLogger } from '@/utils/logger';
import { MessageStatus, PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from '../cache.service';
import { MetricsService } from '../metrics.service';
import { MessageCoreService } from './message-core.service';

export class MessageStatsService {
  private logger = createLogger({ service: 'MessageStatsService' });

  constructor(
    private prisma: PrismaClient,
    private cacheService: CacheService,
    private metricsService: MetricsService,
    private coreService: MessageCoreService,
    private emailQueue?: Queue
  ) { }

  /**
   * Get message statistics
   */
  async getMessageStats(agentId?: string): Promise<{
    total: number;
    byStatus: Record<MessageStatus, number>;
    last24Hours: number;
    last7Days: number;
  }> {
    const cacheKey = agentId ? `message:stats:agent:${agentId}` : 'message:stats';
    const cached = await this.cacheService.get<{
      total: number;
      byStatus: Record<MessageStatus, number>;
      last24Hours: number;
      last7Days: number;
    }>(cacheKey);

    if (cached) {
      this.metricsService.incrementCounter('message_stats_cache_hits_total');
      return cached;
    }

    const startTime = Date.now();

    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const baseWhere = agentId ? { agentId, deleted: false } : { deleted: false };

      const [total, unread, byStatus, last24Hours, last7Days] = await Promise.all([
        this.prisma.message.count({
          where: baseWhere,
        }),
        this.prisma.message.count({
          where: { ...baseWhere, read: false },
        }),
        this.prisma.message.groupBy({
          by: ['status'],
          where: baseWhere,
          _count: true,
        }),
        this.prisma.message.count({
          where: {
            ...baseWhere,
            createdAt: { gte: yesterday },
          },
        }),
        this.prisma.message.count({
          where: {
            ...baseWhere,
            createdAt: { gte: weekAgo },
          },
        }),
      ]);

      const statusCounts = byStatus.reduce((acc: Record<MessageStatus, number>, item: any) => {
        const status = item.status as MessageStatus;
        acc[status] = item._count;
        return acc;
      }, {} as Record<MessageStatus, number>);

      const stats = {
        total,
        unread,
        byStatus: statusCounts,
        last24Hours,
        last7Days,
      };

      await this.cacheService.set(cacheKey, stats, 300);

      const duration = Date.now() - startTime;
      this.logger.database('aggregate', 'Message', duration, { total, last24Hours, last7Days });

      this.metricsService.incrementCounter('message_stats_cache_misses_total');

      return stats;
    } catch (error: any) {
      this.logger.error('Failed to get message statistics', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Retry failed messages
   */
  async retryFailedMessages(limit = 10): Promise<number> {
    const startTime = Date.now();

    try {
      const failedMessages = await this.prisma.message.findMany({
        where: {
          status: 'FAILED',
          retries: { lt: 3 },
        },
        take: limit,
        orderBy: { updatedAt: 'asc' },
      });

      if (failedMessages.length === 0) {
        return 0;
      }

      let retriedCount = 0;

      for (const message of failedMessages) {
        try {
          if (this.emailQueue) {
            await this.emailQueue.add(
              'retry-contact-email',
              {
                messageId: message.id,
                fromName: message.fromName,
                fromEmail: message.fromEmail,
                phone: message.phone,
                body: message.body,
                retry: true,
              },
              {
                jobId: `retry-${message.id}-${Date.now()}`,
                delay: 5000,
              }
            );

            await this.coreService.updateMessageStatus(message.id, 'QUEUED', uuidv4());
            retriedCount++;
          }
        } catch (error: any) {
          this.logger.error('Failed to retry message', {
            error: error.message,
            messageId: message.id,
          });
        }
      }

      const duration = Date.now() - startTime;
      this.logger.info('Retried failed messages', {
        retriedCount,
        totalFailed: failedMessages.length,
        duration,
      });

      this.metricsService.incrementCounter('messages_retried_total', retriedCount);

      return retriedCount;
    } catch (error: any) {
      this.logger.error('Failed to retry failed messages', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Clean up old messages
   */
  async cleanupOldMessages(daysOld = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const startTime = Date.now();

    try {
      const result = await this.prisma.message.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          status: { in: ['SENT', 'FAILED'] },
        },
      });

      const duration = Date.now() - startTime;
      this.logger.info('Cleaned up old messages', {
        deletedCount: result.count,
        cutoffDate,
        duration,
      });

      this.metricsService.incrementCounter('messages_cleaned_total', result.count);

      return result.count;
    } catch (error: any) {
      this.logger.error('Failed to cleanup old messages', {
        error: error.message,
        cutoffDate,
      });
      throw error;
    }
  }
}
