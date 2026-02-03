/**
 * Handlers Agregadores - API Gateway
 * 
 * Este módulo contém handlers especiais que agregam dados de múltiplos
 * serviços para fornecer respostas unificadas ao frontend.
 * 
 * ARQUITECTURA:
 * - auth-service: Dados de identidade (id, email, nome, role, password, 2FA)
 * - user-service: Dados de perfil estendido (bio, avatar, preferências)
 * 
 * Os handlers neste ficheiro fazem chamadas a ambos os serviços e
 * combinam as respostas numa única resposta para o cliente.
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';
import { invalidateUserCache } from '../middleware/user-enricher.js';

// Interface para utilizador agregado
interface AggregatedUser {
    // Dados de identidade (auth-service)
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: {
        id: string;
        name: string;
        displayName: string;
        permissions: string[];
    };
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;

    // Dados de perfil (user-service ou auth-service)
    profile?: {
        avatar?: string;
        dateOfBirth?: string;
        gender?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        preferredContactMethod?: string;
        language?: string;
        timezone?: string;
        profileVisibility?: string;
        allowMarketing?: boolean;
        allowNotifications?: boolean;
        
        // Novos campos de agente (do auth-service)
        specialties?: string[];
        rating?: number;
        reviewCount?: number;
        experience?: number;
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        isProfilePublic?: boolean;
        isProfileApproved?: boolean;
        bio?: string; // Bio também pode vir do auth
    };
}

/**
 * Obtém dados do utilizador do auth-service
 */
async function fetchAuthUser(userId: string, authHeader?: string): Promise<any | null> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Internal-Request': 'true',
        };

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(
            `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
            { method: 'GET', headers }
        );

        if (!response.ok) {
            console.warn(`⚠️ Auth user fetch failed: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.data ?? data;
    } catch (error) {
        console.error('❌ Erro ao obter utilizador do auth-service:', error);
        return null;
    }
}

/**
 * Obtém perfil do utilizador do user-service
 */
