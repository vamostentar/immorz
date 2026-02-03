import { FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../utils/logger';

/**
 * Authentication middleware for Internal Services
 * Extracts user information from headers injected by the API Gateway
 */
export async function authenticateInternal(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const userId = request.headers['x-user-id'] as string;
    const userEmail = request.headers['x-user-email'] as string;
    const userRole = request.headers['x-user-role'] as string;
    
    // If we have a user ID from the gateway, populate the request.user object
    if (userId) {
      request.user = {
        id: userId,
        email: userEmail || '',
        role: userRole || 'USER',
        permissions: [], // Permissions can be added here if needed in the future
      };
      
      if (process.env.ENABLE_DETAILED_LOGGING === 'true') {
        logger.debug({ userId, userEmail }, 'User authenticated via Gateway headers');
      }
    }
  } catch (error) {
    logger.warn({ err: error }, 'Error in internal authentication middleware');
    // We don't block here because some routes might be public
    // The controllers will check for request.user if needed
  }
}
