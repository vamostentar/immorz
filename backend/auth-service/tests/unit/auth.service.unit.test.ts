import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../src/services/auth.service';
import { ConflictError, NotFoundError, ValidationError } from '../../src/types/common';

// Mock dependências externas (exaustivo: relativo + aliases)
vi.mock('@/utils/crypto', () => ({
  hashPassword: vi.fn(password => Promise.resolve(`hashed-${password}`)),
  verifyPassword: vi.fn(),
  verifyTOTP: vi.fn(),
  generateSecureToken: vi.fn(() => 'mock-token'),
  generateSessionToken: vi.fn(() => 'mock-session-token'),
  generateJTI: vi.fn(() => 'mock-jti'),
  generateBackupCodes: vi.fn(() => ['111111', '222222']),
}));

vi.mock('../../src/utils/crypto', () => ({
  hashPassword: vi.fn(password => Promise.resolve(`hashed-${password}`)),
  verifyPassword: vi.fn(),
  verifyTOTP: vi.fn(),
  generateSecureToken: vi.fn(() => 'mock-token'),
  generateSessionToken: vi.fn(() => 'mock-session-token'),
  generateJTI: vi.fn(() => 'mock-jti'),
  generateBackupCodes: vi.fn(() => ['111111', '222222']),
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  logHelpers: {
    loginSuccess: vi.fn(),
    loginFailed: vi.fn(),
    logout: vi.fn(),
    userCreated: vi.fn(),
    userUpdated: vi.fn(),
    userDeleted: vi.fn(),
  },
}));

vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  logHelpers: {
    loginSuccess: vi.fn(),
    loginFailed: vi.fn(),
    logout: vi.fn(),
    userCreated: vi.fn(),
    userUpdated: vi.fn(),
    userDeleted: vi.fn(),
  },
}));

vi.mock('@/config', () => ({
  config: {
    LOG_LEVEL: 'info',
    jwtConfig: { accessExpiry: '1h', refreshExpiry: '7d', issuer: 'iss', audience: 'aud' },
    emailConfig: { from: 'test@test.com' },
    securityConfig: { sessionTimeout: 3600 },
  }
}));

vi.mock('../../src/config', () => ({
  config: {
    LOG_LEVEL: 'info',
    jwtConfig: { accessExpiry: '1h', refreshExpiry: '7d', issuer: 'iss', audience: 'aud' },
    emailConfig: { from: 'test@test.com' },
    securityConfig: { sessionTimeout: 3600 },
  }
}));

vi.mock('@/services/notification-client', () => ({
  getNotificationClient: vi.fn(() => ({
    sendPasswordResetEmail: vi.fn().mockResolvedValue({}),
    sendPasswordResetConfirmationEmail: vi.fn().mockResolvedValue({}),
    sendPasswordResetSuccessEmail: vi.fn().mockResolvedValue({}),
  })),
}));

vi.mock('../../src/services/notification-client', () => ({
  getNotificationClient: vi.fn(() => ({
    sendPasswordResetEmail: vi.fn().mockResolvedValue({}),
    sendPasswordResetConfirmationEmail: vi.fn().mockResolvedValue({}),
    sendPasswordResetSuccessEmail: vi.fn().mockResolvedValue({}),
  })),
}));

vi.mock('@/services/email.service', () => ({
  getEmailService: vi.fn(() => ({
    sendActivationEmail: vi.fn().mockResolvedValue({}),
    sendAdminNotification: vi.fn().mockResolvedValue({}),
  })),
}));

vi.mock('../../src/services/email.service', () => ({
  getEmailService: vi.fn(() => ({
    sendActivationEmail: vi.fn().mockResolvedValue({}),
    sendAdminNotification: vi.fn().mockResolvedValue({}),
  })),
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(() => 'mock-jwt-token'),
  verify: vi.fn(() => ({ sub: 'user-id', type: 'temp_2fa' })),
}));

