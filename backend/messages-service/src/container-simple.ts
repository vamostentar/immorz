import { CacheService } from '@/services/cache.service';
import { CircuitBreakerService } from '@/services/circuit-breaker.service';
import { EmailService } from '@/services/email.service';
import { HealthService } from '@/services/health.service';
import { ImapService } from '@/services/imap.service';
import { ConversationService, EmailReplyService, MessageCoreService, MessageStatsService } from '@/services/message';
import { MessageService } from '@/services/message.service';
import { MetricsService } from '@/services/metrics.service';
import { config, configService } from '@/utils/config';
import { logger } from '@/utils/logger';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

// Simple container without awilix
export class SimpleContainer {
  private _prisma?: PrismaClient;
  private _redis?: Redis;
  private _messageService?: MessageService;
  private _emailService?: EmailService;
  private _metricsService?: MetricsService;
  private _healthService?: HealthService;
  private _cacheService?: CacheService;
  private _circuitBreakerService?: CircuitBreakerService;
  private _imapService?: ImapService;
  
  // Message Sub-services
  private _messageCore?: MessageCoreService;
  private _conversation?: ConversationService;
  private _emailReply?: EmailReplyService;
  private _stats?: MessageStatsService;

  get prisma(): PrismaClient {
    if (!this._prisma) {
      this._prisma = new PrismaClient({
        datasources: {
          db: {
            url: config.DATABASE_URL,
          },
        },
        log: configService.isDevelopment ? ['query', 'info', 'warn', 'error'] : ['error'],
      });

      // Conexão lazy (automática no primeiro pedido) é mais segura para o arranque
      // Evita crash se a DB demorar a responder
      // this._prisma.$connect().catch((error) => {
      //   logger.error('Failed to connect to database', { error: error.message });
      //   // process.exit(1); 
      // });
    }
    return this._prisma;
  }

  get redis(): Redis | undefined {
    if (!config.REDIS_URL) return undefined;

    if (!this._redis) {
      this._redis = new Redis(config.REDIS_URL, {
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,
        maxRetriesPerRequest: config.REDIS_MAX_RETRIES,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      this._redis.on('error', (error) => {
        logger.error('Redis connection error', { error: error.message });
      });

      this._redis.on('connect', () => {
        logger.info('Redis connected successfully');
      });
    }
    return this._redis;
  }

  get metricsService(): MetricsService {
    if (!this._metricsService) {
      this._metricsService = new MetricsService();
    }
    return this._metricsService;
  }

  get circuitBreakerService(): CircuitBreakerService {
    if (!this._circuitBreakerService) {
      this._circuitBreakerService = new CircuitBreakerService();
    }
    return this._circuitBreakerService;
  }

  get cacheService(): CacheService {
    if (!this._cacheService) {
      this._cacheService = new CacheService(this.redis);
    }
    return this._cacheService;
  }

  get emailService(): EmailService {
    if (!this._emailService) {
      logger.info('Initializing EmailService...');
      try {
        this._emailService = new EmailService(
          this.metricsService,
          this.circuitBreakerService
        );
        logger.info('EmailService initialized successfully');
      } catch (error: any) {
        logger.error('Failed to initialize EmailService', { error: error.message });
        throw error;
      }
    }
    return this._emailService;
  }

  get imapService(): ImapService {
    if (!this._imapService) {
      logger.info('Initializing ImapService...');
      try {
        this._imapService = new ImapService(
          this.prisma,
          this.metricsService,
          this.circuitBreakerService,
          this.messageService // Injected to enable advanced processing (threading + auto-delete)
        );
        logger.info('ImapService initialized successfully with MessageService');
      } catch (error: any) {
        logger.error('Failed to initialize ImapService', { error: error.message });
        throw error;
      }
    }
    return this._imapService;
  }

  get messageCore(): MessageCoreService {
    if (!this._messageCore) {
      this._messageCore = new MessageCoreService(
        this.prisma,
        this.metricsService,
        this.cacheService,
        this.emailService
      );
    }
    return this._messageCore;
  }

  get conversation(): ConversationService {
    if (!this._conversation) {
      this._conversation = new ConversationService(this.prisma);
    }
    return this._conversation;
  }

  get emailReply(): EmailReplyService {
    if (!this._emailReply) {
      this._emailReply = new EmailReplyService(
        this.prisma,
        this.emailService,
        this.metricsService,
        this.messageCore
      );
    }
    return this._emailReply;
  }

  get stats(): MessageStatsService {
    if (!this._stats) {
      this._stats = new MessageStatsService(
        this.prisma,
        this.cacheService,
        this.metricsService,
        this.messageCore
      );
    }
    return this._stats;
  }

  get messageService(): MessageService {
    if (!this._messageService) {
      this._messageService = new MessageService(
        this.messageCore,
        this.conversation,
        this.emailReply,
        this.stats
      );
    }
    return this._messageService;
  }

  get healthService(): HealthService {
    if (!this._healthService) {
      this._healthService = new HealthService(
        this.prisma,
        this.emailService,
        this.circuitBreakerService,
        this.redis
      );
    }
    return this._healthService;
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down container...');

    try {
      // Stop IMAP service
      if (this._imapService) {
        logger.info('Stopping IMAP service...');
        await this._imapService.stop();
      }

      // Close Redis connection
      if (this._redis) {
        logger.info('Closing Redis connection...');
        this._redis.disconnect();
      }

      // Close Prisma connection
      if (this._prisma) {
        logger.info('Closing database connection...');
        await this._prisma.$disconnect();
      }

      logger.info('Container shutdown complete');
    } catch (error: any) {
      logger.error('Error during container shutdown', { error: error.message });
      throw error;
    }
  }
}

export const container = new SimpleContainer();

export async function shutdownContainer(): Promise<void> {
  return container.shutdown();
}

