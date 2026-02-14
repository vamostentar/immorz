/**
 * Handlers Administrativos - Agregador API Gateway
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../config.js';
import { invalidateUserCache } from '../../middleware/user-enricher.js';
import { AggregatedUser } from './types.js';
import { fetchAuthUser, fetchUserProfile, forwardRequest } from './utils.js';

export function registerAdminHandlers(app: FastifyInstance) {
    /**
     * GET /api/v1/admin/users - Lista utilizadores para admin
     */
    app.get('/api/v1/admin/users', async (request: FastifyRequest, reply: FastifyReply) => {
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
            console.error('❌ Erro no handler /admin/users:', error);
            return reply.status(500).send({ success: false, error: 'Erro interno' });
        }
    });

    /**
     * GET /api/v1/admin/users/:userId - Obtém utilizador específico com dados agregados
     */
    app.get('/api/v1/admin/users/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.params as { userId: string };
            const authHeader = request.headers.authorization;

            const [authUser, userProfile] = await Promise.all([
                fetchAuthUser(userId, authHeader, (request as any).user),
                fetchUserProfile(userId, authHeader, (request as any).user)
            ]);

            if (!authUser) {
                return reply.status(404).send({ success: false, error: 'Utilizador não encontrado' });
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
                twoFactorEnabled: authUser.twoFactorEnabled ?? false,
                createdAt: authUser.createdAt,
                updatedAt: authUser.updatedAt,
                profile: {
                    bio: authUser.bio,
                    avatar: authUser.avatar,
                    dateOfBirth: userProfile?.dateOfBirth,
                    gender: userProfile?.gender,
                    address: userProfile?.address,
                    city: userProfile?.city,
                    state: userProfile?.state,
                    country: userProfile?.country,
                    postalCode: userProfile?.postalCode,
                    preferredContactMethod: userProfile?.preferredContactMethod,
                    language: userProfile?.language,
                    timezone: userProfile?.timezone,
                    profileVisibility: userProfile?.profileVisibility,
                    allowMarketing: userProfile?.allowMarketing,
                    allowNotifications: userProfile?.allowNotifications,
                    specialties: authUser.specialties,
                    rating: authUser.rating,
                    reviewCount: authUser.reviewCount,
                    experience: authUser.experience,
                    linkedin: authUser.linkedin,
                    facebook: authUser.facebook,
                    instagram: authUser.instagram,
                    isProfilePublic: authUser.isProfilePublic,
                    isProfileApproved: authUser.isProfileApproved
                }
            };

            if (userProfile && aggregatedUser.profile) {
                aggregatedUser.profile = {
                    ...aggregatedUser.profile,
                    bio: userProfile.bio || aggregatedUser.profile.bio,
                    avatar: userProfile.avatar || aggregatedUser.profile.avatar,
                    specialties: userProfile.specialties || aggregatedUser.profile.specialties,
                    experience: userProfile.experience || aggregatedUser.profile.experience,
                };
            }

            return reply.send({ success: true, data: aggregatedUser });
        } catch (error) {
            return reply.status(500).send({ success: false, error: 'Erro interno' });
        }
    });

    /**
     * POST /api/v1/users/:userId/reset-2fa - Reseta 2FA
     */
    app.post<{ Params: { userId: string } }>('/api/v1/users/:userId/reset-2fa', async (request, reply) => {
        try {
            const { userId } = request.params;
            const response = await forwardRequest({
                url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}/reset-2fa`,
                method: 'POST',
                authHeader: request.headers.authorization,
                authUser: (request as any).user
            });
            if (response.ok) invalidateUserCache(userId);
            const data = await response.json().catch(() => ({}));
            return reply.status(response.status).send(data);
        } catch (error) {
            return reply.status(500).send({ success: false, error: 'Erro interno' });
        }
    });

    /**
     * GET /api/v1/users/statistics - Estatísticas de utilizadores
     */
    app.get('/api/v1/users/statistics', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const response = await forwardRequest({
                url: `${config.AUTH_SERVICE_URL}/api/v1/users/statistics`,
                method: 'GET',
                authHeader: request.headers.authorization,
                authUser: (request as any).user
            });

            if (!response.ok && response.status === 404) {
                // Fallback para estatísticas básicas se endpoint não existir
                const usersResponse = await forwardRequest({
                    url: `${config.AUTH_SERVICE_URL}/api/v1/users`,
                    method: 'GET',
                    authHeader: request.headers.authorization,
                    authUser: (request as any).user
                });

                if (usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    const users = usersData.data?.items || usersData.data || [];
                    return reply.send({
                        success: true,
                        data: {
                            totalUsers: users.length,
                            activeUsers: users.filter((u: any) => u.isActive).length,
                            verifiedUsers: users.filter((u: any) => u.isEmailVerified).length,
                        }
                    });
                }
            }

            const data = await response.json().catch(() => ({}));
            return reply.status(response.status).send(data);
        } catch (error) {
            return reply.status(500).send({ success: false, error: 'Erro interno' });
        }
    });

    /**
     * GET /api/v1/users/:userId/permissions - Obtém permissões
     */
    app.get<{ Params: { userId: string } }>('/api/v1/users/:userId/permissions', async (request, reply) => {
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${request.params.userId}/permissions`,
            method: 'GET',
            authHeader: request.headers.authorization,
            authUser: (request as any).user
        });
        const data = await response.json().catch(() => ({}));
        return reply.status(response.status).send(data);
    });

    /**
     * PUT /api/v1/users/:userId/permissions - Atualiza permissões
     */
    app.put<{ Params: { userId: string }; Body: any }>('/api/v1/users/:userId/permissions', async (request, reply) => {
        const { userId } = request.params;
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}/permissions`,
            method: 'PUT',
            authHeader: request.headers.authorization,
            authUser: (request as any).user,
            body: request.body
        });
        if (response.ok) invalidateUserCache(userId);
        const data = await response.json().catch(() => ({}));
        return reply.status(response.status).send(data);
    });

    // Outros handlers administrativos (activate, deactivate, reset-password, verify-email, communication, bulk-import, audit)
    // seguem o mesmo padrão de encaminhamento...
    
    app.post<{ Params: { userId: string } }>('/api/v1/users/:userId/activate', async (request, reply) => {
        const { userId } = request.params;
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}/activate`,
            method: 'POST',
            authHeader: request.headers.authorization,
            authUser: (request as any).user
        });
        if (response.ok) invalidateUserCache(userId);
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });

    app.post<{ Params: { userId: string } }>('/api/v1/users/:userId/deactivate', async (request, reply) => {
        const { userId } = request.params;
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}/deactivate`,
            method: 'POST',
            authHeader: request.headers.authorization,
            authUser: (request as any).user
        });
        if (response.ok) invalidateUserCache(userId);
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });

    app.post<{ Params: { userId: string }; Body: any }>('/api/v1/users/:userId/reset-password', async (request, reply) => {
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${request.params.userId}/reset-password`,
            method: 'POST',
            authHeader: request.headers.authorization,
            authUser: (request as any).user,
            body: request.body
        });
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });

    app.get<{ Params: { userId: string } }>('/api/v1/users/:userId/audit', async (request, reply) => {
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${request.params.userId}/audit`,
            method: 'GET',
            authHeader: request.headers.authorization,
            authUser: (request as any).user
        });
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });

    /**
     * GET /api/v1/admin/pending-approvals - Conta aprovações pendentes
     */
    app.get('/api/v1/admin/pending-approvals', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const response = await forwardRequest({
                url: `${config.AUTH_SERVICE_URL}/api/v1/users`,
                method: 'GET',
                authHeader: request.headers.authorization,
                authUser: (request as any).user
            });

            if (!response.ok) return reply.send({ success: true, data: { count: 0 } });

            const data = await response.json();
            const users = data.data?.items || data.data || [];
            const pendingCount = users.filter((u: any) => !u.isEmailVerified || !u.isActive).length;

            return reply.send({ success: true, data: { count: pendingCount } });
        } catch (error) {
            return reply.send({ success: true, data: { count: 0 } });
        }
    });

    /**
     * POST /api/v1/users/:userId/verify-email - Verifica email manualmente
     */
    app.post<{ Params: { userId: string } }>('/api/v1/users/:userId/verify-email', async (request, reply) => {
        const { userId } = request.params;
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}/verify-email`,
            method: 'POST',
            authHeader: request.headers.authorization,
            authUser: (request as any).user
        });
        if (response.ok) invalidateUserCache(userId);
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });

    /**
     * POST /api/v1/users/communication/send - Envia comunicações
     */
    app.post<{ Body: any }>('/api/v1/users/communication/send', async (request, reply) => {
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/communication/send`,
            method: 'POST',
            authHeader: request.headers.authorization,
            authUser: (request as any).user,
            body: request.body
        });
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });

    /**
     * POST /api/v1/users/bulk-import - Importação em massa
     */
    app.post<{ Body: any }>('/api/v1/users/bulk-import', async (request, reply) => {
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/bulk-import`,
            method: 'POST',
            authHeader: request.headers.authorization,
            authUser: (request as any).user,
            body: request.body
        });
        return reply.status(response.status).send(await response.json().catch(() => ({})));
    });
}
