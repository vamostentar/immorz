/**
 * Controlador de Perfis de Utilizador (Refatorado)
 * 
 * ARQUITECTURA:
 * - auth-service: Gere identidade (id, email, nome, role, password, 2FA)
 * - user-service: Gere perfil estendido (bio, avatar, preferências, favoritos)
 * 
 * Este controller NÃO gere dados de autenticação.
 * O ID do perfil é o MESMO ID do utilizador no auth-service.
 * Dados de identidade são obtidos via API Gateway (middleware enrichUser).
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { dependencyConfig } from '../config/dependency-config.js';
import { config } from '../config/index.js';

// ============================================================
// Controlador de Perfis
// ============================================================

export class UserProfileController {
    /**
     * Cria um perfil para um utilizador existente no auth-service
     * NOTA: O utilizador já deve existir no auth-service
     */
    async createProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const profileData = (request as any).body;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            // Verificar se perfil já existe
            const existingProfile = await dependencyConfig.database.userProfiles.findById(userId);
            if (existingProfile) {
                return reply.status(409).send({
                    success: false,
                    error: 'Perfil já existe para este utilizador',
                    code: 'PROFILE_EXISTS'
                });
            }

            // Criar perfil com ID do auth-service
            const profile = await dependencyConfig.database.userProfiles.create({
                id: userId, // Usar ID do auth-service
                bio: profileData.bio || null,
                avatar: profileData.avatar || null,
                dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
                gender: profileData.gender || null,
                address: profileData.address || null,
                city: profileData.city || null,
                state: profileData.state || null,
                country: profileData.country || null,
                postalCode: profileData.postalCode || null,
                preferredContactMethod: profileData.preferredContactMethod || 'EMAIL',
                language: profileData.language || 'pt',
                timezone: profileData.timezone || 'Europe/Lisbon',
                profileVisibility: profileData.profileVisibility || 'PUBLIC',
                allowNotifications: profileData.allowNotifications ?? true,
                // Agent fields
                specialties: profileData.specialties || [],
                experience: profileData.experience || null,
                linkedin: profileData.linkedin || null,
                facebook: profileData.facebook || null,
                instagram: profileData.instagram || null,
            });

            // Criar preferências padrão
            try {
                await dependencyConfig.database.userPreferences.create({
                    userId: profile.id,
                    emailNotifications: config.userPreferencesDefaults.emailNotifications,
                    smsNotifications: config.userPreferencesDefaults.smsNotifications,
                    pushNotifications: config.userPreferencesDefaults.pushNotifications,
                    priceDropAlerts: config.userPreferencesDefaults.priceDropAlerts,
                    newPropertyAlerts: config.userPreferencesDefaults.newPropertyAlerts,
                    marketUpdateAlerts: config.userPreferencesDefaults.marketUpdateAlerts,
                    searchRadius: config.userPreferencesDefaults.searchRadius,
                    sortBy: config.userPreferencesDefaults.sortBy,
                    viewMode: config.userPreferencesDefaults.viewMode
                });
            } catch (prefError) {
                console.warn('⚠️ Erro ao criar preferências padrão:', prefError);
            }

            return reply.status(201).send({
                success: true,
                data: profile,
                message: 'Perfil criado com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao criar perfil:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Obtém o perfil do utilizador actual
     * Cria automaticamente se não existir
     */
    async getMyProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            let profile = await dependencyConfig.database.userProfiles.findById(userId);

            // Auto-criar perfil se não existir
            if (!profile) {
                console.log(`🔧 Auto-criando perfil para utilizador ${userId}`);
                profile = await dependencyConfig.database.userProfiles.create({
                    id: userId,
                    preferredContactMethod: 'EMAIL',
                    language: 'pt',
                    timezone: 'Europe/Lisbon',
                    profileVisibility: 'PUBLIC',
                    allowMarketing: false,
                    allowNotifications: true,
                });

                // Criar preferências padrão
                try {
                    await dependencyConfig.database.userPreferences.create({
                        userId: profile.id,
                        emailNotifications: true,
                        smsNotifications: false,
                        pushNotifications: true,
                        priceDropAlerts: true,
                        newPropertyAlerts: true,
                        marketUpdateAlerts: false,
                        searchRadius: 10,
                        sortBy: 'RELEVANCE',
                        viewMode: 'LIST'
                    });
                } catch (prefError) {
                    console.warn('⚠️ Erro ao criar preferências:', prefError);
                }
            }

            return reply.send({
                success: true,
                data: profile,
                message: 'Perfil obtido com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao obter perfil:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Obtém perfil de um utilizador específico (admin)
     */
    async getProfileById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).params?.userId;

            if (!userId) {
                return reply.status(400).send({
                    success: false,
                    error: 'ID do utilizador é obrigatório',
                    code: 'MISSING_USER_ID'
                });
            }

            const profile = await dependencyConfig.database.userProfiles.findById(userId);

            if (!profile) {
                return reply.status(404).send({
                    success: false,
                    error: 'Perfil não encontrado',
                    code: 'PROFILE_NOT_FOUND'
                });
            }

            return reply.send({
                success: true,
                data: profile,
                message: 'Perfil obtido com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao obter perfil:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Actualiza o perfil do utilizador actual
     */
    async updateMyProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const updateData = (request as any).body;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            // Filtrar apenas campos permitidos (não incluir dados de identidade)
            const allowedFields: Record<string, any> = {};

            if (updateData.bio !== undefined) allowedFields.bio = updateData.bio;
            if (updateData.avatar !== undefined) allowedFields.avatar = updateData.avatar;
            if (updateData.dateOfBirth !== undefined) allowedFields.dateOfBirth = updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null;
            if (updateData.gender !== undefined) allowedFields.gender = updateData.gender;
            if (updateData.address !== undefined) allowedFields.address = updateData.address;
            if (updateData.city !== undefined) allowedFields.city = updateData.city;
            if (updateData.state !== undefined) allowedFields.state = updateData.state;
            if (updateData.country !== undefined) allowedFields.country = updateData.country;
            if (updateData.postalCode !== undefined) allowedFields.postalCode = updateData.postalCode;
            if (updateData.preferredContactMethod !== undefined) allowedFields.preferredContactMethod = updateData.preferredContactMethod;
            if (updateData.language !== undefined) allowedFields.language = updateData.language;
            if (updateData.timezone !== undefined) allowedFields.timezone = updateData.timezone;
            if (updateData.profileVisibility !== undefined) allowedFields.profileVisibility = updateData.profileVisibility;
            if (updateData.allowMarketing !== undefined) allowedFields.allowMarketing = updateData.allowMarketing;
            if (updateData.allowNotifications !== undefined) allowedFields.allowNotifications = updateData.allowNotifications;
            
            // Agent fields
            if (updateData.specialties !== undefined) allowedFields.specialties = updateData.specialties;
            if (updateData.experience !== undefined) allowedFields.experience = updateData.experience;
            if (updateData.linkedin !== undefined) allowedFields.linkedin = updateData.linkedin;
            if (updateData.facebook !== undefined) allowedFields.facebook = updateData.facebook;
            if (updateData.instagram !== undefined) allowedFields.instagram = updateData.instagram;

            const updatedProfile = await dependencyConfig.database.userProfiles.update(userId, allowedFields);

            return reply.send({
                success: true,
                data: updatedProfile,
                message: 'Perfil actualizado com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao actualizar perfil:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Elimina o perfil (cascade para preferências, favoritos, etc.)
     * NOTA: Não elimina o utilizador no auth-service
     */
    async deleteProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).params?.userId;

            if (!userId) {
                return reply.status(400).send({
                    success: false,
                    error: 'ID do utilizador é obrigatório',
                    code: 'MISSING_USER_ID'
                });
            }

            const existingProfile = await dependencyConfig.database.userProfiles.findById(userId);
            if (!existingProfile) {
                return reply.status(404).send({
                    success: false,
                    error: 'Perfil não encontrado',
                    code: 'PROFILE_NOT_FOUND'
                });
            }

            await dependencyConfig.database.userProfiles.delete(userId);

            return reply.send({
                success: true,
                message: 'Perfil eliminado com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao eliminar perfil:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Listar todos os perfis (admin)
     * NOTA: Esta lista só contém dados de perfil, não identidade
     */
    async listProfiles(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = request.query as any;
            const { page = 1, limit = 20 } = query;

            const skip = (page - 1) * limit;
            const take = Math.min(limit, 100);

            const profiles = await dependencyConfig.database.userProfiles.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            });

            return reply.send({
                success: true,
                data: profiles,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: profiles.length
                },
                message: 'Perfis listados com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao listar perfis:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}

// ============================================================
// Controlador de Preferências
// ============================================================

export class UserPreferencesController {
    /**
     * Obtém preferências do utilizador actual
     */
    async getMyPreferences(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            let preferences = await dependencyConfig.database.userPreferences.findByUserId(userId);

            // Auto-criar se não existir
            if (!preferences) {
                preferences = await dependencyConfig.database.userPreferences.create({
                    userId,
                    emailNotifications: true,
                    smsNotifications: false,
                    pushNotifications: true,
                    priceDropAlerts: true,
                    newPropertyAlerts: true,
                    marketUpdateAlerts: false,
                    searchRadius: 10,
                    sortBy: 'RELEVANCE',
                    viewMode: 'LIST'
                });
            }

            return reply.send({
                success: true,
                data: preferences,
                message: 'Preferências obtidas com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao obter preferências:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Actualiza preferências do utilizador actual
     */
    async updateMyPreferences(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const updateData = (request as any).body;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            const updatedPreferences = await dependencyConfig.database.userPreferences.update(userId, updateData);

            return reply.send({
                success: true,
                data: updatedPreferences,
                message: 'Preferências actualizadas com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao actualizar preferências:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}

// ============================================================
// Controlador de Propriedades Guardadas (Favoritos)
// ============================================================

export class SavedPropertyController {
    /**
     * Obtém propriedades guardadas do utilizador actual
     */
    async getMySavedProperties(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            const savedProperties = await dependencyConfig.database.savedProperties.findByUserId(userId);

            return reply.send({
                success: true,
                data: savedProperties,
                message: 'Propriedades guardadas obtidas com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao obter propriedades guardadas:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Guarda uma propriedade
     */
    async saveProperty(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const { propertyId, folder, notes, tags } = (request as any).body;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            if (!propertyId) {
                return reply.status(400).send({
                    success: false,
                    error: 'ID da propriedade é obrigatório',
                    code: 'MISSING_PROPERTY_ID'
                });
            }

            const saved = await dependencyConfig.database.savedProperties.create({
                userId,
                propertyId,
                folder: folder || null,
                notes: notes || null,
                tags: tags || []
            });

            return reply.status(201).send({
                success: true,
                data: saved,
                message: 'Propriedade guardada com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao guardar propriedade:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Remove propriedade guardada
     */
    async removeSavedProperty(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const propertyId = (request as any).params?.propertyId;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            if (!propertyId) {
                return reply.status(400).send({
                    success: false,
                    error: 'ID da propriedade é obrigatório',
                    code: 'MISSING_PROPERTY_ID'
                });
            }

            await dependencyConfig.database.savedProperties.deleteByUserAndProperty(userId, propertyId);

            return reply.send({
                success: true,
                message: 'Propriedade removida dos guardados'
            });
        } catch (error) {
            console.error('❌ Erro ao remover propriedade guardada:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}

// ============================================================
// Controlador de Histórico de Pesquisa
// ============================================================

export class SearchHistoryController {
    /**
     * Obtém histórico de pesquisa do utilizador actual
     */
    async getMySearchHistory(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const { limit = 20 } = request.query as any;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            const history = await dependencyConfig.database.searchHistory.findByUserId(userId, limit);

            return reply.send({
                success: true,
                data: history,
                message: 'Histórico de pesquisa obtido com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao obter histórico:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Adiciona pesquisa ao histórico
     */
    async addSearchToHistory(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const searchData = (request as any).body;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            const entry = await dependencyConfig.database.searchHistory.create({
                userId,
                query: searchData.query || null,
                location: searchData.location || null,
                propertyType: searchData.propertyType || [],
                minPrice: searchData.minPrice || null,
                maxPrice: searchData.maxPrice || null,
                minBedrooms: searchData.minBedrooms || null,
                maxBedrooms: searchData.maxBedrooms || null,
                minBathrooms: searchData.minBathrooms || null,
                maxBathrooms: searchData.maxBathrooms || null,
                minArea: searchData.minArea || null,
                maxArea: searchData.maxArea || null,
                resultsCount: searchData.resultsCount || null,
                searchTime: searchData.searchTime || null
            });

            return reply.status(201).send({
                success: true,
                data: entry,
                message: 'Pesquisa adicionada ao histórico'
            });
        } catch (error) {
            console.error('❌ Erro ao adicionar pesquisa:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Limpa histórico de pesquisa
     */
    async clearMySearchHistory(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            await dependencyConfig.database.searchHistory.deleteByUserId(userId);

            return reply.send({
                success: true,
                message: 'Histórico de pesquisa limpo'
            });
        } catch (error) {
            console.error('❌ Erro ao limpar histórico:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}

// ============================================================
// Controlador de Notificações
// ============================================================

export class NotificationController {
    /**
     * Obtém notificações do utilizador actual
     */
    async getMyNotifications(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const { unreadOnly = false, limit = 50 } = request.query as any;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            const notifications = await dependencyConfig.database.notifications.findByUserId(
                userId,
                { unreadOnly: unreadOnly === 'true', limit }
            );

            return reply.send({
                success: true,
                data: notifications,
                message: 'Notificações obtidas com sucesso'
            });
        } catch (error) {
            console.error('❌ Erro ao obter notificações:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Marca notificação como lida
     */
    async markAsRead(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;
            const notificationId = (request as any).params?.notificationId;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            await dependencyConfig.database.notifications.markAsRead(notificationId, userId);

            return reply.send({
                success: true,
                message: 'Notificação marcada como lida'
            });
        } catch (error) {
            console.error('❌ Erro ao marcar notificação:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * Marca todas as notificações como lidas
     */
    async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request as any).user?.id;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    error: 'Utilizador não autenticado',
                    code: 'UNAUTHORIZED'
                });
            }

            await dependencyConfig.database.notifications.markAllAsRead(userId);

            return reply.send({
                success: true,
                message: 'Todas as notificações marcadas como lidas'
            });
        } catch (error) {
            console.error('❌ Erro ao marcar notificações:', error);
            return reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}

// Exportar instâncias dos controladores
export const userProfileController = new UserProfileController();
export const userPreferencesController = new UserPreferencesController();
export const savedPropertyController = new SavedPropertyController();
export const searchHistoryController = new SearchHistoryController();
export const notificationController = new NotificationController();
