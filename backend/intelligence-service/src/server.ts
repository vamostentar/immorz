import { createApp } from './app.js';
import { config } from './config/config.js';

async function start() {
  try {
    const app = await createApp();
    
    await app.listen({
      port: config.PORT,
      host: config.HOST
    });

    console.log(`🚀 Intelligence Service listening on ${config.HOST}:${config.PORT}`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

start();
