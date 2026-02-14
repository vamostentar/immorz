/**
 * Handlers Agregadores - API Gateway (Versão Modularizada)
 * 
 * Este ficheiro serve agora como ponto de compatibilidade, exportando
 * a funcionalidade do novo diretório modular 'aggregated/'.
 * 
 * DESIGN:
 * - me.handlers.ts: Perfil pessoal do utilizador (/me)
 * - user.handlers.ts: Gestão de utilizadores (CRUD)
 * - admin.handlers.ts: Operações administrativas e estatísticas
 */

export { registerAggregatedHandlers } from './aggregated/index.js';
export * from './aggregated/types.js';
export * from './aggregated/utils.js';

