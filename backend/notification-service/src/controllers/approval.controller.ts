import { ApprovalSyncService } from '@/services/approval-sync.service';
import { ApprovalService } from '@/services/approval.service';
import { AuditService } from '@/services/audit.service';
import { EmailService } from '@/services/email.service';
import { NotificationService } from '@/services/notification.service';
import { logger } from '@/utils/logger';
import { ApprovalEntity, ApprovalStatus, NotificationType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

interface ApprovalQuery {
  page?: string;
  limit?: string;
  status?: ApprovalStatus;
  entityType?: ApprovalEntity;
}

interface ApproveRejectBody {
  notes?: string;
}

export class ApprovalController {
  constructor(
    private readonly approvalService: ApprovalService,
    private readonly approvalSyncService: ApprovalSyncService,
    private readonly auditService: AuditService,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService
  ) {}

  /**
   * GET /approvals
   */
  async list(
    request: FastifyRequest<{ Querystring: ApprovalQuery }>,
    reply: FastifyReply
  ) {
    const { page, limit, status, entityType } = request.query;

    const result = await this.approvalService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      entityType,
    });

    return reply.send({ success: true, ...result });
  }

  /**
   * GET /approvals/pending
   */
  async listPending(
    request: FastifyRequest<{ Querystring: { entityType?: ApprovalEntity } }>,
    reply: FastifyReply
  ) {
    const approvals = await this.approvalService.findPending(request.query.entityType);
    return reply.send({ success: true, data: approvals });
  }

  /**
   * GET /approvals/stats
   */
  async stats(request: FastifyRequest, reply: FastifyReply) {
    const stats = await this.approvalService.getStats();
    return reply.send({ success: true, data: stats });
  }

  /**
   * GET /approvals/:id
   */
  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const approval = await this.approvalService.findById(request.params.id);
    if (!approval) {
      return reply.status(404).send({ success: false, error: 'Approval not found' });
    }

    return reply.send({ success: true, data: approval });
  }

  /**
   * POST /approvals
   */
  async create(
    request: FastifyRequest<{
      Body: {
        entityType: ApprovalEntity;
        entityId: string;
        metadata?: Record<string, any>;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    const { entityType, entityId, metadata } = request.body;

    const approval = await this.approvalService.createOrGet({
      entityType,
      entityId,
      requestedBy: userId,
      metadata,
    });

    // Log the action
    await this.auditService.log({
      userId: userId || 'system',
      action: 'APPROVAL_REQUESTED',
      entityType,
      entityId,
      approvalId: approval.id,
      ipAddress: request.ip,
    });

    return reply.status(201).send({ success: true, data: approval });
  }

  /**
   * PATCH /approvals/:id/approve
   */
  async approve(
    request: FastifyRequest<{ Params: { id: string }; Body: ApproveRejectBody }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const approval = await this.approvalService.findById(request.params.id);
    if (!approval) {
      return reply.status(404).send({ success: false, error: 'Approval not found' });
    }

    const updated = await this.approvalService.approve(
      request.params.id,
      userId,
      request.body.notes
    );

    // Log the action
    await this.auditService.log({
      userId,
      action: 'APPROVAL_APPROVED',
      entityType: approval.entityType,
      entityId: approval.entityId,
      approvalId: approval.id,
      changes: { status: 'APPROVED', notes: request.body.notes },
      ipAddress: request.ip,
    });

    // Send notification (async, don't wait)
    this.sendApprovalNotification(approval, 'approved', request.body.notes).catch((err) =>
      logger.error({ err }, 'Failed to send approval notification')
    );

    // Sync with source service (async, log errors but don't block response)
    const authToken = request.headers.authorization?.replace('Bearer ', '');
    this.approvalSyncService.syncApproval(
      approval.entityType,
      approval.entityId,
      true, // isApproved = true
      authToken
    ).then((result) => {
      if (!result.success) {
        logger.error({ entityType: approval.entityType, entityId: approval.entityId, error: result.error }, 'Failed to sync approval to source service');
      }
    }).catch((err) => logger.error({ err }, 'Approval sync exception'));

    return reply.send({ success: true, data: updated });
  }

  /**
   * PATCH /approvals/:id/reject
   */
  async reject(
    request: FastifyRequest<{ Params: { id: string }; Body: ApproveRejectBody }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const approval = await this.approvalService.findById(request.params.id);
    if (!approval) {
      return reply.status(404).send({ success: false, error: 'Approval not found' });
    }

    const updated = await this.approvalService.reject(
      request.params.id,
      userId,
      request.body.notes
    );

    // Log the action
    await this.auditService.log({
      userId,
      action: 'APPROVAL_REJECTED',
      entityType: approval.entityType,
      entityId: approval.entityId,
      approvalId: approval.id,
      changes: { status: 'REJECTED', notes: request.body.notes },
      ipAddress: request.ip,
    });

    // Send notification (async)
    this.sendApprovalNotification(approval, 'rejected', request.body.notes).catch((err) =>
      logger.error({ err }, 'Failed to send rejection notification')
    );

    // Sync with source service (async, log errors but don't block response)
    const authToken = request.headers.authorization?.replace('Bearer ', '');
    this.approvalSyncService.syncApproval(
      approval.entityType,
      approval.entityId,
      false, // isApproved = false
      authToken
    ).then((result) => {
      if (!result.success) {
        logger.error({ entityType: approval.entityType, entityId: approval.entityId, error: result.error }, 'Failed to sync rejection to source service');
      }
    }).catch((err) => logger.error({ err }, 'Rejection sync exception'));

    return reply.send({ success: true, data: updated });
  }

  /**
   * DELETE /approvals/:id
   * Delete an approval entry (admin only - for cleanup)
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const approval = await this.approvalService.findById(request.params.id);
    if (!approval) {
      return reply.status(404).send({ success: false, error: 'Approval not found' });
    }

    await this.approvalService.delete(request.params.id);

    // Log the deletion (without linking to the deleted approval ID to avoid FK error)
    await this.auditService.log({
      userId,
      action: 'APPROVAL_DELETED',
      entityType: approval.entityType,
      entityId: approval.entityId,
      approvalId: undefined, // Don't link to the deleted approval
      changes: { deleted: true, originalApprovalId: approval.id },
      ipAddress: request.ip,
    });

    logger.info({ approvalId: request.params.id, userId }, 'Approval deleted');

    return reply.status(204).send();
  }

  /**
   * Send approval/rejection notification
   */
  private async sendApprovalNotification(
    approval: { entityType: ApprovalEntity; entityId: string; requestedBy?: string | null },
    status: 'approved' | 'rejected',
    notes?: string
  ) {
    if (!approval.requestedBy) return;

    const notificationType =
      approval.entityType === 'AGENT'
        ? status === 'approved'
          ? NotificationType.AGENT_APPROVED
          : NotificationType.AGENT_REJECTED
        : status === 'approved'
        ? NotificationType.PROPERTY_APPROVED
        : NotificationType.PROPERTY_REJECTED;

    // Create in-app notification
    await this.notificationService.create({
      userId: approval.requestedBy,
      type: notificationType,
      title: `${approval.entityType} ${status === 'approved' ? 'aprovado' : 'rejeitado'}`,
      message: notes || `O seu pedido foi ${status === 'approved' ? 'aprovado' : 'rejeitado'}.`,
      metadata: { entityType: approval.entityType, entityId: approval.entityId },
    });

    // TODO: Get user email from auth-service and send email notification
  }
}

