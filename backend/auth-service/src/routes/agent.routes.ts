import { AgentController } from '@/controllers/agent.controller';
import { authenticate, requireRole } from '@/middlewares/auth.middleware';
import { UserService } from '@/services/user.service';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

export async function agentRoutes(fastify: FastifyInstance) {
    const prisma = fastify.prisma as PrismaClient;
    const userService = new UserService(prisma);
    const agentController = new AgentController(userService);

    // Rotas públicas (sem autenticação)
    fastify.get('/agents', {
        schema: {
            tags: ['Agents'],
            summary: 'Listar agentes públicos',
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'number', default: 20 },
                    page: { type: 'number', default: 1 },
                    specialty: { type: 'string' },
                },
            },
        },
    }, agentController.listPublicAgents.bind(agentController));

    fastify.get('/agents/:userId', {
        schema: {
            tags: ['Agents'],
            summary: 'Perfil público de agente',
            params: {
                type: 'object',
                required: ['userId'],
                properties: {
                    userId: { type: 'string' },
                },
            },
        },
    }, agentController.getPublicAgentProfile.bind(agentController));

    // Rotas autenticadas
    fastify.register(async function authenticatedAgentRoutes(fastify) {
        fastify.addHook('onRequest', authenticate);

        // Agente edita próprio perfil
        fastify.patch('/user-profiles/me', {
            schema: {
                tags: ['Agents'],
                summary: 'Agente edita próprio perfil',
                security: [{ bearerAuth: [] }],
                body: {
                    type: 'object',
                    properties: {
                        bio: { type: 'string' },
                        specialties: { type: 'array', items: { type: 'string' } },
                        experience: { type: 'number' },
                        linkedin: { type: 'string' },
                        facebook: { type: 'string' },
                        instagram: { type: 'string' },
                        isProfilePublic: { type: 'boolean' },
                    },
                },
            },
        }, agentController.updateMyProfile.bind(agentController));

        // Admin aprova perfil
        fastify.register(async function adminAgentRoutes(fastify) {
            fastify.addHook('onRequest', requireRole(['admin', 'super_admin']));

            fastify.patch('/admin/agents/:userId/approve', {
                schema: {
                    tags: ['Agents'],
                    summary: 'Admin aprova perfil de agente',
                    security: [{ bearerAuth: [] }],
                    params: {
                        type: 'object',
                        required: ['userId'],
                        properties: {
                            userId: { type: 'string' },
                        },
                    },
                    body: {
                        type: 'object',
                        required: ['isApproved'],
                        properties: {
                            isApproved: { type: 'boolean' },
                        },
                    },
                },
            }, agentController.approveAgentProfile.bind(agentController));
        });
    });
}
