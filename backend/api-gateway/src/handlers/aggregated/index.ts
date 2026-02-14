/**
 * Ponto de entrada - Handlers Agregadores do API Gateway
 */

import { FastifyInstance } from 'fastify';
import { registerAdminHandlers } from './admin.handlers.js';
import { registerMeHandlers } from './me.handlers.js';
import { registerUserHandlers } from './user.handlers.js';

/**
 * Regista todos os handlers agregadores no Fastify
 */
export function registerAggregatedHandlers(app: FastifyInstance) {
    console.log('🔧 A registar handlers agregadores modularizados...');

    registerMeHandlers(app);
    registerUserHandlers(app);
    registerAdminHandlers(app);

    console.log('✅ Handlers agregadores registados com sucesso');
}
