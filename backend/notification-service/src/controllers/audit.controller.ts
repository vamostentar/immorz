import { AuditService } from '@/services/audit.service';
import { FastifyReply, FastifyRequest } from 'fastify';

interface AuditQuery {
  page?: string;
  limit?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * GET /audit-logs
   */
  async list(
    request: FastifyRequest<{ Querystring: AuditQuery }>,
    reply: FastifyReply
  ) {
    const { page, limit, userId, entityType, entityId, action, startDate, endDate } = request.query;

    const result = await this.auditService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      userId,
      entityType,
      entityId,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return reply.send({ success: true, ...result });
  }

  /**
   * GET /audit-logs/entity/:type/:id
   */
  async getByEntity(
    request: FastifyRequest<{ Params: { type: string; id: string } }>,
    reply: FastifyReply
  ) {
    const { type, id } = request.params;
    const logs = await this.auditService.findByEntity(type, id);
    return reply.send({ success: true, data: logs });
  }

  /**
   * GET /audit-logs/user/:userId
   */
  async getByUser(
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : undefined;
    const logs = await this.auditService.findByUser(userId, limit);
    return reply.send({ success: true, data: logs });
  }

  /**
   * GET /audit-logs/recent
   */
  async getRecent(
    request: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : undefined;
    const logs = await this.auditService.getRecentActivity(limit);
    return reply.send({ success: true, data: logs });
  }
}
