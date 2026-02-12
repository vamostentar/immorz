import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from './setup';

describe('Password Management Integration Tests', () => {
  let app: any;
  let accessToken: string;
  const testUser = {
    email: 'pass-test@test.com',
    password: 'OldPassword123!',
    newPassword: 'NewPassword123!',
    firstName: 'Pass',
    lastName: 'Tester',
    phone: '912345678'
  };

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
    
    // Setup clean state
    await prisma.session.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.passwordReset.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    
    await prisma.role.create({
      data: {
        name: 'client',
        displayName: 'Cliente',
        permissions: ['read:me'],
        isActive: true
      }
    });

    // Register user
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phone: testUser.phone
      }
    });

    // Login for access token
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testUser.email,
        password: testUser.password
      }
    });
    if (loginRes.statusCode !== 200) {
      console.error('Password Test Login Failure:', JSON.stringify(loginRes.json(), null, 2));
    }
    accessToken = loginRes.json().data?.tokens?.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Change Password (Authenticated)', () => {
    it('should change password successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/change-password',
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          currentPassword: testUser.password,
          newPassword: testUser.newPassword,
          confirmPassword: testUser.newPassword
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().success).toBe(true);

      // Verify login with new password
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: testUser.email,
          password: testUser.newPassword
        }
      });
      expect(loginRes.statusCode).toBe(200);
    });
  });

  describe('Password Recovery (Forgot/Reset)', () => {
    let resetToken: string;

    it('should process forgot password request', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/forgot-password',
        payload: {
          email: testUser.email
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().success).toBe(true);

      // Find token in PasswordReset table
      const reset = await prisma.passwordReset.findFirst({
        where: { email: testUser.email },
        orderBy: { createdAt: 'desc' }
      });
      resetToken = reset?.token || '';
      expect(resetToken).toBeTruthy();
    });

    it('should reset password with valid token', async () => {
      const finalPassword = 'FinalPassword123!';
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/reset-password',
        payload: {
          token: resetToken,
          password: finalPassword,
          confirmPassword: finalPassword
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().success).toBe(true);

      // Verify login with final password
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: testUser.email,
          password: finalPassword
        }
      });
      expect(loginRes.statusCode).toBe(200);
    });
  });
});
