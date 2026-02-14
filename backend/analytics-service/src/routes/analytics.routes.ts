import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AnalyticsController, AnalyticsQuerySchema } from '../controllers/analytics.controller.js';

/**
 * Regista as rotas do domínio de Analytics no Fastify
 */
export async function registerAnalyticsRoutes(app: FastifyInstance) {
  const controller = new AnalyticsController();

  // Rota principal de dados para o Frontend
  app.get('/api/v1/analytics/dashboard', {
    schema: {
      description: 'Obtém dados agregados para o dashboard administrativo',
      tags: ['Analytics'],
      querystring: AnalyticsQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({}).passthrough()
        })
      }
    }
  }, controller.getDashboardData.bind(controller));

  // Rota para manutenção/trigger manual
  app.post('/api/v1/analytics/aggregate', {
    schema: {
      description: 'Dispara manualmente o ciclo de recolha de dados',
      tags: ['Maintenance'],
      response: {
        200: z.object({
          success: z.boolean(),
          message: z.string()
        })
      }
    }
  }, controller.triggerAggregation.bind(controller));

  // Regista uma pesquisa regional
  app.post('/api/v1/analytics/record-search', {
    schema: {
      description: 'Regista uma pesquisa ou interesse numa determinada região',
      tags: ['Analytics'],
      body: z.object({
        region: z.string(),
        increment: z.number().default(1)
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, controller.recordSearch.bind(controller));
}
