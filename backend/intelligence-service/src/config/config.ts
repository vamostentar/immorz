import dotenv from 'dotenv';
import path from 'path';

// Carregar .env da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.INTELLIGENCE_PORT || '8088', 10),
  HOST: process.env.HOST || '0.0.0.0',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  
  // AI Config
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Scraping Config
  PROXY_URL: process.env.PROXY_URL,
  BROWSER_HEADLESS: process.env.BROWSER_HEADLESS !== 'false',
  
  // Internal Service discovery
  PROPERTIES_SERVICE_URL: process.env.PROPERTIES_SERVICE_URL || 'http://properties:8082',
};

// Validação básica
if (!config.OPENAI_API_KEY && config.NODE_ENV === 'production') {
  console.error('❌ CRITICAL: OPENAI_API_KEY is not defined!');
}
