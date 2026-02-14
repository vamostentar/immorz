/**
 * Handlers Agregadores para Agentes - API Gateway
 */

import { FastifyInstance } from 'fastify';
import { config } from '../../config.js';
import { fetchAuthUser } from './utils.js';

/**
 * Regista handlers relacionados com agentes
 */
export function registerAgentHandlers(app: FastifyInstance) {
    /**
     * GET /api/v1/agents - Listar agentes públicos (agregado)
     */
    app.get('/api/v1/agents', async (request, reply) => {
        try {
            const query = request.query as any;
            const specialty = query.specialty;
            const page = query.page || 1;
            const limit = query.limit || 20;

            // 1. Obter perfis públicos do user-service
            const url = new URL(`${config.USERS_SERVICE_URL}/api/v1/user-profiles/public/agents`);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());
            if (specialty) url.searchParams.append('specialty', specialty);

            const profilesRes = await fetch(url.toString(), {
                headers: { 'X-Internal-Request': 'true' }
            });

            if (!profilesRes.ok) {
                const errorData = await profilesRes.json().catch(() => ({}));
                return reply.status(profilesRes.status).send(errorData);
            }

            const profilesData = await profilesRes.json();
            const profiles = profilesData.data || [];

            // 2. Para cada perfil, tentar obter dados de identidade (firstName, lastName)
            // Nota: Numa escala maior, isto deve ser optimizado com um endpoint de bulk-fetch no auth-service
            const aggregatedAgents = await Promise.all(profiles.map(async (profile: any) => {
                const authUser = await fetchAuthUser(profile.id);
                
                return {
                    id: profile.id,
                    firstName: authUser?.firstName || null,
                    lastName: authUser?.lastName || null,
                    email: authUser?.email || null, // Apenas se necessário, normalmente omitido para público
                    bio: profile.bio,
                    avatar: profile.avatar,
                    specialties: profile.specialties,
                    experience: profile.experience,
                    rating: profile.rating,
                    reviewCount: profile.reviewCount,
                    social: {
                        linkedin: profile.linkedin,
                        facebook: profile.facebook,
                        instagram: profile.instagram
                    },
                    isApproved: profile.isProfileApproved,
                    createdAt: profile.createdAt
                };
            }));

            return reply.send({
                success: true,
                data: aggregatedAgents,
                meta: profilesData.meta
            });
        } catch (error) {
            console.error('❌ Erro no handler de agentes:', error);
            return reply.status(500).send({ success: false, error: 'Erro interno ao agregar agentes' });
        }
    });

    /**
     * GET /api/v1/agents/:userId - Obter perfil público de um agente (agregado)
     */
    app.get<{ Params: { userId: string } }>('/api/v1/agents/:userId', async (request, reply) => {
        try {
            const { userId } = request.params;

            // 1. Obter perfil do user-service
            const profileRes = await fetch(`${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`, {
                headers: { 'X-Internal-Request': 'true' }
            });

            if (!profileRes.ok) {
                if (profileRes.status === 404) {
                    return reply.status(404).send({ success: false, error: 'Agente não encontrado' });
                }
                const errorData = await profileRes.json().catch(() => ({}));
                return reply.status(profileRes.status).send(errorData);
            }

            const profileData = await profileRes.json();
            const profile = profileData.data;

            // Verificar se o perfil está público e aprovado para visualização pública
            if (profile.profileVisibility !== 'PUBLIC' || !profile.isProfileApproved) {
                return reply.status(404).send({ success: false, error: 'Perfil não disponível para visualização pública' });
            }

            // 2. Obter dados de identidade do auth-service
            const authUser = await fetchAuthUser(userId);

            // 3. Agregar dados
            const aggregatedAgent = {
                id: profile.id,
                firstName: authUser?.firstName || null,
                lastName: authUser?.lastName || null,
                username: authUser?.username || null,
                bio: profile.bio,
                avatar: profile.avatar,
                specialties: profile.specialties,
                experience: profile.experience,
                rating: profile.rating,
                reviewCount: profile.reviewCount,
                social: {
                    linkedin: profile.linkedin,
                    facebook: profile.facebook,
                    instagram: profile.instagram
                },
                contact: {
                    preferredMethod: profile.preferredContactMethod,
                    phone: authUser?.phone || null,
                    email: authUser?.email || null
                },
                location: {
                    city: profile.city,
                    state: profile.state,
                    country: profile.country
                },
                isApproved: profile.isProfileApproved,
                createdAt: profile.createdAt
            };

            return reply.send({
                success: true,
                data: aggregatedAgent
            });
        } catch (error) {
            console.error('❌ Erro ao obter detalhe do agente:', error);
            return reply.status(500).send({ success: false, error: 'Erro interno ao agregar detalhe do agente' });
        }
    });
}
