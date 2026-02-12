import cors from '@fastify/cors';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { config } from './config/config.js';
import { registerIntelligenceRoutes } from './routes/intelligence.routes.js';

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

  // Zod validation
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // CORS
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  // Health check (Internal/Docker)
  app.get('/health', async () => {
    return {
      status: 'healthy',
      service: 'intelligence-service',
      timestamp: new Date().toISOString()
    };
  });

  // Health check (Gateway/Public)
  app.get('/api/v1/intelligence/health', async () => {
    return {
      status: 'healthy',
      service: 'intelligence-service',
      timestamp: new Date().toISOString()
    };
  });


  // Register routes
  await app.register(registerIntelligenceRoutes);

  return app;
}
