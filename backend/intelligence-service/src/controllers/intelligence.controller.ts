import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ServiceFactory } from '../factories/service.factory.js';

export const AnalyzeSchema = z.object({
  url: z.string().url()
});

export class IntelligenceController {
  private intelligenceService = ServiceFactory.getIntelligenceService();

  async analyzeLead(request: FastifyRequest, reply: FastifyReply) {
    const { url } = request.body as any;

    try {
      const opportunity = await this.intelligenceService.analyzeLeadFromUrl(url);
      
      return reply.status(200).send({
        success: true,
        data: opportunity
      });
    } catch (error: any) {
      request.log.error(error);
      
      const isQuotaError = error.message?.includes('quota') || error.type === 'RateLimitError' || error.status === 429;
      
      return reply.status(isQuotaError ? 429 : 500).send({
        success: false,
        error: {
          code: isQuotaError ? 'QUOTA_EXCEEDED' : 'ANALYSIS_FAILED',
          message: isQuotaError 
            ? 'A quota da OpenAI foi excedida. Por favor, verifique os créditos da API.' 
            : (error.message || 'Erro durante a análise do lead')
        }
      });
    }
  }
}
