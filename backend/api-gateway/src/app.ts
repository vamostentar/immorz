import Fastify from 'fastify';
import { config } from './config.js';
import { registerAggregatedHandlers } from './handlers/aggregated.handlers.js';
import { authenticateJWT } from './middleware/auth.middleware.js';
import { setupProxy } from './proxy.js';

export async function createApp() {
  const app = Fastify({
    logger: config.NODE_ENV === 'production'
      ? { level: config.LOG_LEVEL }
      : {
        level: config.LOG_LEVEL,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
          },
        },
      },
    // Disable automatic multipart processing to let proxy handle it
    disableRequestLogging: config.NODE_ENV === 'production',
    ignoreTrailingSlash: true,
    bodyLimit: 50 * 1024 * 1024, // 50MB limit for file uploads
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    // Log full error details for debugging
    console.error(`❌ [API Gateway Error] ${request.method} ${request.url}:`, {
      message: error.message,
      code: (error as any).code,
      statusCode: error.statusCode,
      stack: error.stack,
      // Log nested errors if they exist (common in fastify-reply-from)
      cause: (error as any).cause || (error as any).originalError
    });
    
    // Check if it's a Host validation error from undici/fast-proxy
    if (error.message && error.message.includes('Host validation failed')) {
      console.error('🚨 DETECTED Host validation failure in API Gateway!');
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    
    reply.status(statusCode).send({
      success: false,
      error: {
        code: (error as any).code || 'GATEWAY_ERROR',
        message: message,
        details: config.NODE_ENV !== 'production' ? error.stack : undefined
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (request as any).requestContext?.requestId,
      }
    });
  });


  // Helper to determine if an origin is allowed, considering www/non-www variants
  const isOriginAllowed = (origin?: string): boolean => {
    if (!origin) return true; // allow non-origin requests (curl, mobile)
    try {
      const incoming = new URL(origin);
      const incomingOrigin = `${incoming.protocol}//${incoming.hostname}` + (incoming.port ? `:${incoming.port}` : '');
      const variants = new Set<string>();
      variants.add(incomingOrigin);
      const host = incoming.hostname;
      if (host.startsWith('www.')) {
        variants.add(`${incoming.protocol}//${host.replace(/^www\./, '')}`);
      } else {
        variants.add(`${incoming.protocol}//www.${host}`);
      }

      // Also include the raw origin
      variants.add(origin);

      for (const v of variants) {
        if (config.CORS_ORIGINS.includes(v)) return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  await app.register(import('@fastify/cors'), {
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean | string) => void) => {
      if (!origin) return callback(null, true);
      const allowed = isOriginAllowed(origin);
      if (allowed) {
        // Echo the origin back explicitly instead of just true
        return callback(null, origin);
      }
      
      console.warn(`[CORS] ⛔ Origin not allowed: ${origin}`);
      const error = new Error('Not allowed by CORS');
      return callback(error, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Request-ID',
      'X-Correlation-ID',
      'X-API-Key',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: [
      'X-Request-ID',
      'X-Correlation-ID',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    maxAge: 86400, // 24 hours
  });

  // CRITICAL: Strip any Access-Control-Allow-Origin headers from UPSTREAM responses
  // to prevent "multiple values" or "wildcard when credentials=true" errors in the browser.
  app.addHook('onSend', async (request, reply, payload) => {
    // 1. Remove ANY existing headers that might cause conflict (multiple values or wildcards from upstream)
    reply.removeHeader('access-control-allow-origin');
    reply.removeHeader('Access-Control-Allow-Origin');
    reply.removeHeader('access-control-allow-credentials');
    reply.removeHeader('Access-Control-Allow-Credentials');
    
    // 2. Re-apply correct origin if allowed
    const origin = request.headers.origin;
    if (origin && isOriginAllowed(origin)) {
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header('Vary', 'Origin');
    }
    
    return payload;
  });

  // Preflight OPTIONS requests são geridos automaticamente por @fastify/cors.
  // Evitamos declarar manualmente uma rota OPTIONS global para não duplicar.

  // NOTE: preflight OPTIONS handling is performed inside the onRequest hook below

  // DISABLE multipart processing completely - let proxy handle it natively
  // app.addContentTypeParser('multipart/form-data', function (request, payload, done) {
  //   done(null, payload); // Pass through the raw stream
  // });



  // Global authentication middleware - BEFORE routes and proxy setup
  app.addHook('preHandler', authenticateJWT);

  // Setup proxy routes first
  await setupProxy(app);

  // Register aggregated handlers for user data
  registerAggregatedHandlers(app);

  // Health check
  app.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      version: '1.0.0',
    };
  });

  // Root info
  app.get('/', async () => {
    const baseInfo = {
      name: 'Ribeira Azul API Gateway',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
      },
    };

    // Only expose detailed config in development
    if (config.NODE_ENV !== 'production') {
      return {
        ...baseInfo,
        endpoints: {
          ...baseInfo.endpoints,
          properties: '/api/v1/properties',
        },
        config: {
          propertiesService: config.PROPERTIES_SERVICE_URL,
        },
      };
    }

    return baseInfo;
  });

  return app;
}