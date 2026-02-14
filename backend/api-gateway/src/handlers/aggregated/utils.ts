/**
 * Utilitários para o Agregador - API Gateway
 */

import { config } from '../../config.js';

/**
 * Função auxiliar para encaminhar pedidos para microserviços com contexto completo
 */
export async function forwardRequest(params: {
    url: string;
    method: string;
    authHeader?: string | undefined;
    authUser?: any;
    body?: any;
}) {
    const { url, method, authHeader, authUser, body } = params;
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Internal-Request': 'true',
    };

    if (authHeader) headers['Authorization'] = authHeader;
    
    if (authUser) {
        headers['X-User-Id'] = authUser.id;
        headers['X-User-Email'] = authUser.email;
        headers['X-User-Role'] = authUser.role;
    }

    const fetchParams: any = {
        method,
        headers,
    };

    if (body !== undefined) {
        fetchParams.body = typeof body === 'string' ? body : JSON.stringify(body);
    } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
        // Essencial: fornecer corpo vazio para POST/PUT se nenhum for fornecido para evitar erros 400
        fetchParams.body = JSON.stringify({});
    }

    return fetch(url, fetchParams);
}

/**
 * Obtém dados do utilizador do auth-service
 */
export async function fetchAuthUser(userId: string, authHeader?: string, authUserContext?: any): Promise<any | null> {
    try {
        const response = await forwardRequest({
            url: `${config.AUTH_SERVICE_URL}/api/v1/users/${userId}`,
            method: 'GET',
            authHeader,
            authUser: authUserContext
        });

        if (!response.ok) {
            console.warn(`⚠️ Falha ao obter utilizador do auth: ${response.status}`);
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
export async function fetchUserProfile(userId: string, authHeader?: string, authUserContext?: any): Promise<any | null> {
    try {
        const response = await forwardRequest({
            url: `${config.USERS_SERVICE_URL}/api/v1/user-profiles/${userId}`,
            method: 'GET',
            authHeader,
            authUser: authUserContext
        });

        if (!response.ok) {
            console.warn(`⚠️ Falha ao obter perfil do user-service: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.data ?? data;
    } catch (error) {
        console.error('❌ Erro ao obter perfil do user-service:', error);
        return null;
    }
}
