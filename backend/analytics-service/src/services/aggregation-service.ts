import axios from 'axios';
import { config } from '../config/config.js';
import type { AnalyticsRepository } from '../domain/repositories/analytics-repository.js';

/**
 * Serviço responsável por orquestrar a recolha e agregação de dados de outros microserviços.
 * Este serviço atua como o motor de Business Intelligence do ecossistema.
 */
export class AggregationService {
  constructor(private repository: AnalyticsRepository) {}

  /**
   * Executa um ciclo completo de agregação (pode ser chamado via cron ou trigger)
   */
  async runAggregationCycle() {
    console.log('🔄 Iniciando ciclo de agregação de analytics...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Executamos cada agregação de forma isolada para que uma falha não pare as outras
    try {
      await this.aggregatePropertyStats(today);
    } catch (err) {
      console.error('❌ Falha na agregação de Propriedades:', err);
    }

    try {
      await this.aggregateUserStats(today);
    } catch (err) {
      console.error('❌ Falha na agregação de Utilizadores:', err);
    }

    try {
      await this.aggregateLeadStats(today);
    } catch (err) {
      console.error('❌ Falha na agregação de Leads:', err);
    }

    console.log('✅ Ciclo de agregação concluído.');
  }

  /**
   * Recolhe estatísticas do properties-service
   */
  private async aggregatePropertyStats(date: Date) {
    // Endereço correto: /api/v1/properties-stats
    const response = await axios.get(`${config.SERVICES.PROPERTIES}/api/v1/properties-stats`);
    const stats = response.data.data;
    
    // Guardar total de propriedades
    await this.repository.saveDailyMetric({
      date,
      type: 'TOTAL_PROPERTIES' as any,
      value: stats.total || 0,
      metadata: { source: 'properties-service' }
    });

    // Guardar por estado se disponível
    if (stats.byStatus) {
      for (const [status, count] of Object.entries(stats.byStatus)) {
           await this.repository.saveDailyMetric({
              date,
              type: 'PROPERTIES_BY_STATUS' as any,
              value: count as number,
              metadata: { status }
           });
      }
    }

    // Guardar total de visualizações
    if (stats.totalViews !== undefined) {
      await this.repository.saveDailyMetric({
        date,
        type: 'TOTAL_VIEWS' as any,
        value: stats.totalViews,
        metadata: { source: 'properties-service' }
      });
    }
  }

  /**
   * Recolhe estatísticas do auth/user-service
   */
  private async aggregateUserStats(date: Date) {
    const response = await axios.get(`${config.SERVICES.USERS}/api/v1/users/stats/activity`);
    const { activeUsers, newRegistrations } = response.data.data;
    
    // Guardar usuários ativos
    await this.repository.saveDailyMetric({
      date,
      type: 'ACTIVE_USERS' as any,
      value: activeUsers || 0,
      metadata: {}
    });

    // Guardar novos registros
    await this.repository.saveDailyMetric({
      date,
      type: 'NEW_LEADS' as any,
      value: newRegistrations || 0,
      metadata: { subtype: 'user_registration' }
    });

    // Guardar novos agentes
    if (response.data.data.newAgents !== undefined) {
      await this.repository.saveDailyMetric({
        date,
        type: 'NEW_AGENTS' as any,
        value: response.data.data.newAgents,
        metadata: {}
      });
    }
  }

  /**
   * Recolhe dados de leads e contactos do messages-service
   */
  private async aggregateLeadStats(date: Date) {
    // Endereço correto: /api/v1/messages/stats
    const response = await axios.get(`${config.SERVICES.MESSAGES}/api/v1/messages/stats`);
    const stats = response.data.data;

    await this.repository.saveDailyMetric({
      date,
      type: 'TOTAL_MESSAGES' as any,
      value: stats.total || 0,
      metadata: {}
    });
  }
}

