import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from './setup';

describe('Robustness & Final Coverage Integration Tests', () => {
  let app: any;
  let adminToken: string;
  let adminUserId: string;

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
    
    // Clean start
    await prisma.session.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.passwordReset.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    
    const adminRole = await prisma.role.create({
      data: {
        name: 'super_admin',
        displayName: 'Super Admin',
        permissions: ['*'],
        isActive: true
      }
    });

    await prisma.role.create({
      data: {
        name: 'client',
        displayName: 'Cliente',
        permissions: ['read:me'],
        isActive: true
      }
    });

    // Create Admin
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'robust-admin@test.com',
        password: 'Password123!',
        firstName: 'Robust',
        lastName: 'Admin',
        phone: '912345678'
      }
    });
    adminUserId = regRes.json().data.user.id;

    // Login Admin
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'robust-admin@test.com',
        password: 'Password123!'
      }
    });
    adminToken = loginRes.json().data.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Service Robustness', { timeout: 15000 }, () => {
    it('should fail to create user with short password (schema validation)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/users/',
        headers: { authorization: `Bearer ${adminToken}` },
        payload: {
          email: 'short-pass@test.com',
          password: '123',
          firstName: 'Short',
          lastName: 'Pass',
          phone: '912345671'
        }
      });
      expect(response.statusCode).toBe(400); // Fastify schema validation
    });

    it('should handle multiple password reset requests', async () => {
      // Multiple requests for same email
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/forgot-password',
        payload: { email: 'robust-admin@test.com' }
      });
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/forgot-password',
        payload: { email: 'robust-admin@test.com' }
      });

      const resetCount = await prisma.passwordReset.count({
        where: { email: 'robust-admin@test.com', isUsed: false }
      });
      expect(resetCount).toBeGreaterThanOrEqual(1);
    });

    it('should fail to change password with wrong current password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/change-password',
        headers: { authorization: `Bearer ${adminToken}` },
        payload: {
          currentPassword: 'WrongPassword!',
          newPassword: 'NewPass123!',
          confirmPassword: 'NewPass123!'
        }
      });
      expect(response.statusCode).toBe(401);
    });

    it('should fail to register with missing required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'missing@test.com'
          // firstName, lastName, phone, password missing
        }
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
