import { logger } from '@/utils/logger';
import { ApprovalEntity, ApprovalStatus, Prisma, PrismaClient } from '@prisma/client';

export class ApprovalService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create or get existing approval request
   */
  async createOrGet(data: {
    entityType: ApprovalEntity;
    entityId: string;
    requestedBy?: string;
    metadata?: Record<string, any>;
  }) {
    // Check if approval already exists
    const existing = await this.prisma.approval.findUnique({
      where: {
        entityType_entityId: {
          entityType: data.entityType,
          entityId: data.entityId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    const approval = await this.prisma.approval.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        requestedBy: data.requestedBy,
        metadata: data.metadata || undefined,
      },
    });

    logger.info({ approvalId: approval.id, entityType: data.entityType }, 'Approval created');
    return approval;
  }

  /**
   * Get all approvals with filters
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: ApprovalStatus;
    entityType?: ApprovalEntity;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ApprovalWhereInput = {
      ...(options?.status && { status: options.status }),
      ...(options?.entityType && { entityType: options.entityType }),
    };

    const [approvals, total] = await Promise.all([
      this.prisma.approval.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          auditLogs: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      this.prisma.approval.count({ where }),
    ]);

    return {
      data: approvals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get pending approvals
   */
  async findPending(entityType?: ApprovalEntity) {
    return this.prisma.approval.findMany({
      where: {
        status: ApprovalStatus.PENDING,
        ...(entityType && { entityType }),
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get approval by ID
   */
  async findById(id: string) {
    return this.prisma.approval.findUnique({
      where: { id },
      include: {
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Get approval by entity
   */
  async findByEntity(entityType: ApprovalEntity, entityId: string) {
    return this.prisma.approval.findUnique({
      where: {
        entityType_entityId: { entityType, entityId },
      },
      include: {
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Approve an approval request
   */
  async approve(id: string, reviewedBy: string, notes?: string) {
    const approval = await this.prisma.approval.update({
      where: { id },
      data: {
        status: ApprovalStatus.APPROVED,
        reviewedBy,
        reviewedAt: new Date(),
        notes,
      },
    });

    logger.info({ approvalId: id, reviewedBy }, 'Approval approved');
    return approval;
  }

  /**
   * Reject an approval request
   */
  async reject(id: string, reviewedBy: string, notes?: string) {
    const approval = await this.prisma.approval.update({
      where: { id },
      data: {
        status: ApprovalStatus.REJECTED,
        reviewedBy,
        reviewedAt: new Date(),
        notes,
      },
    });

    logger.info({ approvalId: id, reviewedBy }, 'Approval rejected');
    return approval;
  }

  /**
   * Cancel an approval request
   */
  async cancel(id: string) {
    const approval = await this.prisma.approval.update({
      where: { id },
      data: { status: ApprovalStatus.CANCELLED },
    });

    logger.info({ approvalId: id }, 'Approval cancelled');
    return approval;
  }

  /**
   * Get approval statistics
   */
  async getStats() {
    const [pending, approved, rejected, total] = await Promise.all([
      this.prisma.approval.count({ where: { status: ApprovalStatus.PENDING } }),
      this.prisma.approval.count({ where: { status: ApprovalStatus.APPROVED } }),
      this.prisma.approval.count({ where: { status: ApprovalStatus.REJECTED } }),
      this.prisma.approval.count(),
    ]);

    return { pending, approved, rejected, total };
  }

  /**
   * Delete an approval record (for cleanup)
   */
  async delete(id: string) {
    // First delete related audit logs
    await this.prisma.auditLog.deleteMany({
      where: { approvalId: id },
    });

    // Then delete the approval
    await this.prisma.approval.delete({
      where: { id },
    });

    logger.info({ approvalId: id }, 'Approval deleted');
  }
}

