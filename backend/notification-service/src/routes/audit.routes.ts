import { AuditController } from '@/controllers/audit.controller';
import { FastifyInstance } from 'fastify';

export function registerAuditRoutes(
  fastify: FastifyInstance,
  controller: AuditController
) {
  // List all audit logs
  fastify.get('/audit-logs', controller.list.bind(controller));

  // Get recent activity
  fastify.get('/audit-logs/recent', controller.getRecent.bind(controller));

  // Get logs by entity
  fastify.get('/audit-logs/entity/:type/:id', controller.getByEntity.bind(controller));

  // Get logs by user
  fastify.get('/audit-logs/user/:userId', controller.getByUser.bind(controller));
}
