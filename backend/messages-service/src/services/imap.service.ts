import { config } from '@/utils/config';
import { createLogger } from '@/utils/logger';
import { PrismaClient } from '@prisma/client';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { CircuitBreakerService } from './circuit-breaker.service';
import { MessageService } from './message.service';
import { MetricsService } from './metrics.service';

export class ImapService {
  private client?: ImapFlow;
  private isRunning = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private pollInterval?: NodeJS.Timeout;
  private logger = createLogger({ service: 'ImapService' });
  private circuitBreaker: any;

  constructor(
    private prisma: PrismaClient,
    private metricsService: MetricsService,
    private circuitBreakerService: CircuitBreakerService,
    private messageService?: MessageService
  ) {
    this.initializeCircuitBreaker();
  }

  private initializeCircuitBreaker(): void {
    this.circuitBreaker = this.circuitBreakerService.createCircuitBreaker(
      'imap-service',
      this.connectAndPoll.bind(this),
      {
        timeout: 30000,
        errorThresholdPercentage: 70,
        resetTimeout: 60000,
        onOpen: () => {
          this.logger.circuitBreaker('imap-service', 'open');
          this.metricsService.incrementCounter('imap_circuit_breaker_open_total');
        },
        onHalfOpen: () => {
          this.logger.circuitBreaker('imap-service', 'half-open');
          this.metricsService.incrementCounter('imap_circuit_breaker_half_open_total');
        },
        onClose: () => {
          this.logger.circuitBreaker('imap-service', 'closed');
          this.metricsService.incrementCounter('imap_circuit_breaker_close_total');
        },
      }
    );
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('IMAP service is already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('Starting IMAP service', {
      host: config.IMAP_HOST,
      port: config.IMAP_PORT,
      secure: config.IMAP_SECURE,
      pollInterval: config.IMAP_POLL_INTERVAL,
    });

