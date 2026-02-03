import { RequestContext } from '@/types/common';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    requestContext?: RequestContext;
    user?: {
      id: string;
      email: string;
      role: string;
      permissions: string[];
    };
  }
}