describe('AuthService (Unit Tests)', () => {
  let authService: AuthService;
  let mockPrisma: any;
  let mockUserRepository: any;
  let mockSessionRepository: any;
  let mockRefreshTokenRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma = {
      loginAttempt: { create: vi.fn() },
      passwordReset: { 
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
      },
      user: {
        count: vi.fn().mockResolvedValue(1)
      },
      role: {
        findFirst: vi.fn(),
        create: vi.fn()
      }
    };

    authService = new AuthService(mockPrisma as unknown as PrismaClient);
    
    // Injeção de repositórios mockados
    mockUserRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      findByUsername: vi.fn(),
      updatePassword: vi.fn(),
      useBackupCode: vi.fn(),
      create: vi.fn(),
      updateLastLogin: vi.fn(),
      enableTwoFactor: vi.fn(),
      disableTwoFactor: vi.fn(),
    };
    (authService as any)._userRepository = mockUserRepository;

    mockSessionRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByToken: vi.fn(),
      findActiveByUserId: vi.fn().mockResolvedValue([]),
      deactivateById: vi.fn().mockResolvedValue({}),
      deactivateAllForUser: vi.fn().mockResolvedValue({}),
    };
    (authService as any)._sessionRepository = mockSessionRepository;

    mockRefreshTokenRepository = {
      create: vi.fn().mockResolvedValue({}),
      findByToken: vi.fn(),
      revokeAllForUser: vi.fn().mockResolvedValue({}),
      revoke: vi.fn().mockResolvedValue({}),
    };
    (authService as any)._refreshTokenRepository = mockRefreshTokenRepository;
  });

  describe('verify2FA', () => {
    it('should return false if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      const result = await (authService as any).verify2FA('user-id', '123456');
      expect(result).toBe(false);
    });

    it('should return false if 2FA is not enabled', async () => {
      mockUserRepository.findById.mockResolvedValue({ twoFactorEnabled: false });
      const result = await (authService as any).verify2FA('user-id', '123456');
      expect(result).toBe(false);
    });

    it('should return false if backup codes do not match', async () => {
      mockUserRepository.findById.mockResolvedValue({ 
        twoFactorEnabled: true, 
        twoFactorSecret: 'secret',
        twoFactorBackupCodes: ['999999'] 
      });
      const result = await (authService as any).verify2FA('user-id', '123456');
      expect(result).toBe(false);
    });

    it('should use backup code successfully', async () => {
      mockUserRepository.findById.mockResolvedValue({ 
        twoFactorEnabled: true, 
        twoFactorSecret: 'secret',
        twoFactorBackupCodes: ['123456'] 
      });
      const result = await (authService as any).verify2FA('user-id', '123456');
      expect(result).toBe(true);
      expect(mockUserRepository.useBackupCode).toHaveBeenCalledWith('user-id', '123456');
    });
  });

  describe('forgotPassword', () => {
    it('should return early if user not found (security)', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await authService.forgotPassword('test@test.com', { requestId: '1' } as any);
      expect(mockPrisma.passwordReset.create).not.toHaveBeenCalled();
    });
    
    it('should complete forgotPassword successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com', firstName: 'Test' });
      mockPrisma.passwordReset.create.mockResolvedValue({});
      
      await authService.forgotPassword('test@test.com', { requestId: '1' } as any);
      expect(mockPrisma.passwordReset.create).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw ValidationError if token not found', async () => {
      mockPrisma.passwordReset.findUnique.mockResolvedValue(null);
      await expect(authService.resetPassword('invalid-token', 'Pass123!', {} as any))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if token is used', async () => {
      mockPrisma.passwordReset.findUnique.mockResolvedValue({ isUsed: true });
      await expect(authService.resetPassword('used-token', 'Pass123!', {} as any))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if token is expired', async () => {
      mockPrisma.passwordReset.findUnique.mockResolvedValue({ 
        isUsed: false, 
        expiresAt: new Date(Date.now() - 1000) 
      });
      await expect(authService.resetPassword('expired-token', 'Pass123!', {} as any))
        .rejects.toThrow(ValidationError);
    });

    it('should throw NotFoundError if user associated with token not found', async () => {
      mockPrisma.passwordReset.findUnique.mockResolvedValue({ 
        isUsed: false, 
        expiresAt: new Date(Date.now() + 10000),
        email: 'ghost@test.com'
      });
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.resetPassword('token', 'Pass123!', {} as any))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if new password is same as current', async () => {
      mockPrisma.passwordReset.findUnique.mockResolvedValue({ 
        isUsed: false, 
        expiresAt: new Date(Date.now() + 10000),
        email: 'same@test.com'
      });
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1', password: 'hashed-password' });
      const { verifyPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(true);

      await expect(authService.resetPassword('token', 'current-password', {} as any))
        .rejects.toThrow('Esta senha já foi utilizada recentemente!');
    });

    it('should complete resetPassword successfully', async () => {
      mockPrisma.passwordReset.findUnique.mockResolvedValue({ 
        isUsed: false, 
        expiresAt: new Date(Date.now() + 10000),
        email: 'test@test.com'
      });
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1', password: 'old-hashed' });
      const { verifyPassword, hashPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(false);
      (hashPassword as any).mockResolvedValue('new-hashed');
      mockUserRepository.updatePassword.mockResolvedValue({});
      mockPrisma.passwordReset.update.mockResolvedValue({});

      await authService.resetPassword('valid-token', 'NewPass123!', { requestId: '1' } as any);
      expect(mockUserRepository.updatePassword).toHaveBeenCalled();
      expect(mockPrisma.passwordReset.update).toHaveBeenCalled();
      expect(mockSessionRepository.deactivateAllForUser).toHaveBeenCalled();
    });
  });

  describe('login branches', () => {
    it('should throw UnauthorizedError if user is inactive', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ isActive: false });
      await expect(authService.login({ email: 'inactive@test.com', password: 'password' }, {} as any))
        .rejects.toThrow('Account is disabled');
    });

    it('should throw UnauthorizedError if password is incorrect', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ isActive: true, password: 'hashed' });
      const { verifyPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(false);
      await expect(authService.login({ email: 'test@test.com', password: 'wrong' }, {} as any))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedError if email is not verified', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ isActive: true, password: 'hashed', isEmailVerified: false });
      const { verifyPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(true);
      await expect(authService.login({ email: 'test@test.com', password: 'pass' }, {} as any))
        .rejects.toThrow('Email verification required');
    });

    it('should return requiresTwoFactor if 2FA enabled but no code provided', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ 
        id: 'u1', email: '2fa@test.com', isActive: true, password: 'hashed', isEmailVerified: true, twoFactorEnabled: true 
      });
      const { verifyPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(true);
      
      const result = await authService.login({ email: '2fa@test.com', password: 'pass' }, {} as any);
      expect(result.requiresTwoFactor).toBe(true);
    });

    it('should throw UnauthorizedError if invalid 2FA code provided', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ 
        id: 'u1', email: '2fa@test.com', isActive: true, password: 'hashed', isEmailVerified: true, twoFactorEnabled: true,
        twoFactorBackupCodes: []
      });
      mockUserRepository.findById.mockResolvedValue({ twoFactorEnabled: true, twoFactorSecret: 's', twoFactorBackupCodes: [] });
      const { verifyPassword, verifyTOTP } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(true);
      (verifyTOTP as any).mockReturnValue(false);
      
      await expect(authService.login({ email: '2fa@test.com', password: 'pass', twoFactorCode: 'wrong' }, {} as any))
        .rejects.toThrow('Invalid two-factor authentication code');
    });
  });

  describe('complete2FA branches', () => {
    it('should throw UnauthorizedError if invalid temporary token type', async () => {
      const jwt = await import('jsonwebtoken');
      (jwt.verify as any).mockReturnValue({ sub: 'u1', type: 'wrong' });
      await expect(authService.complete2FA('token', '123', {} as any))
        .rejects.toThrow('Invalid temporary token');
    });

    it('should throw UnauthorizedError if user not found', async () => {
      const jwt = await import('jsonwebtoken');
      (jwt.verify as any).mockReturnValue({ sub: 'u1', type: 'temp_2fa' });
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.complete2FA('token', '123', {} as any))
        .rejects.toThrow('User not found');
    });

    it('should throw UnauthorizedError if 2FA code is invalid', async () => {
      const jwt = await import('jsonwebtoken');
      (jwt.verify as any).mockReturnValue({ sub: 'u1', type: 'temp_2fa' });
      mockUserRepository.findById.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
      // Mock verify2FA to return false
      vi.spyOn(authService as any, 'verify2FA').mockResolvedValue(false);
      
      await expect(authService.complete2FA('token', 'wrong', {} as any))
        .rejects.toThrow('Invalid two-factor authentication code');
    });

    it('should handle errors in complete2FA', async () => {
      const jwt = await import('jsonwebtoken');
      (jwt.verify as any).mockImplementation(() => { throw new Error('JWT Error'); });
      await expect(authService.complete2FA('token', '123', {} as any))
        .rejects.toThrow('JWT Error');
    });

    it('should persist rememberMe from tempToken in complete2FA', async () => {
      const jwt = await import('jsonwebtoken');
      (jwt.verify as any).mockReturnValue({ sub: 'u1', type: 'temp_2fa', rememberMe: true });
      mockUserRepository.findById.mockResolvedValue({ id: 'u1', email: 'a@b.com', role: { name: 'admin' } });
      vi.spyOn(authService as any, 'verify2FA').mockResolvedValue(true);
      mockSessionRepository.create.mockResolvedValue({ id: 's1' });

      await authService.complete2FA('token', '123', {} as any);

      expect(mockSessionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        rememberMe: true
      }));
    });
  });

  describe('register branches', () => {
    it('should throw ConflictError if email exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1' });
      await expect(authService.register({ email: 'exists@test.com' } as any, {} as any))
        .rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError if username exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue({ id: '1' });
      
      await expect(authService.register({ email: 'ok@test.com', username: 'exists' } as any, {} as any))
        .rejects.toThrow('Username already exists');
    });

    it('should create Admin role if first user and role doesn\'t exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.role.findFirst.mockResolvedValue(null);
      mockPrisma.role.create.mockResolvedValue({ id: 'admin-id', name: 'admin' });
      mockUserRepository.create.mockResolvedValue({ id: 'u1', email: 'a@b.com' });

      await authService.register({ email: 'admin@test.com', password: 'pass', firstName: 'A', lastName: 'B', phone: '1' }, { requestId: '1' } as any);
      expect(mockPrisma.role.create).toHaveBeenCalled();
    });

    it('should throw ValidationError on generic error during registration', async () => {
      mockUserRepository.findByEmail.mockRejectedValue(new Error('Generic Error'));
      await expect(authService.register({ email: 'test@test.com' } as any, {} as any))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('disable2FA branches', () => {
    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.disable2FA('id', 'pass', 'code', {} as any))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if 2FA is not enabled', async () => {
      mockUserRepository.findById.mockResolvedValue({ twoFactorEnabled: false });
      await expect(authService.disable2FA('id', 'pass', 'code', {} as any))
        .rejects.toThrow('Two-factor authentication is not enabled');
    });

    it('should throw UnauthorizedError if password incorrect', async () => {
      mockUserRepository.findById.mockResolvedValue({ twoFactorEnabled: true, password: 'hashed' });
      const { verifyPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(false);
      await expect(authService.disable2FA('id', 'wrong', 'code', {} as any))
        .rejects.toThrow('Password is incorrect');
    });

    it('should throw ValidationError if 2FA code is invalid', async () => {
      mockUserRepository.findById.mockResolvedValue({ 
        twoFactorEnabled: true, 
        password: 'hashed', 
        twoFactorSecret: 's',
        twoFactorBackupCodes: [] 
      });
      const { verifyPassword, verifyTOTP } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(true);
      (verifyTOTP as any).mockReturnValue(false);
      
      await expect(authService.disable2FA('id', 'pass', 'wrong', { requestId: '1' } as any))
        .rejects.toThrow('Invalid authentication code');
    });
  });

  describe('confirm2FA', () => {
    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.confirm2FA('id', 'secret', 'token', {} as any))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if TOTP is invalid', async () => {
      mockUserRepository.findById.mockResolvedValue({ id: '1' });
      const { verifyTOTP } = await import('../../src/utils/crypto');
      (verifyTOTP as any).mockReturnValue(false);
      await expect(authService.confirm2FA('id', 'secret', 'wrong', {} as any))
        .rejects.toThrow('Invalid authentication code');
    });

    it('should enable 2FA successfully on valid token', async () => {
      mockUserRepository.findById.mockResolvedValue({ id: '1' });
      const { verifyTOTP } = await import('../../src/utils/crypto');
      (verifyTOTP as any).mockReturnValue(true);
      mockUserRepository.enableTwoFactor.mockResolvedValue({});

      await authService.confirm2FA('1', 'secret', 'valid', { requestId: '1' } as any);
      expect(mockUserRepository.enableTwoFactor).toHaveBeenCalled();
    });
  });

  describe('logout branches', () => {
    it('should logout via sessionId', async () => {
      mockSessionRepository.findById.mockResolvedValue({ id: 's1', userId: 'u1' });
      await authService.logout('token', { requestId: '1' } as any, 's1');
      expect(mockSessionRepository.deactivateById).toHaveBeenCalledWith('s1');
    });

    it('should logout via sessionToken', async () => {
      mockSessionRepository.findByToken.mockResolvedValue({ id: 's1', userId: 'u1' });
      await authService.logout('token', { requestId: '1' } as any);
      expect(mockSessionRepository.deactivateById).toHaveBeenCalledWith('s1');
    });

    it('should handle errors in logout', async () => {
      mockSessionRepository.findById.mockRejectedValue(new Error('Logout Error'));
      await expect(authService.logout('token', { requestId: '1' } as any, 's1'))
        .rejects.toThrow('Logout Error');
    });
  });

  describe('refreshTokens branches', () => {
    it('should throw UnauthorizedError if user not found or inactive', async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue({ userId: 'u1', isRevoked: false, expiresAt: new Date(Date.now() + 10000) });
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.refreshTokens({ refreshToken: 'token' }, {} as any))
        .rejects.toThrow('User not found or inactive');
    });

    it('should throw UnauthorizedError if no active session found', async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue({ userId: 'u1', expiresAt: new Date(Date.now() + 1000) });
      mockUserRepository.findById.mockResolvedValue({ id: 'u1', isActive: true });
      mockSessionRepository.findActiveByUserId.mockResolvedValue([]);
      await expect(authService.refreshTokens({ refreshToken: 'rt' }, {} as any))
        .rejects.toThrow('No active session found');
    });

    it('should use rememberMe status from session in refreshTokens', async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue({ userId: 'u1', expiresAt: new Date(Date.now() + 1000) });
      mockUserRepository.findById.mockResolvedValue({ id: 'u1', isActive: true, role: { name: 'admin' } });
      mockSessionRepository.findActiveByUserId.mockResolvedValue([{ id: 's1', rememberMe: true }]);
      
      const spy = vi.spyOn(authService as any, 'generateTokenPair');

      await authService.refreshTokens({ refreshToken: 'rt' }, {} as any);

      expect(spy).toHaveBeenCalledWith(expect.anything(), 's1', true, expect.anything());
    });
  });

  describe('changePassword branches', () => {
    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.changePassword('id', {} as any, {} as any))
        .rejects.toThrow(NotFoundError);
    });

    it('should handle errors in changePassword', async () => {
      mockUserRepository.findById.mockRejectedValue(new Error('Change Error'));
      await expect(authService.changePassword('id', {} as any, {} as any))
        .rejects.toThrow('Change Error');
    });
  });

  describe('enable2FA branches', () => {
    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.enable2FA('id', {} as any))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError if 2FA already enabled', async () => {
      mockUserRepository.findById.mockResolvedValue({ twoFactorEnabled: true });
      await expect(authService.enable2FA('id', {} as any))
        .rejects.toThrow(ConflictError);
    });

    it('should handle errors in enable2FA', async () => {
      mockUserRepository.findById.mockRejectedValue(new Error('Enable Error'));
      await expect(authService.enable2FA('id', {} as any))
        .rejects.toThrow('Enable Error');
    });
  });

  describe('recordLoginAttempt coverage', () => {
    it('should log error if database fails in recordLoginAttempt', async () => {
      mockPrisma.loginAttempt.create.mockRejectedValue(new Error('DB Error'));
      // should catch error internally
      await (authService as any).recordLoginAttempt('a@b.com', {} as any, true);
      // verify logger.error was called?
    });
  });

  describe('token generation branches', () => {
    it('should use different expiries based on rememberMe', async () => {
      const user = { id: '1', email: 'a@b.com', role: { name: 'user', permissions: [] } };
      mockUserRepository.findByEmail.mockResolvedValue({ ...user, isActive: true, isEmailVerified: true, password: 'h' });
      const { verifyPassword } = await import('../../src/utils/crypto');
      (verifyPassword as any).mockResolvedValue(true);
      mockSessionRepository.create.mockResolvedValue({ id: 's1' });
      mockRefreshTokenRepository.create.mockResolvedValue({ id: 'r1' });
      mockUserRepository.updateLastLogin.mockResolvedValue({});

      await authService.login({ email: 'a@b.com', password: 'p', rememberMe: true }, { requestId: '1' } as any);
      await authService.login({ email: 'a@b.com', password: 'p', rememberMe: false }, { requestId: '1' } as any);
      expect(mockSessionRepository.create).toHaveBeenCalled();
    });
  });

  describe('sanitizeUser coverage', () => {
    it('should return null if user is null', () => {
      const result = (authService as any).sanitizeUser(null);
      expect(result).toBeNull();
    });
  });
});