async function fetchUserProfile(userId: string, authHeader?: string): Promise<any | null> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Internal-Request': 'true',
        };

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(
            `${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`,
            { method: 'GET', headers }
        );

        if (!response.ok) {
            // Perfil pode não existir ainda - não é erro
            if (response.status === 404) {
                return null;
            }
            console.warn(`⚠️ User profile fetch failed: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.data ?? data;
    } catch (error) {
        console.error('❌ Erro ao obter perfil do user-service:', error);
        return null;
    }
}

/**
 * Regista handlers agregadores no Fastify
 */
export function registerAggregatedHandlers(app: FastifyInstance) {
    console.log('🔧 A registar handlers agregadores...');

    /**
     * GET /api/v1/users/me - Obtém dados completos do utilizador actual
     * 
     * Agrega:
     * - Identidade do auth-service
     * - Perfil do user-service (opcional)
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
            const authUser = await fetchAuthUser(userId, authHeader);

            if (!authUser) {
                return reply.status(404).send({
                    success: false,
                    error: 'Utilizador não encontrado',
                    code: 'USER_NOT_FOUND'
                });
            }

            // 2. Buscar perfil estendido (User Service) - Opcional, falha silenciosamente
            let userProfile = null;
            try {
                userProfile = await fetchUserProfile(userId, authHeader);
            } catch (error) {
                console.warn(`⚠️ Não foi possível obter perfil do user-service para ${userId} (ignorando)`);
            }

            // Agregar dados
            // NOTA: O auth-service agora já pode conter campos de perfil como bio, avatar, etc.
            // Usamos os do authUser como base e sobrepomos com userProfile se existir.
            const aggregatedUser: AggregatedUser = {
                id: authUser.id,
                email: authUser.email,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
                phone: authUser.phone,
                role: authUser.role,
                isActive: authUser.isActive ?? true,
                isEmailVerified: authUser.isEmailVerified ?? false,
                createdAt: authUser.createdAt,
                updatedAt: authUser.updatedAt,
                // Mapear campos de perfil que podem já vir do auth-service (nova migração)
                profile: {
                    bio: authUser.bio,
                    avatar: authUser.avatar,
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

            // Se o user-service respondeu, misturar os dados (prioridade ao user-service para campos específicos)
            if (userProfile) {
                aggregatedUser.profile = {
                    ...aggregatedUser.profile, // Manter o que veio do Auth
                    ...userProfile,            // Sobrepor com o que veio do User Service
                    
                    // Garantir mapeamento correto de campos comuns
                    bio: userProfile.bio || aggregatedUser.profile?.bio,
                    avatar: userProfile.avatar || aggregatedUser.profile?.avatar,
                };
            }

            return reply.send({
                success: true,
                data: aggregatedUser,
                message: 'Utilizador obtido com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro no handler /users/me:', error);
            // Em vez de 500, tentar retornar erro mais específico ou degradar graciosamente
            return reply.status(500).send({
                success: false,
                error: 'Erro interno ao processar dados do utilizador',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * GET /api/v1/admin/users - Lista utilizadores com dados agregados
     * 
     * Usado pelo painel de administração para listar utilizadores
     * com dados completos (identidade + perfil)
     */
    app.get('/api/v1/admin/users', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            const query = request.query as any;

            // Encaminhar para auth-service para listar utilizadores
            const response = await fetch(
                `${config.AUTH_SERVICE_URL}/api/v1/users?${new URLSearchParams(query).toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader || '',
                        'X-Internal-Request': 'true',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return reply.status(response.status).send(errorData);
            }

            const data = await response.json();

            return reply.send(data);
        } catch (error) {
            console.error('❌ Erro no handler /admin/users:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * GET /api/v1/users - Lista utilizadores (alias para admin/users)
     * Mantido para compatibilidade com frontend existente
     */
    app.get('/api/v1/users', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            const query = request.query as any;

            const response = await fetch(
                `${config.AUTH_SERVICE_URL}/api/v1/users?${new URLSearchParams(query).toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader || '',
                        'X-Internal-Request': 'true',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return reply.status(response.status).send(errorData);
            }

            const data = await response.json();
            return reply.send(data);
        } catch (error) {
            console.error('❌ Erro no handler /users:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * POST /api/v1/users - Criar novo utilizador
     * Encaminha para o auth-service
     */
    app.post('/api/v1/users', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            const userData = request.body;

            request.log.info({ userData }, 'POST /api/v1/users - Creating new user');

            // Make request to auth-service
            let response;
            try {
                response = await fetch(
                    `${config.AUTH_SERVICE_URL}/api/v1/users`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authHeader || '',
                            'X-Internal-Request': 'true',
                        },
                        body: JSON.stringify(userData)
                    }
                );
            } catch (fetchError: any) {
                request.log.error({ error: fetchError.message, stack: fetchError.stack }, 'Fetch to auth-service failed');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to connect to authentication service',
                    code: 'SERVICE_UNAVAILABLE'
                });
            }

            // Parse response
            let data;
            try {
                data = await response.json();
            } catch (parseError: any) {
                request.log.error({ error: parseError.message }, 'Failed to parse auth-service response');
                return reply.status(500).send({
                    success: false,
                    error: 'Invalid response from authentication service',
                    code: 'INVALID_RESPONSE'
                });
            }

            if (!response.ok) {
                request.log.error({ status: response.status, data }, 'Auth-service returned error');
                return reply.status(response.status).send(data);
            }

            request.log.info({ userId: data.data?.id }, 'User created successfully');
            return reply.status(201).send(data);
        } catch (error: any) {
            request.log.error({ error: error.message, stack: error.stack }, 'Unexpected error in POST /users handler');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * DELETE /api/v1/users/:userId - Elimina utilizador (alias para admin/users)
     * Mantido para compatibilidade com frontend existente
     */
    app.delete<{ Params: { userId: string } }>('/api/v1/users/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        try {
            const { userId } = request.params;
            const authHeader = request.headers.authorization;

            console.log(`🗑️ DELETE /api/v1/users/${userId} - Proxy para auth-service`);

            // 1. Eliminar perfil no user-service (pode não existir)
            try {
                await fetch(
                    `${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': authHeader || '',
                            'X-Internal-Request': 'true',
                        }
                    }
                );
            } catch (e) {
                console.warn('⚠️ Erro ao eliminar perfil (pode não existir):', e);
            }

            // 2. Eliminar utilizador no auth-service
            const response = await fetch(
                `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': authHeader || '',
                        'X-Internal-Request': 'true',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`❌ Erro ao eliminar utilizador ${userId}:`, errorData);
                return reply.status(response.status).send(errorData);
            }

            // 3. Invalidar cache
            invalidateUserCache(userId);

            console.log(`✅ Utilizador ${userId} eliminado com sucesso`);

            return reply.send({
                success: true,
                message: 'Utilizador eliminado com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro no handler DELETE /users/:userId:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * GET /api/v1/admin/pending-approvals - Conta aprovações pendentes
     * 
     * Retorna contagem de utilizadores que ainda não foram aprovados/verificados
     */
    app.get('/api/v1/admin/pending-approvals', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;

            // Buscar todos os utilizadores do auth-service
            const response = await fetch(
                `${config.AUTH_SERVICE_URL}/api/v1/users`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader || '',
                        'X-Internal-Request': 'true',
                    }
                }
            );

            if (!response.ok) {
                // Se falhar, retornar 0 como fallback
                return reply.send({
                    success: true,
                    data: { count: 0 }
                });
            }

            const data = await response.json();
            const users = data.data?.items || data.data || [];

            // Contar utilizadores pendentes (não verificados ou inativos)
            const pendingCount = users.filter((u: any) =>
                !u.isEmailVerified || !u.isActive
            ).length;

            return reply.send({
                success: true,
                data: { count: pendingCount }
            });
        } catch (error) {
            console.error('❌ Erro no handler /admin/pending-approvals:', error);
            // Retornar 0 em caso de erro
            return reply.send({
                success: true,
                data: { count: 0 }
            });
        }
    });

    /**
     * GET /api/v1/users/statistics - Estatísticas de utilizadores
     */
    app.get('/api/v1/users/statistics', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;

            // Obter estatísticas do auth-service
            const response = await fetch(
                `${config.AUTH_SERVICE_URL}/api/v1/users/statistics`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader || '',
                        'X-Internal-Request': 'true',
                    }
                }
            );

            if (!response.ok) {
                // Se endpoint não existir no auth, retornar estatísticas básicas
                if (response.status === 404) {
                    // Tentar obter contagem de utilizadores
                    const usersResponse = await fetch(
                        `${config.AUTH_SERVICE_URL}/api/v1/users`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': authHeader || '',
                                'X-Internal-Request': 'true',
                            }
                        }
                    );

                    if (usersResponse.ok) {
                        const usersData = await usersResponse.json();
                        const users = usersData.data?.items || usersData.data || [];

                        // Calcular estatísticas básicas
                        const total = users.length;
                        const active = users.filter((u: any) => u.isActive).length;
                        const verified = users.filter((u: any) => u.isEmailVerified).length;
                        const pending = users.filter((u: any) => !u.isActive).length;

                        // Contar por role
                        const roleCount: Record<string, number> = {};
                        users.forEach((u: any) => {
                            const roleName = u.role?.name || 'unknown';
                            roleCount[roleName] = (roleCount[roleName] || 0) + 1;
                        });

                        return reply.send({
                            success: true,
                            data: {
                                totalUsers: total,
                                activeUsers: active,
                                verifiedUsers: verified,
                                pendingUsers: pending,
                                roleDistribution: {
                                    admins: roleCount['admin'] || 0,
                                    agents: roleCount['agent'] || roleCount['operator'] || 0,
                                    clients: roleCount['user'] || roleCount['client'] || 0,
                                }
                            }
                        });
                    }
                }

                const errorData = await response.json().catch(() => ({}));
                return reply.status(response.status).send(errorData);
            }

            const data = await response.json();
            return reply.send(data);
        } catch (error) {
            console.error('❌ Erro no handler /users/statistics:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
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
                fetchAuthUser(userId, authHeader),
                fetchUserProfile(userId, authHeader)
            ]);

            if (!authUser) {
                return reply.status(404).send({
                    success: false,
                    error: 'Utilizador não encontrado',
                    code: 'USER_NOT_FOUND'
                });
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
                    
                    // Novos campos de agente (do auth-service)
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

            // Se o user-service respondeu, misturar os dados (prioridade ao user-service para campos específicos)
            if (userProfile && aggregatedUser.profile) {
                aggregatedUser.profile = {
                    ...aggregatedUser.profile,
                    bio: userProfile.bio || aggregatedUser.profile.bio,
                    avatar: userProfile.avatar || aggregatedUser.profile.avatar,
                };
            }

            return reply.send({
                success: true,
                data: aggregatedUser,
                message: 'Utilizador obtido com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro no handler /admin/users/:userId:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * DELETE /api/v1/admin/users/:userId - Elimina utilizador em cascata
     * 
     * Elimina:
     * 1. Perfil no user-service
     * 2. Utilizador no auth-service
     */
    app.delete('/api/v1/admin/users/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { userId } = request.params as { userId: string };
            const authHeader = request.headers.authorization;

            // 1. Eliminar perfil no user-service (pode não existir)
            try {
                await fetch(
                    `${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': authHeader || '',
                            'X-Internal-Request': 'true',
                        }
                    }
                );
            } catch (e) {
                console.warn('⚠️ Erro ao eliminar perfil (pode não existir):', e);
            }

            // 2. Eliminar utilizador no auth-service
            const response = await fetch(
                `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': authHeader || '',
                        'X-Internal-Request': 'true',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return reply.status(response.status).send(errorData);
            }

            // 3. Invalidar cache
            invalidateUserCache(userId);

            return reply.send({
                success: true,
                message: 'Utilizador eliminado com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro no handler DELETE /admin/users/:userId:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });

    /**
     * PUT /api/v1/users/:userId - Actualiza dados de um utilizador
     * Encaminha para o auth-service
     */
    app.put<{ Params: { userId: string }; Body: Record<string, unknown> }>(
        '/api/v1/users/:userId',
        async (request: FastifyRequest<{ Params: { userId: string }; Body: Record<string, unknown> }>, reply: FastifyReply) => {
            try {
                let { userId } = request.params;
                const updateData = request.body;
                const authHeader = request.headers.authorization;

                // Handle 'me' keyword - if userId is 'me', use the authenticated user's ID
                if (userId === 'me') {
                    const authenticatedUserId = (request as any).user?.id;
                    if (!authenticatedUserId) {
                        return reply.status(401).send({
                            success: false,
                            error: 'Utilizador não autenticado',
                            code: 'UNAUTHORIZED'
                        });
                    }
                    userId = authenticatedUserId;
                }

                console.log(`📝 AGGREGATED: PUT /api/v1/users/${userId}:`, { 
                    updateData, 
                    hasAuthHeader: !!authHeader,
                    authenticatedUser: (request as any).user
                });

                // Actualizar utilizador no auth-service
                const response = await fetch(
                    `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authHeader || '',
                            'X-Internal-Request': 'true',
                        },
                        body: JSON.stringify(updateData)
                    }
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    console.error(`❌ AGGREGATED: Erro ao actualizar utilizador ${userId} no auth-service:`, {
                        status: response.status,
                        data
                    });
                    return reply.status(response.status).send(data);
                }

                // Invalidar cache do utilizador
                invalidateUserCache(userId);

                console.log(`✅ AGGREGATED: Utilizador ${userId} actualizado com sucesso no auth-service`);

                return reply.send(data);
            } catch (error) {
                console.error('❌ AGGREGATED: Erro no handler PUT /users/:userId:', error);
                return reply.status(500).send({
                    success: false,
                    error: 'Erro interno do servidor',
                    code: 'INTERNAL_ERROR'
                });
            }
        }
    );
    
    /**
     * GET /api/v1/users/:userId/audit - Obtém logs de auditoria do utilizador
     * Encaminha para o auth-service
     */
    app.get<{ Params: { userId: string }; Querystring: { period?: string; limit?: number } }>(
        '/api/v1/users/:userId/audit',
        async (request: FastifyRequest<{ Params: { userId: string }; Querystring: { period?: string; limit?: number } }>, reply: FastifyReply) => {
            try {
                const { userId } = request.params;
                const query = request.query;
                const authHeader = request.headers.authorization;

                const queryParams = new URLSearchParams();
                if (query.period) queryParams.append('period', query.period);
                if (query.limit) queryParams.append('limit', query.limit.toString());

                const response = await fetch(
                    `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}/audit?${queryParams.toString()}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authHeader || '',
                            'X-Internal-Request': 'true',
                        }
                    }
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    return reply.status(response.status).send(data);
                }

                return reply.send(data);
            } catch (error) {
                console.error('❌ AGGREGATED: Erro no handler GET /users/:userId/audit:', error);
                return reply.status(500).send({
                    success: false,
                    error: 'Erro interno do servidor',
                    code: 'INTERNAL_ERROR'
                });
            }
        }
    );

    console.log('✅ Handlers agregadores registados');
}
