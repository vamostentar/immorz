import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from './setup';

describe('2FA Integration Tests', () => {
  let app: any;
  let accessToken: string;
  let twoFactorSecret: string;
  const testUser = {
    email: '2fa-flow@test.com',
    password: 'Password123!',
    firstName: 'TwoFactor',
    lastName: 'User',
    phone: '912345678'
  };

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // We only clear once at the start of this block to allow the flow
  beforeAll(async () => {
    await prisma.session.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    
    // Seed role manually as in auth.integration.test.ts
    await prisma.role.create({
      data: {
        name: 'client',
        displayName: 'Cliente',
        permissions: ['read:me'],
        isActive: true
      }
    });

    // Setup user for the whole flow
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: testUser
    });
    
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testUser.email,
        password: testUser.password
      }
    });
    accessToken = loginRes.json().data.tokens.accessToken;
  });

  it('should flow through 2FA setup and login', async () => {
    // 1. Initiate 2FA
    const enableRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/2fa/enable',
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    expect(enableRes.statusCode).toBe(200);
    twoFactorSecret = enableRes.json().data.secret;

    // 2. Confirm 2FA
    const speakeasy = await import('speakeasy');
    const confirmToken = speakeasy.totp({
      secret: twoFactorSecret,
      encoding: 'base32'
    });
    const confirmRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/2fa/confirm',
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: {
        secret: twoFactorSecret,
        token: confirmToken
      }
    });
    expect(confirmRes.statusCode).toBe(200);

    // 3. Login with 2FA required
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(loginRes.statusCode).toBe(200);
    const { tempToken } = loginRes.json().data;
    expect(loginRes.json().data.requiresTwoFactor).toBe(true);

    // 4. Complete login
    const loginToken = speakeasy.totp({
      secret: twoFactorSecret,
      encoding: 'base32'
    });
    const completeRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/2fa/complete',
      payload: {
        tempToken,
        code: loginToken
      }
    });
    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.json().data.tokens).toHaveProperty('accessToken');

    // 5. Disable 2FA
    const disableToken = speakeasy.totp({
      secret: twoFactorSecret,
      encoding: 'base32'
    });
    const disableRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/2fa/disable',
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: {
        password: testUser.password,
        token: disableToken
      }
    });
    expect(disableRes.statusCode).toBe(200);
  });
});
