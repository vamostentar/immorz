import { PrismaClient } from '@prisma/client';
import type { AnalyticsRepository } from '../domain/repositories/analytics-repository.js';
import { PrismaAnalyticsRepository } from './prisma-analytics-repository.js';

/**
 * Classe responsável por gerir a ligação global à base de dados para o Analytics.
 */
export class AnalyticsDatabase {
  private prisma: PrismaClient;

  constructor(config: { url: string; log?: string[] }) {
    this.prisma = new PrismaClient({
      datasourceUrl: config.url,
      log: config.log as any,
    });
  }

  /**
   * Conecta à base de dados
   */
  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  /**
   * Desconecta da base de dados
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  /**
   * Verifica se a ligação está ativa
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém a instância do repositório de analytics
   */
  get analytics(): AnalyticsRepository {
    return new PrismaAnalyticsRepository(this.prisma);
  }
}
