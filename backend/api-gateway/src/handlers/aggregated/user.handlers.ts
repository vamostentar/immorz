/**
 * Handlers de Gestão de Utilizadores - Agregador API Gateway
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../config.js';
import { invalidateUserCache } from '../../middleware/user-enricher.js';
import { forwardRequest } from './utils.js';

export function registerUserHandlers(app: FastifyInstance) {
    /**
     * GET /api/v1/users - Lista utilizadores
     */
    app.get('/api/v1/users', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            const query = request.query as any;
            const authUser = (request as any).user;

            const response = await forwardRequest({
                url: `${config.AUTH_SERVICE_URL}/api/v1/users?${new URLSearchParams(query).toString()}`,
                method: 'GET',
                authHeader,
                authUser
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return reply.status(response.status).send(errorData);
            }

            const data = await response.json();
            return reply.send(data);
        } catch (error) {
            console.error('❌ Erro no handler /users:', error);
            return reply.status(500).send({ success: false, error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' });
        }
    });

    /**
     * POST /api/v1/users - Criar novo utilizador
     */
    app.post('/api/v1/users', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            const userData = request.body;
            const authUser = (request as any).user;

            const response = await forwardRequest({
                url: `${config.AUTH_SERVICE_URL}/api/v1/users`,
                method: 'POST',
                authHeader,
                authUser,
                body: userData
            });

            const data = await response.json().catch(() => ({}));
            return reply.status(response.status).send(data);
        } catch (error: any) {
            return reply.status(500).send({ success: false, error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' });
        }
    });

    /**
     * PUT /api/v1/users/:userId - Actualiza dados de um utilizador
     */
    app.put<{ Params: { userId: string }; Body: Record<string, unknown> }>(
        '/api/v1/users/:userId',
        async (request: FastifyRequest<{ Params: { userId: string }; Body: Record<string, unknown> }>, reply: FastifyReply) => {
            try {
                let { userId } = request.params;
                const updateData = request.body;
                const authHeader = request.headers.authorization;

                if (userId === 'me') {
                    userId = (request as any).user?.id;
                    if (!userId) return reply.status(401).send({ success: false, error: 'Não autenticado' });
                }

                const response = await forwardRequest({
                    url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
                    method: 'PUT',
                    authHeader,
                    authUser: (request as any).user,
                    body: updateData
                });

                const data = await response.json().catch(() => ({}));
                if (response.ok) invalidateUserCache(userId);
                return reply.status(response.status).send(data);
            } catch (error) {
                return reply.status(500).send({ success: false, error: 'Erro interno' });
            }
        }
    );

    /**
     * DELETE /api/v1/users/:userId - Elimina utilizador
     */
    app.delete<{ Params: { userId: string } }>('/api/v1/users/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        try {
            const { userId } = request.params;
            const authHeader = request.headers.authorization;
            const authUser = (request as any).user;

            // 1. Eliminar perfil no user-service
            try {
                await forwardRequest({
                    url: `${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`,
                    method: 'DELETE',
                    authHeader,
                    authUser
                });
            } catch (e) { /* ignorar */ }

            // 2. Eliminar utilizador no auth-service
            const response = await forwardRequest({
                url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
                method: 'DELETE',
                authHeader,
                authUser
            });

            if (response.ok) invalidateUserCache(userId);
            const data = await response.json().catch(() => ({}));
            return reply.status(response.status).send(data);
        } catch (error) {
            return reply.status(500).send({ success: false, error: 'Erro interno' });
        }
    });
}