    try {
      await this.circuitBreaker.fire();
    } catch (error: any) {
      this.logger.error('Failed to start IMAP service', {
        error: error.message,
      });
      this.isRunning = false;
      throw error;
    }
  }

  private async connectAndPoll(): Promise<void> {
    try {
      await this.connect();
      this.startPolling();
    } catch (error: any) {
      this.logger.error('IMAP connection failed', {
        error: error.message,
        reconnectAttempts: this.reconnectAttempts,
      });

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        this.logger.info('Retrying IMAP connection', {
          attempt: this.reconnectAttempts,
          delay,
        });

        setTimeout(() => {
          if (this.isRunning) {
            this.connectAndPoll().catch(() => {
              // Error already logged in connectAndPoll
            });
          }
        }, delay);
      } else {
        this.logger.error('Max IMAP reconnection attempts reached, giving up');
        this.isRunning = false;
        throw error;
      }
    }
  }

  private async connect(): Promise<void> {
    const startTime = Date.now();

    try {
      this.client = new ImapFlow({
        host: config.IMAP_HOST,
        port: config.IMAP_PORT,
        secure: config.IMAP_SECURE,
        auth: {
          user: config.IMAP_USER,
          pass: config.IMAP_PASS,
        },
        logger: false, // Disable ImapFlow logging to avoid conflicts
      });

      // Set up event handlers
      this.client.on('error', (error) => {
        this.logger.error('IMAP client error', {
          error: error.message,
        });
        this.metricsService.incrementCounter('imap_errors_total');
      });

      this.client.on('close', () => {
        this.logger.warn('IMAP connection closed');
        this.metricsService.incrementCounter('imap_disconnections_total');

        // Attempt to reconnect if service is still running
        if (this.isRunning) {
          setTimeout(() => {
            if (this.isRunning) {
              this.connectAndPoll().catch(() => {
                // Error already logged
              });
            }
          }, 5000);
        }
      });

      await this.client.connect();

      const mailbox = await this.client.mailboxOpen('INBOX');

      const duration = Date.now() - startTime;
      this.logger.info('IMAP connected successfully', {
        mailbox: mailbox.path,
        exists: mailbox.exists,
        duration,
      });

      this.metricsService.incrementCounter('imap_connections_total');
      this.metricsService.recordHistogram('imap_connection_duration_ms', duration);

      // Reset reconnection attempts on successful connection
      this.reconnectAttempts = 0;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error('IMAP connection failed', {
        error: error.message,
        duration,
        host: config.IMAP_HOST,
        port: config.IMAP_PORT,
      });

      this.metricsService.incrementCounter('imap_connection_failures_total');
      throw error;
    }
  }

  private startPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }

    this.logger.info('Starting IMAP polling', {
      interval: config.IMAP_POLL_INTERVAL,
    });

    this.pollInterval = setInterval(async () => {
      if (this.isRunning && this.client) {
        try {
          await this.pollForNewMessages();
        } catch (error: any) {
          this.logger.error('IMAP polling error', {
            error: error.message,
          });
          this.metricsService.incrementCounter('imap_polling_errors_total');
        }
      }
    }, config.IMAP_POLL_INTERVAL);
  }

  private async pollForNewMessages(): Promise<void> {
    if (!this.client) {
      throw new Error('IMAP client not connected');
    }

    const startTime = Date.now();

    try {
      const lock = await this.client.getMailboxLock('INBOX');

      try {
        // Search for unseen messages
        const messages = await this.client.search({ seen: false });

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          this.logger.debug('No new messages found');
          return;
        }

        this.logger.info('Processing new messages', {
          count: messages.length,
        });

        let processedCount = 0;
        let errorCount = 0;

        for (const uid of messages) {
          try {
            await this.processMessage(uid);
            processedCount++;
          } catch (error: any) {
            this.logger.error('Failed to process message', {
              error: error.message,
              uid,
            });
            errorCount++;
          }
        }

        const duration = Date.now() - startTime;
        this.logger.info('IMAP polling completed', {
          totalMessages: messages.length,
          processed: processedCount,
          errors: errorCount,
          duration,
        });

        this.metricsService.incrementCounter('imap_messages_processed_total', processedCount);
        this.metricsService.incrementCounter('imap_message_errors_total', errorCount);
        this.metricsService.recordHistogram('imap_polling_duration_ms', duration);
      } finally {
        lock.release();
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error('IMAP polling failed', {
        error: error.message,
        duration,
      });
      throw error;
    }
  }

  private async processMessage(uid: number): Promise<void> {
    if (!this.client) {
      throw new Error('IMAP client not connected');
    }

    const startTime = Date.now();

    try {
      // Fetch full RFC822 source for robust parsing
      const result = await this.client.fetchOne(uid, { source: true });

      if (!result || !result.source) {
        throw new Error('Failed to fetch message source');
      }

      // Parse full email using mailparser
      const parsed = await simpleParser(result.source);
      
      const from = parsed.from?.value[0];
      const subject = parsed.subject || 'Sem Assunto';
      const body = parsed.text || ''; // Prefer text version
      const messageId = parsed.messageId;
      const inReplyTo = parsed.inReplyTo;

      if (!from?.address) {
        throw new Error('Message has no sender address');
      }

      // Skip emails sent by our own system to prevent duplicates
      const { config } = await import('@/utils/config');
      const systemEmails = [config.EMAIL_FROM, config.SMTP_USER].map(e => e.toLowerCase());
      if (systemEmails.includes(from.address.toLowerCase())) {
        this.logger.info('Skipping system-generated email', {
          from: from.address,
          subject,
          uid,
        });
        // Mark as seen but don't save to database
        await this.client.messageFlagsAdd(uid, ['\\Seen']);
        return;
      }

      // Try to find existing conversation using MessageService
      let conversationId: string | null = null;
      
      if (this.messageService) {
        // 1. Try In-Reply-To header first
        if (inReplyTo) {
          conversationId = await this.messageService.findConversationByEmailMessageId(inReplyTo);
          if (conversationId) {
            this.logger.debug('Found conversation via In-Reply-To', { inReplyTo, conversationId });
          }
        }

        // 2. Fallback: find latest conversation with this email
        if (!conversationId) {
          conversationId = await this.messageService.findLatestConversationByEmail(from.address);
          if (conversationId) {
            this.logger.debug('Found conversation via email fallback', { fromEmail: from.address, conversationId });
          }
        }
      }

      // Handle Attachments (Phase 11) - Available to both standard and legacy paths
      const attachmentsData: any[] = [];
      if (parsed.attachments && parsed.attachments.length > 0) {
        this.logger.info(`Extracting ${parsed.attachments.length} attachments`, { uid });
        
        for (const attachment of parsed.attachments) {
          try {
            // Upload to media-service
            const formData = new FormData();
            const blob = new Blob([attachment.content], { type: attachment.contentType });
            formData.append('file', blob, attachment.filename || 'unnamed_attachment');

            const mediaServiceUrl = config.MEDIA_SERVICE_URL;
            this.logger.debug(`Uploading attachment to ${mediaServiceUrl}`, { 
              filename: attachment.filename,
              mediaServiceUrl 
            });

            // Added /api/v1/media prefix because media-service registers routes with this prefix
            const response = await fetch(`${mediaServiceUrl}/api/v1/media/upload/document?bucket=email-attachments`, {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const result = await response.json() as any;
              if (result.success) {
                attachmentsData.push({
                  name: attachment.filename || 'unnamed_attachment',
                  url: result.data.url,
                  type: attachment.contentType,
                  size: attachment.size
                });
                this.logger.info('Attachment uploaded successfully', { 
                  filename: attachment.filename,
                  url: result.data.url 
                });
              }
            } else {
              const errorText = await response.text();
              this.logger.error('Failed to upload attachment to media-service', {
                status: response.status,
                filename: attachment.filename,
                response: errorText
              });
            }
          } catch (uploadError: any) {
            this.logger.error('Error uploading email attachment', {
              error: uploadError.message,
              filename: attachment.filename,
              stack: uploadError.stack
            });
          }
        }
      }

      if (this.messageService) {
        // Use MessageService.createFromEmail for proper threading
        const savedMessage = await this.messageService.createFromEmail({
          fromName: from.name || from.address.split('@')[0] || 'Unknown',
          fromEmail: from.address,
          body: this.cleanEmailBody(String(body).trim()),
          subject,
          messageId,
          inReplyTo,
          conversationId,
          attachments: attachmentsData.length > 0 ? attachmentsData : undefined,
        });

        // Mark message as seen
        await this.client.messageFlagsAdd(uid, ['\\Seen']);

        // Cleanup: Delete from IMAP server to save space (Phase 11)
        try {
          await this.client.messageDelete(uid);
          this.logger.info('Deleted email from IMAP server after ingestion', { uid, messageId });
        } catch (deleteError: any) {
          this.logger.warn('Failed to delete email from IMAP server', { uid, error: deleteError.message });
        }

        const duration = Date.now() - startTime;
        this.logger.info('Message processed successfully with threading', {
          messageId: savedMessage.id,
          fromEmail: from.address,
          subject,
          uid,
          conversationId,
          duration,
        });

        // Business event
        this.logger.business('inbound_message_received', {
          messageId: savedMessage.id,
          fromEmail: from.address,
          subject,
          source: 'imap',
          conversationId,
        });
      } else {
        // Fallback: direct Prisma create without threading (legacy behavior)
        const savedMessage = await this.prisma.message.create({
          data: {
            fromName: from.name || 'Unknown',
            fromEmail: from.address,
            body: String(body).trim(),
            status: 'RECEIVED',
            type: 'INBOUND',
            context: {
              subject,
              uid,
              messageId,
              date: parsed.date?.toISOString(),
              source: 'imap',
            },
            attachments: attachmentsData.length > 0 ? attachmentsData : undefined,
            events: {
              create: {
                type: 'INBOUND_RECEIVED',
                details: {
                  uid,
                  subject,
                  messageId,
                  attachmentsCount: attachmentsData.length,
                },
              },
            },
          },
        });

        await this.client.messageFlagsAdd(uid, ['\\Seen']);

        const duration = Date.now() - startTime;
        this.logger.info('Message processed successfully (legacy mode)', {
          messageId: savedMessage.id,
          fromEmail: from.address,
          subject,
          uid,
          duration,
        });

        this.logger.business('inbound_message_received', {
          messageId: savedMessage.id,
          fromEmail: from.address,
          subject,
          source: 'imap',
        });
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error('Failed to process IMAP message', {
        error: error.message,
        uid,
        duration,
      });
      throw error;
    }
  }

  /**
   * Clean email body - remove signatures and quoted text
   */
  private cleanEmailBody(body: string): string {
    let cleaned = body;

    // 1. Remove common reply headers/patterns
    // Gmail: "Hugo Menezes <...> escreveu (quinta, ...):"
    cleaned = cleaned.replace(/^.* <.*> escreveu \(.*\):$/gm, '');
    
    // Outlook: "From: ... Date: ... To: ... Subject: ..."
    cleaned = cleaned.replace(/^From: [\s\S]*?Subject: .*$/mi, '');

    // 2. Remove quoted lines (start with >)
    cleaned = cleaned.replace(/^[ ]{0,3}>.*$/gm, '');

    // 3. Remove "On ... wrote:" patterns
    cleaned = cleaned.replace(/On .* wrote:[\s\S]*$/mi, '');
    cleaned = cleaned.replace(/Em .* escreveu:[\s\S]*$/mi, '');
    cleaned = cleaned.replace(/No dia .* escreveu:[\s\S]*$/mi, '');

    // 4. Remove email signatures
    // Standard signature delimiter
    cleaned = cleaned.replace(/\n--\s*\nc?[\s\S]*$/m, '');
    // Common line separators used as signatures
    cleaned = cleaned.replace(/\n_{5,}[\s\S]*$/m, '');
    cleaned = cleaned.replace(/\n-{5,}[\s\S]*$/m, '');

    // 5. Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.trim();

    return cleaned || body; // Fallback to original if cleaning removes everything
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('IMAP service is not running');
      return;
    }

    this.isRunning = false;
    this.logger.info('Stopping IMAP service');

    // Clear polling interval
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }

    // Close IMAP connection
    if (this.client) {
      try {
        await this.client.logout();
        this.logger.info('IMAP client disconnected gracefully');
      } catch (error: any) {
        this.logger.error('Error during IMAP logout', {
          error: error.message,
        });
      } finally {
        this.client = undefined;
      }
    }

    this.logger.info('IMAP service stopped');
  }

  async getHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    connected: boolean;
    lastCheck: Date;
    details: any;
  }> {
    const lastCheck = new Date();
    const connected = !!(this.client && this.isRunning);

    return {
      status: connected ? 'healthy' : 'unhealthy',
      connected,
      lastCheck,
      details: {
        isRunning: this.isRunning,
        reconnectAttempts: this.reconnectAttempts,
        maxReconnectAttempts: this.maxReconnectAttempts,
        circuitBreakerState: this.circuitBreaker.state,
        host: config.IMAP_HOST,
        port: config.IMAP_PORT,
        secure: config.IMAP_SECURE,
      },
    };
  }
}
