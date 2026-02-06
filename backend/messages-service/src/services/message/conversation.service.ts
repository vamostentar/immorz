import { createLogger } from '@/utils/logger';
import { Message, PrismaClient } from '@prisma/client';

export class ConversationService {
  private logger = createLogger({ service: 'ConversationService' });

  constructor(
    private prisma: PrismaClient
  ) { }

  /**
   * Get all messages in a conversation thread
   */
  async getConversation(messageId: string): Promise<Message[]> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.conversationId) {
        return this.prisma.message.findMany({
          where: {
            conversationId: message.conversationId,
            deleted: false,
          },
          orderBy: { createdAt: 'asc' },
        });
      }

      return this.prisma.message.findMany({
        where: {
          OR: [
            { id: messageId },
            { parentMessageId: messageId },
          ],
          deleted: false,
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error: any) {
      this.logger.error('Failed to get conversation', {
        error: error.message,
        messageId,
      });
      throw error;
    }
  }

  /**
   * Find conversation by email Message-ID header
   */
  async findConversationByEmailMessageId(emailMessageId: string): Promise<string | null> {
    try {
      const message = await this.prisma.message.findFirst({
        where: { emailMessageId },
        select: { conversationId: true, id: true },
      });

      if (message) {
        return message.conversationId || message.id;
      }

      return null;
    } catch (error: any) {
      this.logger.error('Failed to find conversation by emailMessageId', {
        emailMessageId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Find latest conversation with a specific email address
   */
  async findLatestConversationByEmail(fromEmail: string): Promise<string | null> {
    try {
      const message = await this.prisma.message.findFirst({
        where: {
          OR: [
            { fromEmail },
            { context: { path: ['replyTo'], equals: fromEmail } },
          ],
          deleted: false,
        },
        orderBy: { createdAt: 'desc' },
        select: { conversationId: true, id: true },
      });

      if (message) {
        return message.conversationId || message.id;
      }

      return null;
    } catch (error: any) {
      this.logger.error('Failed to find conversation by email', {
        fromEmail,
        error: error.message,
      });
      return null;
    }
  }
}
