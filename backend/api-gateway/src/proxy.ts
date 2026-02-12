import { FastifyInstance } from 'fastify';
import { IncomingHttpHeaders } from 'http';
import { config } from './config.js';

/**
 * PRODUCTION-READY PROXY CONFIGURATION
 * 
 * This implementation uses ONLY @fastify/http-proxy for all services
 * to ensure reliability, maintainability, and production readiness.
 * 
 * No custom StreamProxy implementations or workarounds.
 */
export async function setupProxy(app: FastifyInstance) {
  if (config.ENABLE_DETAILED_LOGGING) {
    console.log('🔧 Setting up PRODUCTION-READY proxy...');
  }

  /**
   * Header processor factory to properly handle Host and other forwarded headers
   */
  const createHeaderProcessor = (upstreamBaseUrl: string) => {
    const upstreamUrl = new URL(upstreamBaseUrl);
    
    return (originalReq: any, headers: IncomingHttpHeaders) => {
      // Prefer any existing X-Forwarded-Proto header from the front proxy
      const incomingXfp = (headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || headers['X-Forwarded-PRoto']) as string | undefined;
      
      const processedHeaders: IncomingHttpHeaders = {
        ...headers,
        'x-forwarded-by': 'api-gateway',
        'x-forwarded-for': originalReq.ip,
        'x-forwarded-proto': incomingXfp || originalReq.protocol,
      };

      // Propagation of user context from auth middleware
      if (originalReq.user) {
        processedHeaders['x-user-id'] = originalReq.user.id;
        processedHeaders['x-user-email'] = originalReq.user.email;
        processedHeaders['x-user-role'] = originalReq.user.role;
      }

      // Preserve multipart Content-Type for file uploads
      const originalContentType = headers['content-type'];
      if (originalContentType && originalContentType.includes('multipart/form-data')) {
        processedHeaders['content-type'] = originalContentType;
      }

      // Remove problematic headers
      delete processedHeaders.expect;
      delete processedHeaders.Expect;
      
      // CRITICAL: Set Host header to match upstream hostname to prevent undici validation errors
      processedHeaders.host = upstreamUrl.host;

      return processedHeaders;
    };
  };

  // 1. AUTH SERVICE PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.AUTH_SERVICE_URL,
    prefix: '/api/v1/auth',
    websocket: false,
    rewritePrefix: '/api/v1/auth',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.AUTH_SERVICE_URL),
    }
  });

  // 2. USERS SERVICE PROXY removido - as rotas /api/v1/users são tratadas
  // pelos handlers agregadores em aggregated.handlers.ts que encaminham
  // para o auth-service (fonte de verdade para dados de utilizador)

  // 3. ROLES ENDPOINT PROXY - encaminha para auth-service onde as roles estão definidas
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.AUTH_SERVICE_URL,
    prefix: '/api/v1/roles',
    websocket: false,
    rewritePrefix: '/api/v1/roles',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.AUTH_SERVICE_URL),
    }
  });

  // 4. AGENTS PROXY - Public agent profiles
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.AUTH_SERVICE_URL,
    prefix: '/api/v1/agents',
    websocket: false,
    rewritePrefix: '/api/v1/agents',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.AUTH_SERVICE_URL),
    }
  });

  // 5. USER PROFILES PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.USERS_SERVICE_URL,
    prefix: '/api/v1/user-profiles',
    websocket: false,
    rewritePrefix: '/api/v1/user-profiles',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.USERS_SERVICE_URL),
    }
  });

  // 6. ADMIN ENDPOINTS PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.USERS_SERVICE_URL,
    prefix: '/api/v1/admin',
    websocket: false,
    rewritePrefix: '/api/v1/admin',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.USERS_SERVICE_URL),
    }
  });

  // 6. PROPERTIES SERVICE PROXY (with minimal auth-only header processing)
  const minimalAuthHeaderProcessor = (upstreamBaseUrl: string) => {
    const upstreamUrl = new URL(upstreamBaseUrl);
    return (originalReq: any, headers: IncomingHttpHeaders) => {
      const processedHeaders: IncomingHttpHeaders = {
        ...headers, // Preserve ALL original headers including Content-Type
      };

      // Only add auth headers
      if (originalReq.user) {
        processedHeaders['x-user-id'] = originalReq.user.id;
        processedHeaders['x-user-email'] = originalReq.user.email;
        processedHeaders['x-user-role'] = originalReq.user.role;
      }

      // CRITICAL: Set Host header to match upstream hostname to prevent undici validation errors
      processedHeaders.host = upstreamUrl.host;

      // DO NOT remove any headers - preserve everything for multipart
      return processedHeaders;
    };
  };

  await app.register(import('@fastify/http-proxy'), {
    upstream: config.PROPERTIES_SERVICE_URL,
    prefix: '/api/v1/properties',
    websocket: false,
    rewritePrefix: '/api/v1/properties',
    replyOptions: {
      rewriteRequestHeaders: minimalAuthHeaderProcessor(config.PROPERTIES_SERVICE_URL),
    }
  });

  // 7. PROPERTIES STATS PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.PROPERTIES_SERVICE_URL,
    prefix: '/api/v1/properties-stats',
    websocket: false,
    rewritePrefix: '/api/v1/properties-stats',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.PROPERTIES_SERVICE_URL),
    }
  });



  // 9. SETTINGS SERVICE PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.SETTINGS_SERVICE_URL,
    prefix: '/api/v1/settings',
    websocket: false,
    rewritePrefix: '/api/v1/settings',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.SETTINGS_SERVICE_URL),
    }
  });

  // 10. MODULE SETTINGS PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.SETTINGS_SERVICE_URL,
    prefix: '/api/v1/module-settings',
    websocket: false,
    rewritePrefix: '/api/v1/module-settings',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.SETTINGS_SERVICE_URL),
    }
  });

  // 11. USER PREFERENCES PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.USERS_SERVICE_URL,
    prefix: '/api/v1/user-preferences',
    websocket: false,
    rewritePrefix: '/api/v1/user-preferences',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.USERS_SERVICE_URL),
    }
  });

  // 12. PROPERTY INTERESTS PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.USERS_SERVICE_URL,
    prefix: '/api/v1/property-interests',
    websocket: false,
    rewritePrefix: '/api/v1/property-interests',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.USERS_SERVICE_URL),
    }
  });

  // 13. SAVED PROPERTIES PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.USERS_SERVICE_URL,
    prefix: '/api/v1/saved-properties',
    websocket: false,
    rewritePrefix: '/api/v1/saved-properties',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.USERS_SERVICE_URL),
    }
  });

  // 14. SEARCH HISTORY PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.USERS_SERVICE_URL,
    prefix: '/api/v1/search-history',
    websocket: false,
    rewritePrefix: '/api/v1/search-history',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.USERS_SERVICE_URL),
    }
  });

  // 15. NOTIFICATIONS PROXY - Routes to new notification-service
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.NOTIFICATIONS_SERVICE_URL,
    prefix: '/api/v1/notifications',
    websocket: false,
    rewritePrefix: '/api/v1/notifications',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.NOTIFICATIONS_SERVICE_URL),
    }
  });

  // 15.1 APPROVALS PROXY - Notification service handles approval workflow
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.NOTIFICATIONS_SERVICE_URL,
    prefix: '/api/v1/approvals',
    websocket: false,
    rewritePrefix: '/api/v1/approvals',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.NOTIFICATIONS_SERVICE_URL),
    }
  });

  // 15.2 AUDIT LOGS PROXY - Notification service handles audit logging
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.NOTIFICATIONS_SERVICE_URL,
    prefix: '/api/v1/audit-logs',
    websocket: false,
    rewritePrefix: '/api/v1/audit-logs',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.NOTIFICATIONS_SERVICE_URL),
    }
  });

  // 16. IMAGES PROXY - Direct routes for image management
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.PROPERTIES_SERVICE_URL,
    prefix: '/api/v1/images',
    websocket: false,
    rewritePrefix: '/api/v1/images',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.PROPERTIES_SERVICE_URL),
    }
  });


  // 17. UPLOADS PROXY (static files) - PUBLIC ROUTE, NO AUTH HEADERS NEEDED
  // Changed to /api/v1/uploads to ensure proper routing through API Gateway ingress
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.PROPERTIES_SERVICE_URL,
    prefix: '/api/v1/uploads',
    websocket: false,
    rewritePrefix: '/uploads',
    // Header processing to prevent Host validation errors
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.PROPERTIES_SERVICE_URL),
    }
  });

  // 17.1. UPLOADS PROXY (Legacy support / Direct access) - Fixes 404 on image load
  // The frontend Nginx proxies /uploads/ to api-gateway, so we must handle this prefix
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.PROPERTIES_SERVICE_URL,
    prefix: '/uploads',
    websocket: false,
    rewritePrefix: '/uploads', // Keep path as-is
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.PROPERTIES_SERVICE_URL),
    }
  });



  // 18. PROJECTS PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.PROPERTIES_SERVICE_URL,
    prefix: '/api/v1/projects',
    websocket: false,
    rewritePrefix: '/api/v1/projects',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.PROPERTIES_SERVICE_URL),
    }
  });

  // 19. MESSAGES SERVICE PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: (config as any).MESSAGES_SERVICE_URL || 'http://messages:8090',
    prefix: '/api/v1/messages',
    websocket: false,
    rewritePrefix: '/api/v1/messages',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor((config as any).MESSAGES_SERVICE_URL || 'http://messages:8090'),
    }
  });

  // 20. MEDIA SERVICE PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.MEDIA_SERVICE_URL,
    prefix: '/api/v1/media',
    websocket: false,
    rewritePrefix: '/api/v1/media', // Keep prefix for media-service routes
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.MEDIA_SERVICE_URL),
    }
  });

  // 21. INTELLIGENCE SERVICE PROXY
  await app.register(import('@fastify/http-proxy'), {
    upstream: config.INTELLIGENCE_SERVICE_URL,
    prefix: '/api/v1/intelligence',
    websocket: false,
    rewritePrefix: '/api/v1/intelligence',
    replyOptions: {
      rewriteRequestHeaders: createHeaderProcessor(config.INTELLIGENCE_SERVICE_URL),
    }
  });

  if (config.ENABLE_DETAILED_LOGGING) {
    console.log('✅ PRODUCTION-READY proxy configured for ALL services');
    console.log('📍 Total Proxies Configured: 24');
    console.log(`📍 Auth Service: ${config.AUTH_SERVICE_URL}`);
    console.log(`📍 Users Service: ${config.USERS_SERVICE_URL}`);
    console.log(`📍 Properties Service: ${config.PROPERTIES_SERVICE_URL}`);
    console.log(`📍 Media Service: ${config.MEDIA_SERVICE_URL}`);
    console.log(`📍 Settings Service: ${config.SETTINGS_SERVICE_URL}`);
    console.log(`📍 Messages Service: ${config.MESSAGES_SERVICE_URL}`);
    console.log(`📍 Notifications Service: ${config.NOTIFICATIONS_SERVICE_URL}`);
    console.log(`📍 Intelligence Service: ${config.INTELLIGENCE_SERVICE_URL}`);
  }
}
