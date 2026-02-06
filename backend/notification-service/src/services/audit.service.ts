import { logger } from '@/utils/logger';
import { Prisma, PrismaClient } from '@prisma/client';

export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Log an action
   */
  async log(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, any>;
    approvalId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const auditLog = await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        changes: data.changes || undefined,
        approvalId: data.approvalId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    logger.debug({ auditLogId: auditLog.id, action: data.action }, 'Audit log created');
    return auditLog;
  }

  /**
   * Get audit logs with filters
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      ...(options?.userId && { userId: options.userId }),
      ...(options?.entityType && { entityType: options.entityType }),
      ...(options?.entityId && { entityId: options.entityId }),
      ...(options?.action && { action: options.action }),
      ...(options?.startDate || options?.endDate
        ? {
            createdAt: {
              ...(options?.startDate && { gte: options.startDate }),
              ...(options?.endDate && { lte: options.endDate }),
            },
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          approval: {
            select: {
              id: true,
              entityType: true,
              entityId: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit logs for a specific entity
   */
  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async findByUser(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 20) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
