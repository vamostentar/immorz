/**
 * Middleware de Enriquecimento de Utilizadores
 * 
 * Este middleware é responsável por:
 * 1. Obter dados completos do utilizador a partir do auth-service
 * 2. Armazenar em cache Redis para evitar chamadas repetidas
 * 3. Anexar dados enriquecidos ao request para uso pelos handlers
 * 
 * Utilizado quando serviços downstream necessitam de dados de utilizador
 * mas apenas têm o ID (referência externa).
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';

// Interface para dados do utilizador enriquecido
export interface EnrichedUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
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
}

// Extensão do tipo FastifyRequest
declare module 'fastify' {
    interface FastifyRequest {
        enrichedUser?: EnrichedUser;
        enrichedUsers?: Map<string, EnrichedUser>;
    }
}

// Cache simples em memória (substituir por Redis em produção)
const userCache = new Map<string, { user: EnrichedUser; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Limpa entradas expiradas do cache
 */
function cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of userCache.entries()) {
        if (value.expiresAt < now) {
            userCache.delete(key);
        }
    }
}

// Limpar cache a cada 5 minutos
setInterval(cleanExpiredCache, CACHE_TTL_MS);

/**
 * Obtém dados do utilizador do cache ou do auth-service
 */
async function fetchUserData(userId: string): Promise<EnrichedUser | null> {
    // Verificar cache
    const cached = userCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.user;
    }

    // Buscar do auth-service
    try {
        const response = await fetch(
            `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Request': 'true', // Identificar como request interno
                },
            }
        );

        if (!response.ok) {
            console.warn(`⚠️ UserEnricher: Não foi possível obter utilizador ${userId}: ${response.status}`);
            return null;
        }

        const data = await response.json();
        const user = data.data ?? data;

        // Guardar em cache
        userCache.set(userId, {
            user,
            expiresAt: Date.now() + CACHE_TTL_MS,
        });

        return user;
    } catch (error) {
        console.error(`❌ UserEnricher: Erro ao obter utilizador ${userId}:`, error);
        return null;
    }
}

/**
 * Invalida o cache de um utilizador específico
 * Chamar quando o utilizador é atualizado
 */
export function invalidateUserCache(userId: string): void {
    userCache.delete(userId);
    console.log(`🗑️ UserEnricher: Cache invalidado para utilizador ${userId}`);
}

/**
 * Invalida todo o cache de utilizadores
 * Chamar em situações de emergência ou manutenção
 */
export function invalidateAllUserCache(): void {
    userCache.clear();
    console.log('🗑️ UserEnricher: Todo o cache de utilizadores foi limpo');
}

/**
 * Middleware que enriquece o request com dados do utilizador autenticado
 * 
 * Adiciona `request.enrichedUser` com dados completos do utilizador
 */
export async function enrichCurrentUser(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    // Verificar se há utilizador autenticado
    const userId = (request as any).user?.id;
    if (!userId) {
        return;
    }

    // Obter dados enriquecidos
    const enrichedUser = await fetchUserData(userId);
    if (enrichedUser) {
        request.enrichedUser = enrichedUser;
    }
}

/**
 * Enriquece uma lista de IDs de utilizadores
 * Útil para endpoints que retornam listas com referências a utilizadores
 * 
 * @param userIds - Lista de IDs de utilizadores a enriquecer
 * @returns Mapa de userId -> EnrichedUser
 */
export async function enrichUsersByIds(
    userIds: string[]
): Promise<Map<string, EnrichedUser>> {
    const result = new Map<string, EnrichedUser>();
    const uniqueIds = [...new Set(userIds.filter(id => id))];

    // Processar em paralelo com limite de concorrência
    const BATCH_SIZE = 10;
    for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
        const batch = uniqueIds.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (id) => {
            const user = await fetchUserData(id);
            if (user) {
                result.set(id, user);
            }
        });
        await Promise.all(promises);
    }

    return result;
}

/**
 * Função auxiliar para enriquecer um objecto com dados de utilizador
 * Substitui campos como `ownerId` por `owner` com dados completos
 * 
 * @param obj - Objecto a enriquecer
 * @param userFieldMap - Mapa de campo ID -> campo de dados (ex: { ownerId: 'owner' })
 * @param usersMap - Mapa de utilizadores já obtidos
 */
export function enrichObjectWithUsers<T extends Record<string, any>>(
    obj: T,
    userFieldMap: Record<string, string>,
    usersMap: Map<string, EnrichedUser>
): T & { [key: string]: EnrichedUser | undefined } {
    const enriched: any = { ...obj };

    for (const [idField, dataField] of Object.entries(userFieldMap)) {
        const userId = obj[idField];
        if (userId && typeof userId === 'string') {
            const user = usersMap.get(userId);
            if (user) {
                enriched[dataField] = user;
            }
        }
    }

    return enriched;
}

/**
 * Hook para invalidar cache quando utilizadores são atualizados
 * Registar como hook no proxy para rotas de atualização de utilizadores
 */
export async function onUserUpdated(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    // Verificar se a resposta foi bem-sucedida
    const statusCode = reply.statusCode;
    if (statusCode >= 200 && statusCode < 300) {
        // Extrair userId do path ou body
        const userId =
            (request.params as any)?.userId ||
            (request.body as any)?.id ||
            (request as any).user?.id;

        if (userId) {
            invalidateUserCache(userId);
        }
    }
}

// Exportar configuração do cache para monitorização
export function getCacheStats(): { size: number; ttlMs: number } {
    cleanExpiredCache();
    return {
        size: userCache.size,
        ttlMs: CACHE_TTL_MS,
    };
}
