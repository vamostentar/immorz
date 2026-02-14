import cors from '@fastify/cors';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { config } from './config/config.js';
import { registerAnalyticsRoutes } from './routes/analytics.routes.js';

/**
 * Cria e configura a instância da aplicação Fastify
 */
export async function createApp() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport: config.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: { colorize: true }
      } : undefined
    }
  }).withTypeProvider<ZodTypeProvider>();

  // Configuração de compilers para suporte a Zod (validação e serialização)
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Registo do middleware CORS
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  // Endpoint de Health Check (Monitorização Interna/Docker)
  app.get('/health', async () => {
    return {
      status: 'healthy',
      service: 'analytics-service',
      timestamp: new Date().toISOString()
    };
  });

  // Endpoint de Health Check Público (Via Gateway)
  app.get('/api/v1/analytics/health', async () => {
    return {
      status: 'healthy',
      service: 'analytics-service',
      timestamp: new Date().toISOString()
    };
  });

  // Registo de Rotas do Domínio
  await app.register(registerAnalyticsRoutes);

  return app;
}
