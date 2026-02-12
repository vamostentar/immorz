
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente do ficheiro .env na raiz (3 níveis acima de prisma/seed.ts: prisma -> auth-service -> backend -> root)
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

// Hash da password usando argon2
async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

// Configuração lida diretamente do ambiente
const config = {
  SEED_DEFAULT_ADMIN: process.env.SEED_DEFAULT_ADMIN === 'true',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Permitir seed de API KEY em produção se FORCE_SEED_API_KEY for true
  SEED_API_KEY: process.env.SEED_API_KEY === 'true',
  API_KEY_VALUE: process.env.API_KEY_VALUE,
  isDevelopment: process.env.NODE_ENV !== 'production',
};

async function main() {
  console.log('🌱 A iniciar o seeding da base de dados...');
  console.log(`📋 Ambiente: ${config.NODE_ENV}`);
  console.log(`📋 SEED_DEFAULT_ADMIN: ${config.SEED_DEFAULT_ADMIN}`);
  console.log(`📋 SEED_API_KEY: ${config.SEED_API_KEY}`);

  try {
    let adminUser: any | null = null;
    
    // --- Criar Roles (Cargos) ---
    console.log('📝 A criar/atualizar roles padrão...');

    const superAdminRole = await prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {}, // Não atualizar se já existir para preservar mudanças manuais ou manter idempotência
      create: {
        name: 'super_admin',
        displayName: 'Super Administrador',
        description: 'Acesso total ao sistema com todas as permissões',
        permissions: ['*'], // Permissão Wildcard
        isActive: true,
      },
    });

    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        displayName: 'Administrador',
        description: 'Acesso administrativo à gestão de utilizadores e sistema',
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

    const managerRole = await prisma.role.upsert({
      where: { name: 'manager' },
      update: {},
      create: {
        name: 'manager',
        displayName: 'Gestor',
        description: 'Acesso de gestão a utilizadores e funções básicas do sistema',
        permissions: [
          'users.read',
          'users.create',
          'users.update',
          'roles.read',
          'sessions.read',
          'audit_logs.read',
          'analytics.read',
        ],
        isActive: true,
      },
    });

    const operatorRole = await prisma.role.upsert({
      where: { name: 'operator' },
      update: {},
      create: {
        name: 'operator',
        displayName: 'Operador',
        description: 'Acesso operacional básico',
        permissions: [
          'users.read',
          'sessions.read',
        ],
        isActive: true,
      },
    });
    
    // Adicionar roles específicos do negócio imobiliário
    const agentRole = await prisma.role.upsert({
      where: { name: 'agent' },
      update: {},
      create: {
        name: 'agent',
        displayName: 'Agente',
        description: 'Acesso para Agentes Imobiliários',
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
        description: 'Acesso para Clientes',
        permissions: [
          'properties.read',
          'users.read_self',
        ],
        isActive: true,
      },
    });

    console.log('✅ Roles padrão criados/verificados com sucesso');


    // --- Criar Utilizador Admin Padrão ---
    if (config.SEED_DEFAULT_ADMIN) {
      if (!config.DEFAULT_ADMIN_EMAIL || !config.DEFAULT_ADMIN_PASSWORD) {
        console.warn('⚠️  SEED_DEFAULT_ADMIN está ativado mas faltam credenciais!');
        console.warn('   Defina DEFAULT_ADMIN_EMAIL e DEFAULT_ADMIN_PASSWORD nas variáveis de ambiente.');
      } else {
        console.log('👤 A criar/verificar utilizador admin padrão...');

        const hashedPassword = await hashPassword(config.DEFAULT_ADMIN_PASSWORD);

        // Verificar se o utilizador já existe para evitar re-hashing desnecessário se a password não mudou
        // Mas o upsert garante que, se não existir, cria.
        
        adminUser = await prisma.user.upsert({
          where: { email: config.DEFAULT_ADMIN_EMAIL },
          update: {
             // Opcional: Atualizar a password se as vars de ambiente mudarem?
             // Por segurança, geralmente não se atualiza a password num seed de produção para não sobrescrever
             // alterações manuais do utilizador.
             // Se necessário forçar reset, descomentar a linha abaixo:
             // password: hashedPassword 
          },
          create: {
            email: config.DEFAULT_ADMIN_EMAIL,
            firstName: 'Sistema',
            lastName: 'Administrador',
            password: hashedPassword,
            isActive: true,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            roleId: superAdminRole.id,
          },
        });

        console.log(`✅ Utilizador admin padrão verificado: ${adminUser.email}`);
        if(adminUser.createdAt.getTime() === adminUser.updatedAt.getTime()){
             console.log('⚠️  IMPORTANTE: Altere a password padrão após o primeiro login!');
        }
      }
    } else {
      console.log('ℹ️  Seed de Admin desativado (SEED_DEFAULT_ADMIN não está definido como true)');
    }


    // --- Criar Configurações de Auth Padrão ---
    console.log('⚙️ A criar/verificar configurações de autenticação...');

    await prisma.authSettings.upsert({
      where: { id: 'singleton' },
      update: {}, // Manter configurações existentes se já houver
      create: {
        id: 'singleton',
        passwordMinLength: 8,
        passwordRequireUpper: true,
        passwordRequireLower: true,
        passwordRequireNumber: true,
        passwordRequireSymbol: false,
        passwordHistoryCount: 5,
        maxLoginAttempts: 5,
        lockoutDuration: 900, // 15 minutos
        lockoutWindow: 300,   // 5 minutos
        sessionTimeout: 86400, // 24 horas
        maxConcurrentSessions: 5,
        jwtAccessExpiry: 3600,   // 1 hora
        jwtRefreshExpiry: 604800, // 7 dias
        twoFactorRequired: false,
        twoFactorGracePeriod: 86400, // 24 horas
        emailVerificationRequired: true,
        emailVerificationExpiry: 86400, // 24 horas
        passwordResetExpiry: 3600, // 1 hora
      },
    });
    console.log('✅ Configurações de autenticação verificadas com sucesso');


    // --- Criar API Key (Dev ou Prod via Env) ---
    // Em produção, só criamos se SEED_API_KEY for true E tivermos um valor definido
    if (config.isDevelopment || (config.SEED_API_KEY && config.API_KEY_VALUE)) {
      console.log('🔑 A configurar API Key...');

      // Valor da chave: ou vem do ambiente (Prod/CI) ou usa o default de dev
      // Nota: Em produção, API_KEY_VALUE deve ser definido, caso contrário usa o fallback inseguro (apenas se SEED_API_KEY=true)
      const apiKeyValue = config.API_KEY_VALUE;
      
      if (!apiKeyValue) {
        throw new Error('API_KEY_VALUE environment variable is required when SEED_API_KEY is true in production');
      }

      // Hash da chave
      const keyHash = crypto.createHash('sha256').update(apiKeyValue).digest('hex');

      const apiKeyName = config.isDevelopment ? 'Chave de Desenvolvimento' : 'Chave de Sistema (Seed)';

      await prisma.apiKey.upsert({
        where: { keyHash },
        update: {}, // Não alterar se já existe
        create: {
          name: apiKeyName,
          keyHash,
          keyPreview: `${apiKeyValue.substring(0, 8)}...`,
          permissions: ['users.read', 'roles.read', 'system.internal'], // Adicionada key system.internal se necessário
          scopes: ['read:users', 'read:roles'],
          isActive: true,
          createdBy: adminUser?.id, // Pode ser null se o admin não foi criado, o que é permitido no schema se opcional
        },
      });

      console.log('✅ API Key criada/verificada com sucesso');
      if (config.isDevelopment) {
         console.log(`🔑 Valor da Chave (Dev): ${apiKeyValue}`);
      } else {
         console.log(`🔑 Valor da Chave (Prod): [OCULTADO] (Verifique a variável de ambiente API_KEY_VALUE)`);
      }
    }

    console.log('🎉 Seeding da base de dados concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o seeding da base de dados:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Falha crítica no seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
