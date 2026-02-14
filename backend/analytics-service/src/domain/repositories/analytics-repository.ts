import type { DailyMetric, MetricType, SearchSnapshot } from '@prisma/client';

/**
 * Interface que define os contratos para o repositório de Analytics.
 * Segue o padrão Repository para desacoplar a lógica de negócio da persistência.
 */
export interface AnalyticsRepository {
  // Métricas Diárias
  saveDailyMetric(data: Omit<DailyMetric, 'id' | 'createdAt' | 'value'> & { value: number | any }): Promise<DailyMetric>;
  getMetricsByType(type: MetricType, startDate: Date, endDate: Date): Promise<DailyMetric[]>;
  getLatestMetric(type: MetricType, metadata?: any): Promise<DailyMetric | null>;

  // Snapshots de Pesquisa
  saveSearchSnapshot(region: string, count: number, date: Date): Promise<SearchSnapshot>;
  getTopRegions(limit: number, date: Date): Promise<SearchSnapshot[]>;
  
  // Agregados Customizados (Vão alimentar o Frontend)
  getPropertyDistribution(): Promise<any>;
  getActivitySummary(days: number): Promise<any>;
}
