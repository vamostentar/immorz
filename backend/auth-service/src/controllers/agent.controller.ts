import { createSuccessResponse } from '@/middlewares/error-handler';
import { UserService } from '@/services/user.service';
import { getRequestContext } from '@/utils/request-context';
import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Controller para endpoints públicos de perfis de agentes
 */
export class AgentController {
    constructor(private userService: UserService) { }

    /**
     * Listar agentes públicos
     * GET /api/v1/agents
     */
    async listPublicAgents(
        request: FastifyRequest<{ Querystring: { limit?: number; page?: number; specialty?: string } }>,
        reply: FastifyReply
    ) {
        const { limit = 20, page = 1, specialty } = request.query;
        const context = getRequestContext(request)!;

        // Buscar todos os utilizadores ativos
        // Nota: Idealmente buscaríamos apenas por role "agent", mas por enquanto filtramos tudo
        const allUsers = await this.userService.findMany(
            { page, limit, sortOrder: 'desc' },
            {
                isActive: true
            }
        );

        // Filtrar apenas agentes com perfil público e aprovado
        let publicAgents = allUsers.data.filter((user: any) =>
            user.isProfilePublic && user.isProfileApproved
        );

        // Filtrar por especialidade se fornecida
        if (specialty) {
            publicAgents = publicAgents.filter((user: any) =>
                user.specialties && user.specialties.includes(specialty)
            );
        }

        return reply.send(
            createSuccessResponse({
                data: publicAgents,
                pagination: allUsers.pagination
            }, context.requestId)
        );
    }

    /**
     * Obter perfil público de um agente
     * GET /api/v1/agents/:userId
     */
    async getPublicAgentProfile(
        request: FastifyRequest<{ Params: { userId: string } }>,
        reply: FastifyReply
    ) {
        const { userId } = request.params;
        const context = getRequestContext(request)!;

        const agent = await this.userService.findById(userId);
 
        // Decoupled: only requires approval to be visible via ID (e.g. from property page)
        if (!(agent as any).isProfileApproved) {
             return reply.code(404).send({
                success: false,
                error: 'Perfil de agente não encontrado ou não está aprovado',
                code: 'AGENT_NOT_FOUND'
            });
         }

        return reply.send(createSuccessResponse(agent, context.requestId));
    }

    /**
     * Agente edita o próprio perfil
     * PATCH /api/v1/user-profiles/me
     */
    async updateMyProfile(
        request: FastifyRequest<{
            Body: {
                bio?: string;
                specialties?: string[];
                experience?: number;
                linkedin?: string;
                facebook?: string;
                instagram?: string;
                isProfilePublic?: boolean;
            }
        }>,
        reply: FastifyReply
    ) {
        const userId = request.user?.id!;
        const context = getRequestContext(request)!;

        const updatedUser = await this.userService.update(
            userId,
            request.body,
            context
        );

        return reply.send(createSuccessResponse(updatedUser, context.requestId));
    }

    /**
     * Admin aprova perfil de agente
     * PATCH /api/v1/admin/agents/:userId/approve
     */
    async approveAgentProfile(
        request: FastifyRequest<{
            Params: { userId: string };
            Body: { isApproved: boolean }
        }>,
        reply: FastifyReply
    ) {
        const { userId } = request.params;
        const { isApproved } = request.body;
        const context = getRequestContext(request)!;

        const updatedUser = await this.userService.update(
            userId,
            { isProfileApproved: isApproved },
            context
        );

        return reply.send(createSuccessResponse(updatedUser, context.requestId));
    }
}
