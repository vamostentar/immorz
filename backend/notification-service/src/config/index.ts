import 'dotenv/config';

export const config = {
  // Server
  port: parseInt(process.env.PORT || '8087', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  
  // SMTP
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@ribeirazul.com',
    fromName: process.env.SMTP_FROM_NAME || 'Ribeirazul Imobiliária',
  },
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  
  // Internal Services
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
    properties: process.env.PROPERTIES_SERVICE_URL || 'http://localhost:8082',
  },
};

export default config;
