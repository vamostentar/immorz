import type { FastifyInstance } from 'fastify';
import { AnalyzeSchema, IntelligenceController } from '../controllers/intelligence.controller.js';

export async function registerIntelligenceRoutes(app: FastifyInstance) {
  const controller = new IntelligenceController();

  app.post('/api/v1/intelligence/analyze', {
    schema: {
      description: 'Analisa um lead a partir de um URL externo',
      tags: ['Intelligence'],
      body: AnalyzeSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object', additionalProperties: true }
          }
        }
      }
    }
  }, controller.analyzeLead.bind(controller));
}
