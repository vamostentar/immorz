import { createApp } from './app.js';
import { config } from './config/config.js';

import { initializeDependencies } from './config/dependency-config.js';
import { AnalyticsDatabase } from './implementations/prisma-database.js';
import { AggregationService } from './services/aggregation-service.js';

/**
 * Inicializa o servidor Fastify e as suas dependências
 */
async function start() {
  try {
    // 1. Inicializar Base de Dados
    const database = new AnalyticsDatabase({
      url: config.DATABASE_URL,
      log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    });
    await database.connect();
    console.log('📦 Ligação à base de dados de Analytics estabelecida.');

    // 2. Inicializar Serviços e Injeção de Dependências
    const aggregationService = new AggregationService(database.analytics);
    
    initializeDependencies({
      database,
      aggregationService
    });

    // 3. Criar e iniciar aplicação
    const app = await createApp();
    
    await app.listen({ 
      port: config.PORT, 
      host: config.HOST 
    });

    console.log(`🚀 Microserviço de Analytics a correr em http://${config.HOST}:${config.PORT}`);
    console.log(`📊 Ambiente: ${config.NODE_ENV}`);

    // 4. Executar primeiro ciclo de agregação para popular dados (em background)
    aggregationService.runAggregationCycle();

  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}

// Lançar a aplicação
start();
