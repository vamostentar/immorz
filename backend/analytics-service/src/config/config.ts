import dotenv from 'dotenv';
import path from 'path';

// Carregar .env da raiz do projeto para partilhar configurações globais
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

/**
 * Configuração centralizada do Microserviço de Analytics
 */
export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.ANALYTICS_PORT || '8089', 10),
  HOST: process.env.HOST || '0.0.0.0',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  
  // Base de Dados (Prisma)
  // Nota: Usamos um schema separado para isolamento de dados de BI
  DATABASE_URL: process.env.DATABASE_URL?.replace('schema=auth', 'schema=analytics') || 'postgresql://postgres:postgres@localhost:5432/ribeirazul?schema=analytics',

  // Descoberta de Serviços Internos
  SERVICES: {
    AUTH: process.env.AUTH_SERVICE_URL || 'http://auth:3001',
    USERS: process.env.USERS_SERVICE_URL || 'http://users:8081',
    PROPERTIES: process.env.PROPERTIES_SERVICE_URL || 'http://properties:8082',
    MESSAGES: process.env.MESSAGES_SERVICE_URL || 'http://messages:8083',
  },

  // Configurações de Agregação
  AGGREGATION: {
    DEFAULT_INTERVAL_MS: 1000 * 60 * 60, // 1 hora por defeito
  }
};

// Validação de variáveis críticas
if (!process.env.DATABASE_URL && config.NODE_ENV === 'production') {
  console.warn('⚠️ WARNING: DATABASE_URL não definida em produção. A usar fallback local.');
}
