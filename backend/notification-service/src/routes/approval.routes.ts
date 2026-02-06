import { ApprovalController } from '@/controllers/approval.controller';
import { FastifyInstance } from 'fastify';

export function registerApprovalRoutes(
  fastify: FastifyInstance,
  controller: ApprovalController
) {
  // List all approvals
  fastify.get('/approvals', controller.list.bind(controller));

  // List pending approvals
  fastify.get('/approvals/pending', controller.listPending.bind(controller));

  // Get approval stats
  fastify.get('/approvals/stats', controller.stats.bind(controller));

  // Get single approval
  fastify.get('/approvals/:id', controller.getById.bind(controller));

  // Create approval request
  fastify.post('/approvals', controller.create.bind(controller));

  // Approve
  fastify.patch('/approvals/:id/approve', controller.approve.bind(controller));

  // Reject
  fastify.patch('/approvals/:id/reject', controller.reject.bind(controller));

  // Delete approval (admin only - for cleanup)
  fastify.delete('/approvals/:id', controller.delete.bind(controller));
}

