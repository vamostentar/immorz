import { config } from '@/config';
import { createAppContainer } from '@/container';
import { registerApprovalRoutes } from '@/routes/approval.routes';
import { registerAuditRoutes } from '@/routes/audit.routes';
import { registerNotificationRoutes } from '@/routes/notification.routes';
import { logger } from '@/utils/logger';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import 'dotenv/config';
import Fastify from 'fastify';

async function main() {
  const fastify = Fastify({
    logger: false, // We use our own pino logger
    trustProxy: true,
  });

  // Security middleware
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Create DI container
  const container = createAppContainer();

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', service: 'notification-service', timestamp: new Date().toISOString() };
  });

  // Extract userId from JWT (simplified - in production use proper JWT validation)
  fastify.addHook('preHandler', async (request) => {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        // Decode JWT payload (simplified - should verify signature in production)
        const token = authHeader.substring(7);
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        (request as any).userId = payload.sub || payload.userId;
      } catch {
        // Ignore, userId will be undefined
      }
    }
  });

  // Register routes with API prefix
  fastify.register(async (app) => {
    registerNotificationRoutes(app, container.resolve('notificationController'));
    registerApprovalRoutes(app, container.resolve('approvalController'));
    registerAuditRoutes(app, container.resolve('auditController'));
  }, { prefix: '/api/v1' });

  // Initialize email worker
  const { createEmailWorker } = await import('@/jobs/email.worker');
  const emailWorker = createEmailWorker(container.resolve('emailService'));
  logger.info('📧 Email worker initialized');

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    logger.error({ err: error, url: request.url }, 'Request error');

    // Prisma known errors
    if (error.name === 'PrismaClientKnownRequestError') {
      return reply.status(400).send({
        success: false,
        error: 'Database operation failed',
        code: (error as any).code,
      });
    }

    // Default error response
    return reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  });

  // Start server
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    logger.info({ port: config.port }, '🚀 Notification service started');
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down...');
    await fastify.close();
    await container.resolve('prisma').$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main();
