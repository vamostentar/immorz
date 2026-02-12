import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from './setup';

describe('User CRUD Integration Tests', () => {
  let app: any;
  let adminToken: string;
  let clientToken: string;
  let targetUserId: string;

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
    
    // Setup clean state
    await prisma.session.deleteMany();
    await prisma.refreshToken.deleteMany();
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

    const clientRole = await prisma.role.create({
      data: {
        name: 'client',
        displayName: 'Cliente',
        permissions: ['read:me'],
        isActive: true
      }
    });

    // Create Admin
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'admin-crud@test.com',
        password: 'Password123!',
        firstName: 'Admin',
        lastName: 'Crud',
        roleId: adminRole.id,
        phone: '912345678'
      }
    });

    // Create Client
    const clientRegRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'client-crud@test.com',
        password: 'Password123!',
        firstName: 'Client',
        lastName: 'Crud',
        phone: '912345679'
      }
    });
    targetUserId = clientRegRes.json().data.user.id;

    // Login Admin
    const adminLoginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin-crud@test.com',
        password: 'Password123!'
      }
    });
    adminToken = adminLoginRes.json().data?.tokens?.accessToken;

    // Login Client
    const clientLoginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'client-crud@test.com',
        password: 'Password123!'
      }
    });
    clientToken = clientLoginRes.json().data?.tokens?.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/users', () => {
    it('should allow admin to list users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users/',
        headers: {
          authorization: `Bearer ${adminToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().data).toBeInstanceOf(Array);
      expect(response.json().data.length).toBeGreaterThanOrEqual(2);
    });

    it('should deny client listing users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users/',
        headers: {
          authorization: `Bearer ${clientToken}`
        }
      });

      expect([401, 403]).toContain(response.statusCode);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should allow admin to get any user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/users/${targetUserId}`,
        headers: {
          authorization: `Bearer ${adminToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().data.id).toBe(targetUserId);
    });
  });

  describe('PUT /api/v1/users/:userId', () => {
    it('should allow admin to update user', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/v1/users/${targetUserId}`,
        headers: {
          authorization: `Bearer ${adminToken}`
        },
        payload: {
          firstName: 'UpdatedName'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().data.firstName).toBe('UpdatedName');
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    it('should allow admin to delete user', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/users/${targetUserId}`,
        headers: {
          authorization: `Bearer ${adminToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      
      // Verify deletion
      const checkRes = await app.inject({
        method: 'GET',
        url: `/api/v1/users/${targetUserId}`,
        headers: {
          authorization: `Bearer ${adminToken}`
        }
      });
      expect(checkRes.statusCode).toBe(404);
    });
  });
});
