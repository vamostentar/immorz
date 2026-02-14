import { AnalyticsDatabase } from '../implementations/prisma-database.js';
import { AggregationService } from '../services/aggregation-service.js';

/**
 * Contentor de dependências globais
 */
export interface DependencyConfig {
  database: AnalyticsDatabase;
  aggregationService: AggregationService;
}

// Configuração de dependências será inicializada no server.ts
export let dependencyConfig: DependencyConfig;

export function initializeDependencies(config: DependencyConfig) {
  dependencyConfig = config;
}
