/**
 * Rotas do User Service (Refatorado)
 * 
 * ARQUITECTURA CONSOLIDADA:
 * - Dados de identidade (email, nome, role) → auth-service
 * - Dados de perfil (bio, avatar, preferências) → este serviço
 * 
 * As rotas /api/v1/users/* que precisam de dados de identidade
 * devem ser servidas pelo API Gateway que agrega de ambos os serviços.
 */

import { FastifyInstance } from 'fastify';
import {
  notificationController,
  savedPropertyController,
  searchHistoryController,
  userPreferencesController,
  userProfileController
} from '../controllers/profile.controller.js';

export async function userRoutes(fastify: FastifyInstance) {
  if (process.env.ENABLE_DETAILED_LOGGING === 'true' || process.env.NODE_ENV !== 'production') {
    console.log('🔧 A registar rotas do User Service (refatorado)...');
  }

  // ============================================================
  // Rotas de Perfil
  // ============================================================

  // Obter/criar perfil do utilizador actual
  fastify.get('/api/v1/user-profiles/me', async (req, rep) => {
    return userProfileController.getMyProfile(req, rep);
  });

  // Actualizar perfil do utilizador actual
  fastify.put('/api/v1/user-profiles/me', async (req, rep) => {
    return userProfileController.updateMyProfile(req, rep);
  });

  // Criar perfil (chamado automaticamente ao primeiro acesso)
  fastify.post('/api/v1/user-profiles', async (req, rep) => {
    return userProfileController.createProfile(req, rep);
  });

  // Obter perfil por ID (admin)
  fastify.get('/api/v1/user-profiles/:userId', async (req, rep) => {
    return userProfileController.getProfileById(req, rep);
  });

  // Actualizar perfil por ID (admin)
  fastify.put('/api/v1/user-profiles/:userId', async (req, rep) => {
    return userProfileController.updateMyProfile(req, rep);
  });

  // Eliminar perfil (admin)
  fastify.delete('/api/v1/user-profiles/:userId', async (req, rep) => {
    return userProfileController.deleteProfile(req, rep);
  });

  // Listar perfis (admin) - apenas dados de perfil
  fastify.get('/api/v1/user-profiles', async (req, rep) => {
    return userProfileController.listProfiles(req, rep);
  });

  // ============================================================
  // Rotas de Preferências
  // ============================================================

  fastify.get('/api/v1/user-preferences/me', async (req, rep) => {
    return userPreferencesController.getMyPreferences(req, rep);
  });

  fastify.put('/api/v1/user-preferences/me', async (req, rep) => {
    return userPreferencesController.updateMyPreferences(req, rep);
  });

  // ============================================================
  // Rotas de Propriedades Guardadas (Favoritos)
  // ============================================================

  fastify.get('/api/v1/saved-properties/me', async (req, rep) => {
    return savedPropertyController.getMySavedProperties(req, rep);
  });

  fastify.post('/api/v1/saved-properties', async (req, rep) => {
    return savedPropertyController.saveProperty(req, rep);
  });

  fastify.delete('/api/v1/saved-properties/:propertyId', async (req, rep) => {
    return savedPropertyController.removeSavedProperty(req, rep);
  });

  // ============================================================
  // Rotas de Histórico de Pesquisa
  // ============================================================

  fastify.get('/api/v1/search-history/me', async (req, rep) => {
    return searchHistoryController.getMySearchHistory(req, rep);
  });

  fastify.post('/api/v1/search-history', async (req, rep) => {
    return searchHistoryController.addSearchToHistory(req, rep);
  });

  fastify.delete('/api/v1/search-history/me', async (req, rep) => {
    return searchHistoryController.clearMySearchHistory(req, rep);
  });

  // ============================================================
  // Rotas de Notificações
  // ============================================================

  fastify.get('/api/v1/notifications/me', async (req, rep) => {
    return notificationController.getMyNotifications(req, rep);
  });

  fastify.put('/api/v1/notifications/:notificationId/read', async (req, rep) => {
    return notificationController.markAsRead(req, rep);
  });

  fastify.put('/api/v1/notifications/read-all', async (req, rep) => {
    return notificationController.markAllAsRead(req, rep);
  });

  if (process.env.ENABLE_DETAILED_LOGGING === 'true' || process.env.NODE_ENV !== 'production') {
    console.log('✅ Rotas do User Service registadas com sucesso');
  }
}
