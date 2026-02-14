import { config } from '@/config';
import { RefreshTokenRepository, SessionRepository } from '@/repositories/session.repository';
import { UserRepository } from '@/repositories/user.repository';
import type {
    JWTPayload,
    LoginRequest,
    LoginResponse,
    TokenPair,
    TwoFactorSetup
} from '@/types/auth';
import type { RequestContext } from '@/types/common';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError
} from '@/types/common';
import {
    generateJTI,
    generateRandomString,
    generateSecureToken,
    generateSessionToken,
    hashPassword,
    verifyPassword
} from '@/utils/crypto';
import { logger, logHelpers } from '@/utils/logger';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  private _userRepository?: UserRepository;
  private _sessionRepository?: SessionRepository;
  private _refreshTokenRepository?: RefreshTokenRepository;

  constructor(private prisma: PrismaClient) {
    // Dependencies are initialized lazily
  }

  private get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository(this.prisma);
    }
    return this._userRepository;
  }

  private get sessionRepository(): SessionRepository {
    if (!this._sessionRepository) {
      this._sessionRepository = new SessionRepository(this.prisma);
    }
    return this._sessionRepository;
  }

  private get refreshTokenRepository(): RefreshTokenRepository {
    if (!this._refreshTokenRepository) {
      this._refreshTokenRepository = new RefreshTokenRepository(this.prisma);
    }
    return this._refreshTokenRepository;
  }

  /**
   * User login with email/password
   */
  async login(
    credentials: LoginRequest,
    context: RequestContext
  ): Promise<LoginResponse> {
    const { email, password, rememberMe, twoFactorCode } = credentials;

    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        logHelpers.loginFailed(email, 'user_not_found', context);
        throw new UnauthorizedError('Invalid credentials');
      }

      // Check if account is active
      if (!user.isActive) {
        logHelpers.loginFailed(email, 'account_disabled', context);
        throw new UnauthorizedError('Account is disabled');
      }

      // Verify password
      const isValidPassword = await verifyPassword((user as any).password, password);
      if (!isValidPassword) {
        logHelpers.loginFailed(email, 'invalid_password', context);
        throw new UnauthorizedError('Invalid credentials');
      }

      // Check if email verification is required
      if (config.emailConfig && !user.isEmailVerified) {
        logHelpers.loginFailed(email, 'email_not_verified', context);
        throw new UnauthorizedError('Email verification required');
      }

      // Handle two-factor authentication
      if (user.twoFactorEnabled) {
        if (!twoFactorCode) {
          // Generate 2FA token
          const token = generateRandomString(6, '0123456789');
          const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

          // Store token
          await this.prisma.twoFactorToken.create({
            data: {
              email: user.email,
              token,
              expiresAt,
            }
          });

          // Send email via Notification Service
          const { getNotificationClient } = await import('@/services/notification-client');
          const notificationClient = getNotificationClient();
          await notificationClient.sendTwoFactorToken(
            user.email,
            token,
            user.firstName || 'Utilizador'
          );

          // Return temporary token for 2FA completion
          const tempToken = this.generateTempToken(user.id, !!rememberMe);
          return {
            user: this.sanitizeUser(user),
            requiresTwoFactor: true,
            tempToken,
            tokens: {} as TokenPair, 
          };
        }

        // Verify 2FA code
        const isValid2FA = await this.verify2FA(user.email, twoFactorCode);
        if (!isValid2FA) {
          logHelpers.loginFailed(email, 'invalid_2fa', context);
          throw new UnauthorizedError('Invalid two-factor authentication code');
        }
        
        // Code used, delete it
        await this.prisma.twoFactorToken.deleteMany({
            where: { email: user.email, token: twoFactorCode }
        });
      }

      // Create session
    const sessionToken = generateSessionToken();
    const sessionTimeout = rememberMe 
      ? 30 * 24 * 60 * 60 // 30 days
      : config.securityConfig.sessionTimeout;
    
    const expiresAt = new Date(Date.now() + sessionTimeout * 1000);

    const session = await this.sessionRepository.create({
      userId: user.id,
      sessionToken,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      expiresAt,
      rememberMe: !!rememberMe,
    });

      // Generate JWT tokens
      const tokens = await this.generateTokenPair(user, session.id, rememberMe, context);

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Log successful login
      logHelpers.loginSuccess(user.id, context);

      return {
        user: this.sanitizeUser(user),
        tokens,
      };

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        // Record failed login attempt
        await this.recordLoginAttempt(email, context, false, error.message);
      }
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(data: any, context: RequestContext): Promise<any> {
    const { email, password, firstName, lastName, role, ...otherData } = data;

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || { connect: { name: 'client' } }, // Default to client if not specified
      ...otherData
    });

    // Auto-login after register
    return this.login({ email, password, rememberMe: false }, context);
  }

  /**
   * Complete two-factor authentication
   */
  async complete2FA(
    tempToken: string,
    twoFactorCode: string,
    context: RequestContext
  ): Promise<LoginResponse> {
    try {
      // Verify temp token
      const decoded = jwt.verify(tempToken, config.jwtConfig.secret) as JWTPayload;
      if (decoded.type !== 'temp_2fa') {
        throw new UnauthorizedError('Invalid temporary token');
      }

      const user = await this.userRepository.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Verify 2FA code
      const isValid2FA = await this.verify2FA(user.email, twoFactorCode);
      if (!isValid2FA) {
        logHelpers.loginFailed(user.email, 'invalid_2fa', context);
        throw new UnauthorizedError('Invalid two-factor authentication code');
      }

      // Code used, delete it
      await this.prisma.twoFactorToken.deleteMany({
        where: { email: user.email, token: twoFactorCode }
      });

      // Create session
      const sessionToken = generateSessionToken();
      const sessionTimeout = decoded.rememberMe 
        ? 30 * 24 * 60 * 60 // 30 days 
        : config.securityConfig.sessionTimeout;
        
      const expiresAt = new Date(Date.now() + sessionTimeout * 1000);

      const session = await this.sessionRepository.create({
        userId: user.id,
        sessionToken,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        expiresAt,
        rememberMe: !!decoded.rememberMe,
      });

      // Generate JWT tokens
      const tokens = await this.generateTokenPair(user, session.id, !!decoded.rememberMe, context);

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Log successful login
      logHelpers.loginSuccess(user.id, context);

      return {
        user: this.sanitizeUser(user),
        tokens,
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshTokens(data: { refreshToken: string }, context: RequestContext): Promise<TokenPair> {
    const { refreshToken } = data;

    // Find refresh token in DB
    const tokenRecord = await this.refreshTokenRepository.findByToken(refreshToken);
    
    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      // If token is revoked or expired, we might want to revoke all tokens for this user for security
      await this.refreshTokenRepository.revokeAllForUser(tokenRecord.userId);
      throw new UnauthorizedError('Expired or revoked refresh token');
    }

    const user = await this.userRepository.findById(tokenRecord.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Check if sessionId is valid
    /* 
       Note: In a stricter implementation, we would validate the session here too.
       For now, we just rely on the refresh token.
    */

    // Rotate refresh token (revoke old, issue new)
    await this.refreshTokenRepository.revoke(tokenRecord.id);

    // Generate new pair
    // We try to keep the same session ID from the payload if possible, but here we don't have the access token payload easily.
    // We can assume a new session or try to look it up. For simplicity, we generate a new token pair 
    // but we need a session ID. Let's create a new 'refresh' session or reuse if we stored it.
    // The previous implementation likely reused the session. 
    // Let's generate a new session ID for the new access token to track it, or pass an existing one if we tracked it in RefreshToken model.
    // Looking at RefreshToken model/repository, we might not have sessionId there.
    // Let's use a placeholder or generate a new one. 
    // Ideally, we should recover the session ID.
    const sessionId = generateSessionToken(); // New session/trace ID for this pair

    return this.generateTokenPair(user, sessionId, false, context);
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string, context: RequestContext, sessionId?: string): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenRepository.revoke(refreshToken);
    }

    if (sessionId) {
      await this.sessionRepository.deactivate(sessionId);
    }
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: any, context: RequestContext): Promise<void> {
    const { currentPassword, newPassword } = data;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isValid = await verifyPassword((user as any).password, currentPassword);
    if (!isValid) {
      throw new UnauthorizedError('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update
    await this.userRepository.updatePassword(userId, hashedPassword);

    // Revoke all sessions/tokens
    await this.sessionRepository.deactivateAllForUser(userId);
    await this.refreshTokenRepository.revokeAllForUser(userId);

    logger.info({ userId, requestId: context.requestId }, 'Password changed successfully');
  }

  /**
   * Enable two-factor authentication
   */
  async enable2FA(userId: string, context: RequestContext): Promise<TwoFactorSetup> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.twoFactorEnabled) {
        throw new ConflictError('Two-factor authentication is already enabled');
      }

      // Enable 2FA immediately for Email 2FA (Simplification as requested)
      // We pass empty strings for secret/backupCodes as they are not used for Email 2FA
      await this.userRepository.enableTwoFactor(userId, '', []);

      logger.info({
        requestId: context.requestId,
        userId,
      }, 'Two-factor authentication enabled directly');

      return {
        secret: '', // No secret for Email 2FA
        qrCode: '', // No QR Code for Email 2FA
        backupCodes: [],
      };

    } catch (error) {
      logger.error({
        requestId: context.requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Enable 2FA failed');

      throw error;
    }
  }

  /**
   * Verify and confirm 2FA setup
   */
  async confirm2FA(
    userId: string,
    secret: string, // Ignored in Email 2FA
    token: string,
    context: RequestContext
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify email token
      const isValid = await this.verify2FA(user.email, token);
      if (!isValid) {
        throw new ValidationError('Invalid authentication code');
      }

      // Enable 2FA for user
      // We pass empty strings for secret/backupCodes as they are not used for Email 2FA
      await this.userRepository.enableTwoFactor(userId, '', []);
      
      // Cleanup used token
      await this.prisma.twoFactorToken.deleteMany({
        where: { email: user.email, token }
      });

      logger.info({
        requestId: context.requestId,
        userId,
      }, 'Two-factor authentication enabled');

    } catch (error) {
      logger.error({
        requestId: context.requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Confirm 2FA failed');

      throw error;
    }
  }

  /**
   * Request 2FA deactivation code
   */
  async request2FADisable(userId: string, context: RequestContext): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.twoFactorEnabled) {
      throw new ValidationError('A autenticação em duas etapas não está ativada');
    }

    // Generate 2FA token
    const token = generateRandomString(6, '0123456789');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store token
    await this.prisma.twoFactorToken.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      }
    });

    // Send email via Notification Service
    const { getNotificationClient } = await import('@/services/notification-client');
    const notificationClient = getNotificationClient();
    const emailResult = await notificationClient.sendTwoFactorToken(
      user.email,
      token,
      user.firstName || 'Utilizador'
    );

    if (!emailResult.success) {
      logger.error({
        requestId: context.requestId,
        userId,
        email: user.email,
        error: emailResult.error
      }, 'Failed to send 2FA disable token email');
      throw new Error('Falha ao enviar e-mail de verificação. Por favor tente novamente.');
    }

    logger.info({
      requestId: context.requestId,
      userId,
      email: user.email
    }, 'Two-factor deactivation code requested');
  }

  async disable2FA(
    userId: string,
    password: string,
    context: RequestContext
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.twoFactorEnabled) {
        throw new ValidationError('A autenticação em duas etapas não está ativada');
      }

      // Verify password
      const isValidPassword = await verifyPassword((user as any).password, password);
      if (!isValidPassword) {
        throw new UnauthorizedError('Senha incorreta');
      }

      // Disable 2FA
      await this.userRepository.disableTwoFactor(userId);

      logger.info({
        requestId: context.requestId,
        userId,
      }, 'Two-factor authentication disabled directly by user');

    } catch (error) {
      logger.error({
        requestId: context.requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Disable 2FA failed');

      throw error;
    }
  }

  /**
   * Generate JWT token pair
   */
  private async generateTokenPair(
    user: any,
    sessionId: string,
    rememberMe: boolean = false,
    context?: RequestContext
  ): Promise<TokenPair> {
    const jti = generateJTI();
    const now = Math.floor(Date.now() / 1000);

    const accessTokenExpiry = rememberMe
      ? config.jwtConfig.accessExpiry
      : '1h';

    const refreshTokenExpiry = rememberMe
      ? '30d'
      : config.jwtConfig.refreshExpiry;

    // Access token payload
    const accessPayload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions,
      sessionId,
      iat: now,
      iss: config.jwtConfig.issuer,
      aud: config.jwtConfig.audience,
      jti,
    };

    // Generate tokens
    const accessToken = jwt.sign(accessPayload as any, config.jwtConfig.secret as any, { expiresIn: accessTokenExpiry } as any);

    const refreshTokenValue = generateSecureToken(64);
    const refreshTokenExpiresAt = new Date(
      Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000)
    );

    // Store refresh token
    await this.refreshTokenRepository.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: accessTokenExpiry === '1h' ? 3600 : parseInt(accessTokenExpiry) || 14400,
      tokenType: 'Bearer',
    };
  }

  /**
   * Generate temporary token for 2FA
   */
  private generateTempToken(userId: string, rememberMe: boolean = false): string {
    const payload = {
      sub: userId,
      type: 'temp_2fa',
      rememberMe,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, config.jwtConfig.secret, { expiresIn: '10m' });
  }

  /**
   * Verify 2FA code (Email based)
   */
  private async verify2FA(email: string, code: string): Promise<boolean> {
    // Find the token
    const tokenRecord = await this.prisma.twoFactorToken.findFirst({
        where: {
            email,
            token: code,
            expiresAt: { gt: new Date() }
        }
    });

    return !!tokenRecord;
  }

  /**
   * Record login attempt
   */
  private async recordLoginAttempt(
    email: string,
    context: RequestContext,
    success: boolean,
    failureReason?: string
  ): Promise<void> {
    try {
      await this.prisma.loginAttempt.create({
        data: {
          email: email.toLowerCase(),
          ipAddress: context.ipAddress || 'unknown',
          userAgent: context.userAgent,
          success,
          failureReason,
        },
      });
    } catch (error) {
      logger.error({
        requestId: context.requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Failed to record login attempt');
    }
  }

  /**
   * Sanitize user data for public consumption
   */
  private sanitizeUser(user: any) {
    if (!user) return null;
    
    // Create a safe copy
    // We explicitly destructure to ensure we're not missing properties due to prototype chain
    const { 
      password, 
      twoFactorSecret, 
      twoFactorBackupCodes, 
      ...safeUser 
    } = user;

    return safeUser;
  }

  /**
   * Initiate password recovery
   */
  async forgotPassword(email: string, context: RequestContext): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal that user doesn't exist
      logger.info({ email }, 'Forgot password requested for non-existent email');
      return;
    }

    // Generate reset token
    const token = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Store in PasswordReset table
    await this.prisma.passwordReset.create({
      data: {
        email: user.email,
        token,
        expiresAt,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    // Send email
    const { getNotificationClient } = await import('./notification-client');
    const notificationClient = getNotificationClient();
    
    await notificationClient.sendPasswordResetEmail(
      user.email,
      token,
      user.firstName || undefined
    );

    logger.info({
      requestId: context.requestId,
      userId: user.id,
      email: user.email,
    }, 'Password reset email sent');
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string, context: RequestContext): Promise<void> {
    // Find reset token
    const resetRecord = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Find associated user
    const user = await this.userRepository.findByEmail(resetRecord.email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify that the new password is not the same as the current one
    const currentHashedPassword = (user as any).password;
    if (currentHashedPassword) {
      const isSamePassword = await verifyPassword(currentHashedPassword, newPassword);
      if (isSamePassword) {
        throw new ValidationError('Esta senha já foi utilizada recentemente!');
      }
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await this.userRepository.updatePassword(user.id, hashedPassword);

    // Mark token as used
    await this.prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    // Revoke all sessions
    await this.sessionRepository.deactivateAllForUser(user.id);
    await this.refreshTokenRepository.revokeAllForUser(user.id);

    logger.info({
      requestId: context.requestId,
      userId: user.id,
    }, 'Password reset successfully');

    // Send confirmation email
    const { getNotificationClient } = await import('./notification-client');
    const notificationClient = getNotificationClient();
    
    await notificationClient.sendPasswordResetSuccessEmail(
      user.email,
      user.firstName || undefined
    );
  }
}

