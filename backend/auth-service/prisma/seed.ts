import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Hash password using argon2 (same as crypto.ts)
async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

// Read config directly from environment
const config = {
  SEED_DEFAULT_ADMIN: process.env.SEED_DEFAULT_ADMIN === 'true',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
};

async function main() {
  console.log('🌱 Starting database seeding...');
  console.log(`📋 Environment: ${config.NODE_ENV}`);
  console.log(`📋 SEED_DEFAULT_ADMIN: ${config.SEED_DEFAULT_ADMIN}`);
  console.log(`📋 DEFAULT_ADMIN_EMAIL: ${config.DEFAULT_ADMIN_EMAIL || '(not set)'}`);

  try {
    let adminUser: any | null = null;
    // Create default roles
    console.log('📝 Creating default roles...');

    const superAdminRole = await prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {},
      create: {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full system access with all permissions',
        permissions: ['*'], // Wildcard permission
        isActive: true,
      },
    });

    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Administrative access to user and system management',
        permissions: [
          'users.read',
          'users.create',
          'users.update',
          'users.activate',
          'users.deactivate',
          'roles.read',
          'roles.create',
          'roles.update',
          'sessions.read',
          'sessions.terminate',
          'sessions.manage_all',
          'audit_logs.read',
          'settings.read',
          'settings.update',
          'analytics.read',
          'system.health.read',
        ],
        isActive: true,
      },
    });

    const agentRole = await prisma.role.upsert({
      where: { name: 'agent' },
      update: {},
      create: {
        name: 'agent',
        displayName: 'Agente',
        description: 'Imobiliário Agent access',
        permissions: [
          'users.read',
          'users.create',
          'users.update',
          'properties.read',
          'properties.create',
          'properties.update',
          'roles.read',
        ],
        isActive: true,
      },
    });

    const clientRole = await prisma.role.upsert({
      where: { name: 'client' },
      update: {},
      create: {
        name: 'client',
        displayName: 'Cliente',
        description: 'Client access',
        permissions: [
          'properties.read',
          'users.read_self',
        ],
        isActive: true,
      },
    });

    console.log('✅ Default roles created successfully');

    // Create default admin user if enabled
    if (config.SEED_DEFAULT_ADMIN) {
      if (!config.DEFAULT_ADMIN_EMAIL || !config.DEFAULT_ADMIN_PASSWORD) {
        console.warn('⚠️  SEED_DEFAULT_ADMIN está activado mas faltam credenciais!');
        console.warn('   Defina DEFAULT_ADMIN_EMAIL e DEFAULT_ADMIN_PASSWORD nas variáveis de ambiente.');
      } else {
        console.log('👤 Creating default admin user...');

        const hashedPassword = await hashPassword(config.DEFAULT_ADMIN_PASSWORD);

        adminUser = await prisma.user.upsert({
          where: { email: config.DEFAULT_ADMIN_EMAIL },
          update: {},
          create: {
            email: config.DEFAULT_ADMIN_EMAIL,
            firstName: 'System',
            lastName: 'Administrator',
            password: hashedPassword,
            isActive: true,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            roleId: superAdminRole.id,
          },
        });

        console.log(`✅ Default admin user created: ${adminUser.email}`);
        console.log('⚠️  IMPORTANT: Change the default password after first login!');
      }
    } else {
      console.log('ℹ️  Admin seed desactivado (SEED_DEFAULT_ADMIN não está definido como true)');
    }

    // Create default auth settings
    console.log('⚙️ Creating default auth settings...');

    await prisma.authSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
        passwordMinLength: 8,
        passwordRequireUpper: true,
        passwordRequireLower: true,
        passwordRequireNumber: true,
        passwordRequireSymbol: false,
        passwordHistoryCount: 5,
        maxLoginAttempts: 5,
        lockoutDuration: 900, // 15 minutes
        lockoutWindow: 300,   // 5 minutes
        sessionTimeout: 86400, // 24 hours
        maxConcurrentSessions: 5,
        jwtAccessExpiry: 3600,   // 1 hour
        jwtRefreshExpiry: 604800, // 7 days
        twoFactorRequired: false,
        twoFactorGracePeriod: 86400, // 24 hours
        emailVerificationRequired: true,
        emailVerificationExpiry: 86400, // 24 hours
        passwordResetExpiry: 3600, // 1 hour
      },
    });

    console.log('✅ Default auth settings created successfully');

    // Create sample API key for testing (development only)
    if (config.isDevelopment) {
      console.log('🔑 Creating sample API key for development...');

      const crypto = require('crypto');
      const apiKeyValue = 'rz_dev_sample_key_12345678901234567890123456789012';
      const keyHash = crypto.createHash('sha256').update(apiKeyValue).digest('hex');

      await prisma.apiKey.upsert({
        where: { keyHash },
        update: {},
        create: {
          name: 'Development Sample Key',
          keyHash,
          keyPreview: 'rz_dev_s...',
          permissions: ['users.read', 'roles.read'],
          scopes: ['read:users', 'read:roles'],
          isActive: true,
          createdBy: adminUser?.id,
        },
      });

      console.log('✅ Sample API key created for development');
      console.log(`🔑 API Key: ${apiKeyValue}`);
      console.log('⚠️  This key is for development only!');
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
