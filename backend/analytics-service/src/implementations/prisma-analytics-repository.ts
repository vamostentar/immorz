import { type DailyMetric, type SearchSnapshot, MetricType, PrismaClient } from '@prisma/client';
import type { AnalyticsRepository } from '../domain/repositories/analytics-repository.js';

/**
 * Implementação do repositório de Analytics utilizando o Prisma ORM.
 */
export class PrismaAnalyticsRepository implements AnalyticsRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Guarda ou atualiza uma métrica diária
   */
  async saveDailyMetric(data: Omit<DailyMetric, 'id' | 'createdAt' | 'value'> & { value: number | any }): Promise<DailyMetric> {
    return this.prisma.dailyMetric.upsert({
      where: {
        date_type_metadata: {
          date: data.date,
          type: data.type,
          metadata: data.metadata || {}
        }
      },
      update: {
        value: data.value
      },
      create: {
        date: data.date,
        type: data.type,
        value: data.value,
        metadata: data.metadata || {}
      }
    });
  }

  /**
   * Obtém métricas por tipo num intervalo de datas
   */
  async getMetricsByType(type: MetricType, startDate: Date, endDate: Date): Promise<DailyMetric[]> {
    return this.prisma.dailyMetric.findMany({
      where: {
        type,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }

  /**
   * Obtém a métrica mais recente para um determinado tipo
   */
  async getLatestMetric(type: MetricType, metadata?: any): Promise<DailyMetric | null> {
    return this.prisma.dailyMetric.findFirst({
      where: {
        type,
        metadata: metadata ? { equals: metadata } : undefined
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  /**
   * Guarda um snapshot de pesquisa regional
   */
  async saveSearchSnapshot(region: string, count: number, date: Date): Promise<SearchSnapshot> {
    return this.prisma.searchSnapshot.upsert({
      where: {
        region_date: {
          region,
          date
        }
      },
      update: {
        count
      },
      create: {
        region,
        count,
        date
      }
    });
  }

  /**
   * Obtém as regiões mais procuradas numa determinada data
   */
  async getTopRegions(limit: number, date: Date): Promise<SearchSnapshot[]> {
    return this.prisma.searchSnapshot.findMany({
      where: {
        date
      },
      take: limit,
      orderBy: {
        count: 'desc'
      }
    });
  }

  /**
   * Obtém a distribuição de propriedades por tipo (Agregado)
   * Nota: Este método poderá evoluir para consultar caches ou pré-agregados
   */
  async getPropertyDistribution(): Promise<any> {
    const latest = await this.prisma.dailyMetric.findMany({
      where: {
        type: 'TOTAL_PROPERTIES'
      },
      orderBy: {
        date: 'desc'
      },
      take: 10 // Pega os últimos snapshots por tipo (armazenado no metadata)
    });
    
    return latest.map(m => ({
      name: (m.metadata as any)?.propertyType || 'Outro',
      value: Number(m.value)
    }));
  }

  /**
   * Obtém resumo de atividade dos últimos X dias
   */
  async getActivitySummary(days: number): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await this.prisma.dailyMetric.findMany({
      where: {
        date: { gte: startDate }
      }
    });

    // Lógica de redução para consolidar o resumo
    return metrics.reduce((acc: any, curr) => {
      const type = curr.type.toLowerCase();
      if (!acc[type]) acc[type] = 0;
      acc[type] += Number(curr.value);
      return acc;
    }, {});
  }
}
