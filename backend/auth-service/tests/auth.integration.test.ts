import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app'; // Fallback para caminho relativo se alias falhar
import { prisma } from './setup';

describe('Auth Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Limpar DB antes de cada teste para garantir isolamento
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    
    // Seed mínimo necessário (ex: Roles)
    await prisma.role.create({
      data: {
        name: 'client',
        displayName: 'Cliente',
        permissions: ['read:me'],
        isActive: true
      }
    });
  });

  it('should register a new user successfully', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'test@integration.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '912345678'
      }
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe('test@integration.com');
    
    // Verificar se foi persistido na DB
    const dbUser = await prisma.user.findFirst({ where: { email: 'test@integration.com' } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe('test@integration.com');
  });

  it('should login successfully', async () => {
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'login@test.com',
        password: 'Password123!',
        firstName: 'Login',
        lastName: 'User',
        phone: '912345678'
      }
    });
    
    // 2. Login
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'login@test.com',
        password: 'Password123!'
      }
    });

    const body = loginResponse.json();

    // 3. Assert
    expect(loginResponse.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.tokens).toHaveProperty('accessToken');
    expect(body.data.tokens).toHaveProperty('refreshToken');
    expect(body.data.user.email).toBe('login@test.com');
  });

  describe('Error Scenarios', () => {
    it('should fail to register with duplicate email', async () => {
      // First registration
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'duplicate@test.com',
          password: 'Password123!',
          firstName: 'First',
          lastName: 'User',
          phone: '912345678'
        }
      });

      // Second registration with same email
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'duplicate@test.com',
          password: 'Password123!',
          firstName: 'Second',
          lastName: 'User',
          phone: '987654321'
        }
      });

      expect(response.statusCode).toBe(409);
      const body = response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('CONFLICT');
    });

    it('should fail to register with invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'invalid-email',
          password: '123', // too short
          firstName: '',
          lastName: '',
          phone: ''
        }
      });

      expect(response.statusCode).toBe(400);
      const body = response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail to login with wrong password', async () => {
      // Create user
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'wrongpass@test.com',
          password: 'CorrectPassword123!',
          firstName: 'User',
          lastName: 'Test',
          phone: '912345678'
        }
      });

      // Login with wrong password
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'wrongpass@test.com',
          password: 'WrongPassword!!!'
        }
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('should fail to login with non-existent user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'nonexistent@test.com',
          password: 'Password123!'
        }
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Session Management', () => {
    it('should logout successfully', async () => {
      // 1. Login to get tokens
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'test@integration.com',
          password: 'Password123!'
        }
      });
      // Need to register first because beforeEach cleans DB
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'logout@test.com',
          password: 'Password123!',
          firstName: 'Logout',
          lastName: 'User',
          phone: '912345678'
        }
      });
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'logout@test.com',
          password: 'Password123!'
        }
      });
      const { tokens } = loginRes.json().data;

      // 2. Logout
      const logoutResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/logout',
        headers: {
          authorization: `Bearer ${tokens.accessToken}`
        }
      });

      expect(logoutResponse.statusCode).toBe(200);
      expect(logoutResponse.json().success).toBe(true);

      // 3. Verify session is invalidated (attempt to use token again)
      const profileResponse = await app.inject({
        method: 'GET',
        url: '/api/v1/users/me',
        headers: {
          authorization: `Bearer ${tokens.accessToken}`
        }
      });
      // Depending on implementation, it might be 401
      expect(profileResponse.statusCode).toBe(401);
    });

    it('should refresh tokens successfully', async () => {
      // 1. Setup user and login
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'refresh@test.com',
          password: 'Password123!',
          firstName: 'Refresh',
          lastName: 'User',
          phone: '912345678'
        }
      });
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'refresh@test.com',
          password: 'Password123!'
        }
      });
      const { refreshToken } = loginRes.json().data.tokens;

      // 2. Refresh
      const refreshResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        payload: { refreshToken }
      });

      expect(refreshResponse.statusCode).toBe(200);
      const body = refreshResponse.json();
      expect(body.success).toBe(true);
      expect(body.data.tokens).toHaveProperty('accessToken');
      expect(body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail to refresh with invalid token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        payload: { refreshToken: 'invalid-token' }
      });

      expect(response.statusCode).toBe(401);
      expect(response.json().success).toBe(false);
    });
  });
});

