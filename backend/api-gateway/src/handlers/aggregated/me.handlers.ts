/**
 * Handlers de Perfil Pessoal (/me) - Agregador API Gateway
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../config.js';
import { AggregatedUser } from './types.js';
import { fetchAuthUser, forwardRequest } from './utils.js';

export function registerMeHandlers(app: FastifyInstance) {
    /**
     * GET /api/v1/users/me - Obtém dados completos do utilizador actual
     */
    app.get('/api/v1/users/me', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.id;
            const authHeader = request.headers.authorization;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            // 1. Buscar dados essenciais (Auth Service)
            const authUser = await fetchAuthUser(userId, authHeader, (request as any).user);

            if (!authUser) {
                return reply.status(404).send({
                    success: false,
                    error: 'Utilizador não encontrado',
                    code: 'USER_NOT_FOUND'
                });
            }

            // 2. Buscar perfil estendido (User Service) - Opcional
            let userProfile = null;
            try {
                const response = await forwardRequest({
                    url: `${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`,
                    method: 'GET',
                    authHeader,
                    authUser: (request as any).user
                });
                
                if (response.ok) {
                    const profileData = await response.json();
                    userProfile = profileData.data ?? profileData;
                }
            } catch (error) {
                console.warn(`⚠️ Não foi possível obter perfil do user-service para ${userId} (ignorando)`);
            }

            const aggregatedUser: AggregatedUser = {
                id: authUser.id,
                email: authUser.email,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
                phone: authUser.phone,
                role: authUser.role,
                isActive: authUser.isActive ?? true,
                isEmailVerified: authUser.isEmailVerified ?? false,
                twoFactorEnabled: authUser.twoFactorEnabled ?? authUser.two_factor_enabled ?? false,
                createdAt: authUser.createdAt,
                updatedAt: authUser.updatedAt,
                profile: userProfile || undefined
            };

            return reply.send({
                success: true,
                data: aggregatedUser,
                message: 'Utilizador obtido com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro no handler /users/me:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno ao processar dados do utilizador',
                code: 'INTERNAL_ERROR'
            });
        }
    });
}
