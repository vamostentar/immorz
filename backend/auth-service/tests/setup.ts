import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { afterAll, afterEach, beforeAll } from 'vitest';

// Carregar variáveis de ambiente de teste
const envPath = path.resolve(__dirname, '../../../../.env');
const result = dotenv.config({ path: envPath });

console.log('📝 Carregando .env de:', envPath);

if (!process.env.DATABASE_URL) {
    // Fallback temporário para dev local/testes se o ficheiro não for lido corretamente
    process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:Zk5q9bP2yN4r7Qe1G8mX4vL2sT6uA9cD1wH3kJ7nR5pV8yC6dE2fB4tM6qR8xZ2@localhost:5432/ribeirazul_test?schema=auth";
} else {
    console.log('✅ DATABASE_URL carregada.');
}

// Configurar variáveis obrigatórias para o ConfigService (Zod Schema)
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-must-be-at-least-32-characters-long-for-zod-validation';
process.env.NODE_ENV = 'test';
process.env.PORT = '8084';
process.env.CORS_ORIGIN = 'http://localhost:3000';


const prisma = new PrismaClient();

beforeAll(async () => {
  // Lógica para conectar à DB
  console.log('🚀 Iniciando ambiente de testes...');
  try {
      await prisma.$connect();
  } catch (error) {
      console.error('Erro ao conectar ao Prisma nos testes:', error);
  }
});

afterEach(async () => {
    // Limpar dados após cada teste OU garantir que cada teste usa dados únicos?
    // Para testes de integração reais, geralmente limpamos tabelas específicas.
    // Exemplo: await prisma.user.deleteMany({ where: { email: { contains: 'test' } } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };

