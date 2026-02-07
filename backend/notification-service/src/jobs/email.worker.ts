import { config } from '@/config';
import { EmailOptions, EmailService } from '@/services/email.service';
import { logger } from '@/utils/logger';
import { Queue, Worker } from 'bullmq';

const QUEUE_NAME = 'email-queue';

// Create queue
export const emailQueue = new Queue(QUEUE_NAME, {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

// Job types
export interface EmailJob {
  type: 'send';
  payload: EmailOptions;
  notificationId?: string;
}

/**
 * Add email job to queue
 */
export async function queueEmail(options: EmailOptions, notificationId?: string) {
  const job = await emailQueue.add('send-email', {
    type: 'send',
    payload: options,
    notificationId,
  } as EmailJob);

  logger.debug({ jobId: job.id, to: options.to }, 'Email job queued');
  return job;
}

/**
 * Create email worker
 */
export function createEmailWorker(emailService: EmailService) {
  const worker = new Worker<EmailJob>(
    QUEUE_NAME,
    async (job) => {
      logger.info({ jobId: job.id, type: job.data.type }, 'Processing email job');

      try {
        await emailService.send(job.data.payload);
        logger.info({ jobId: job.id }, 'Email sent successfully');
        return { success: true };
      } catch (error) {
        logger.error({ jobId: job.id, error }, 'Email job failed');
        throw error;
      }
    },
    {
      connection: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    logger.debug({ jobId: job.id }, 'Email job completed');
  });

  worker.on('failed', (job, error) => {
    logger.error({ jobId: job?.id, error: error.message }, 'Email job failed');
  });

  return worker;
}
