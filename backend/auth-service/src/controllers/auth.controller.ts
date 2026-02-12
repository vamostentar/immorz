import { createSuccessResponse } from '@/middlewares/error-handler';
import { AuthService } from '@/services/auth.service';
import type {
  ChangePasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest
} from '@/types/auth';
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  RegisterSchema
} from '@/types/auth';
import { getRequestContext } from '@/utils/request-context';
import type { FastifyReply, FastifyRequest } from 'fastify';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * User login
   * POST /api/v1/auth/login
   */
  async login(request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) {
    console.log('🔍 Login controller - request.requestContext:', request.requestContext);
    const context = getRequestContext(request);
    console.log('🔍 Login controller - context from getRequestContext:', context);
    
    if (!context) {
      throw new Error('Request context not found');
    }
    
    const credentials = loginSchema.parse(request.body);
    
    const result = await this.authService.login(credentials, context);
    
    if (result.requiresTwoFactor) {
      return reply.code(200).send(
        createSuccessResponse(
          {
            requiresTwoFactor: true,
            tempToken: result.tempToken,
          },
          context.requestId,
          { requiresTwoFactor: true }
        )
      );
    }
    
    return reply.code(200).send(
      createSuccessResponse(result, context.requestId)
    );
  }

  /**
   * User registration
   * POST /api/v1/auth/register
   */
  async register(request: FastifyRequest<{ Body: RegisterRequest }>, reply: FastifyReply) {
    const context = getRequestContext(request)!;
    const userData = RegisterSchema.parse(request.body);
    
    const result = await this.authService.register(userData, context);
    
    return reply.code(201).send(
      createSuccessResponse(result, context.requestId)
    );
  }

  /**
   * Complete two-factor authentication
   * POST /api/v1/auth/2fa/complete
   */
  async complete2FA(
    request: FastifyRequest<{ 
      Body: { tempToken: string; code: string } 
    }>, 
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const { tempToken, code } = request.body;
    
    const result = await this.authService.complete2FA(tempToken, code, context);
    
    return reply.code(200).send(
      createSuccessResponse(result, context.requestId)
    );
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenRequest }>, 
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const data = refreshTokenSchema.parse(request.body);
    
    const result = await this.authService.refreshTokens(data, context);
    
    return reply.code(200).send(
      createSuccessResponse(result, context.requestId)
    );
  }

  /**
   * User logout
   * POST /api/v1/auth/logout
   */
  async logout(request: FastifyRequest, reply: FastifyReply) {
    const context = getRequestContext(request)!;
    const sessionToken = request.headers['x-session-token'] as string || '';
    const sessionId = (request.user as any)?.sessionId;
    
    await this.authService.logout(sessionToken, context, sessionId);
    
    return reply.code(200).send(
      createSuccessResponse({ message: 'Logged out successfully' }, context.requestId)
    );
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(
    request: FastifyRequest<{ Body: ChangePasswordRequest }>, 
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const data = changePasswordSchema.parse(request.body);
    const userId = request.user?.id!;
    
    await this.authService.changePassword(userId, data, context);
    
    return reply.code(200).send(
      createSuccessResponse({ message: 'Password changed successfully' }, context.requestId)
    );
  }

  /**
   * Enable two-factor authentication
   * POST /api/v1/auth/2fa/enable
   */
  async enable2FA(request: FastifyRequest, reply: FastifyReply) {
    const context = getRequestContext(request)!;
    const userId = request.user?.id!;
    
    const result = await this.authService.enable2FA(userId, context);
    
    return reply.code(200).send(
      createSuccessResponse(result, context.requestId)
    );
  }

  /**
   * Confirm two-factor authentication setup
   * POST /api/v1/auth/2fa/confirm
   */
  async confirm2FA(
    request: FastifyRequest<{ 
      Body: { secret: string; token: string } 
    }>, 
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const userId = request.user?.id!;
    const { secret, token } = request.body;
    
    await this.authService.confirm2FA(userId, secret, token, context);
    
    return reply.code(200).send(
      createSuccessResponse(
        { message: 'Two-factor authentication enabled successfully' }, 
        context.requestId
      )
    );
  }

  /**
   * Disable two-factor authentication
   * POST /api/v1/auth/2fa/disable
   */
  async disable2FA(
    request: FastifyRequest<{ 
      Body: { password: string; token: string } 
    }>, 
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const userId = request.user?.id!;
    const { password, token } = request.body;
    
    await this.authService.disable2FA(userId, password, token, context);
    
    return reply.code(200).send(
      createSuccessResponse(
        { message: 'Two-factor authentication disabled successfully' }, 
        context.requestId
      )
    );
  }
  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(
    request: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const { email } = request.body;
    
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }
    
    await this.authService.forgotPassword(email, context);
    
    // Always return success to prevent email enumeration
    return reply.code(200).send(
      createSuccessResponse(
        { message: 'If your email is registered, you will receive password reset instructions.' },
        context.requestId
      )
    );
  }

  /**
   * Reset password
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(
    request: FastifyRequest<{ 
      Body: { token: string; password: string; confirmPassword: string } 
    }>,
    reply: FastifyReply
  ) {
    const context = getRequestContext(request)!;
    const { token, password, confirmPassword } = request.body;
    
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }
    
    await this.authService.resetPassword(token, password, context);
    
    return reply.code(200).send(
      createSuccessResponse(
        { message: 'Password has been reset successfully. You can now login with your new password.' },
        context.requestId
      )
    );
  }
}
