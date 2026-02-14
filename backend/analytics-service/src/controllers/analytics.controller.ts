import axios from 'axios';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { config } from '../config/config.js';
import { dependencyConfig } from '../config/dependency-config.js';

/**
 * Esquemas para validação de entrada (Zod)
 */
export const AnalyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  days: z.coerce.number().default(30)
});

/**
 * Controlador responsável por expor as métricas de BI para o frontend.
 */
export class AnalyticsController {
  
  /**
   * Obtém os dados completos para o dashboard de analytics
   */
  async getDashboardData(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as z.infer<typeof AnalyticsQuerySchema>;
      
      // Agrega dados de múltiplos repositórios e serviços externos em tempo real
      const [
        propertyDistribution, 
        topRegions, 
        latestAgents, 
        soldMetrics,
        propertiesStatsRes,
        messagesStatsRes
      ] = await Promise.all([
        dependencyConfig.database.analytics.getPropertyDistribution(),
        dependencyConfig.database.analytics.getTopRegions(5, new Date()),
        dependencyConfig.database.analytics.getLatestMetric('NEW_AGENTS' as any),
        dependencyConfig.database.analytics.getLatestMetric('PROPERTIES_BY_STATUS' as any, { status: 'sold' }),
        // Chamadas diretas para garantir dados "frescos"
        axios.get(`${config.SERVICES.PROPERTIES}/api/v1/properties-stats`).catch(e => {
          request.log.error('Erro ao buscar stats de propriedades:', e.message);
          return { data: { data: { totalViews: 0, total: 0 } } };
        }),
        axios.get(`${config.SERVICES.MESSAGES}/api/v1/messages/stats`).catch(e => {
          request.log.error('Erro ao buscar stats de mensagens:', e.message);
          return { data: { data: { total: 0 } } };
        })
      ]);

      const realTimeViews = Number(propertiesStatsRes.data.data.totalViews || 0);
      const realTimeMessages = Number(messagesStatsRes.data.data.total || 0);
      const realTimeTotalProps = Number(propertiesStatsRes.data.data.total || 0);

      const activitySummary = {
        propertiesViewed: realTimeViews,
        contactsReceived: realTimeMessages,
        propertiesSold: Number(soldMetrics?.value || 0),
        newAgents: Number(latestAgents?.value || 0)
      };

      // 2. Mapeamento de Distribuição de Propriedades (com cálculo de percentagem e cores)
      const totalProps = propertyDistribution.reduce((sum: number, p: any) => sum + p.value, 0);
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
      const mappedDistribution = propertyDistribution.map((p: any, index: number) => ({
        name: p.name,
        percentage: totalProps > 0 ? Math.round((p.value / totalProps) * 100) : 0,
        color: colors[index % colors.length]
      }));

      // 3. KPI's (Performance Metrics Reais e Dinâmicas)
      const totalAgents = Number(latestAgents?.value || 1); 
      
      const performanceMetrics = {
        conversionRate: { 
          value: realTimeViews > 0 ? Number(((realTimeMessages / realTimeViews) * 100).toFixed(1)) : 0, 
          change: 0 
        },
        averageViews: { 
          value: realTimeTotalProps > 0 ? Number((realTimeViews / realTimeTotalProps).toFixed(1)) : 0, 
          change: 0 
        },
        propertiesPerAgent: { 
          value: totalAgents > 0 ? Number((realTimeTotalProps / totalAgents).toFixed(1)) : 0, 
          change: 0
        }
      };

      // 4. Estatísticas de Tendência (Últimos 30 dias para os gráficos)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - query.days);
      
      const [viewTrends, messageTrends] = await Promise.all([
        dependencyConfig.database.analytics.getMetricsByType('TOTAL_VIEWS' as any, startDate, new Date()),
        dependencyConfig.database.analytics.getMetricsByType('TOTAL_MESSAGES' as any, startDate, new Date())
      ]);

      const monthlyStats = viewTrends.map((v, i) => ({
        month: v.date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        views: Number(v.value),
        leads: Number(messageTrends.find(m => m.date.toDateString() === v.date.toDateString())?.value || 0),
        sold: 0 // Placeholder
      }));

      return reply.send({
        success: true,
        data: {
          propertyTypes: mappedDistribution,
          topRegions: topRegions.map((r: any) => ({ name: r.region, searches: r.count })),
          monthlyStats,
          activitySummary,
          performanceMetrics
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao obter dados de analytics',
        code: 'ANALYTICS_ERROR'
      });
    }
  }

  /**
   * Regista uma pesquisa ou interesse numa região
   */
  async recordSearch(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { region, increment } = request.body as { region: string; increment?: number };
      
      const repository = dependencyConfig.database.analytics;
      const date = new Date();
      date.setHours(0, 0, 0, 0); // Normaliza para o início do dia

      // Obtém o contador atual para a região hoje
      const snapshots = await repository.getTopRegions(100, date);
      const current = snapshots.find(s => s.region === region);
      
      await repository.saveSearchSnapshot(region, (current?.count || 0) + (increment || 1), date);

      return reply.send({ success: true });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: 'Erro ao registar pesquisa' });
    }
  }

  /**
   * Trigger manual para execução do ciclo de agregação (Admin apenas)
   */
  async triggerAggregation(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Executa de forma assíncrona para não bloquear a resposta
      dependencyConfig.aggregationService.runAggregationCycle();
      
      return reply.send({
        success: true,
        message: 'Ciclo de agregação iniciado em background'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Erro ao disparar agregação'
      });
    }
  }
}
