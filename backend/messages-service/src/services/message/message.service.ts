import { Message, MessageStatus } from '@prisma/client';
import { ConversationService } from './conversation.service';
import { EmailReplyService } from './email-reply.service';
import { MessageCoreService } from './message-core.service';
import { MessageStatsService } from './message-stats.service';
import { CreateMessageDto, MessageWithEvents, PaginatedMessages } from './types';

export class MessageService {
  constructor(
    private messageCore: MessageCoreService,
    private conversation: ConversationService,
    private emailReply: EmailReplyService,
    private stats: MessageStatsService
  ) {}

  // MessageCoreService Delegates
  createMessage(data: CreateMessageDto): Promise<Message> {
    return this.messageCore.createMessage(data);
  }

  updateMessageStatus(messageId: string, status: MessageStatus, correlationId: string, error?: string): Promise<Message> {
    return this.messageCore.updateMessageStatus(messageId, status, correlationId, error);
  }

  getMessageById(id: string, useCache = true): Promise<MessageWithEvents | null> {
    return this.messageCore.getMessageById(id, useCache);
  }

  getMessages(page = 1, limit = 20, filters: any = {}): Promise<PaginatedMessages> {
    return this.messageCore.getMessages(page, limit, filters);
  }

  markAsRead(messageId: string): Promise<void> {
    return this.messageCore.markAsRead(messageId);
  }

  markAsUnread(messageId: string): Promise<void> {
    return this.messageCore.markAsUnread(messageId);
  }

  deleteMessage(messageId: string): Promise<void> {
    return this.messageCore.deleteMessage(messageId);
  }

  restoreMessage(messageId: string): Promise<void> {
    return this.messageCore.restoreMessage(messageId);
  }

  permanentlyDeleteMessage(messageId: string): Promise<void> {
    return this.messageCore.permanentlyDeleteMessage(messageId);
  }

  // ConversationService Delegates
  getConversation(messageId: string): Promise<Message[]> {
    return this.conversation.getConversation(messageId);
  }

  findConversationByEmailMessageId(emailMessageId: string): Promise<string | null> {
    return this.conversation.findConversationByEmailMessageId(emailMessageId);
  }

  findLatestConversationByEmail(fromEmail: string): Promise<string | null> {
    return this.conversation.findLatestConversationByEmail(fromEmail);
  }

  // EmailReplyService Delegates
  replyToMessage(
    originalMessageId: string, 
    body: string, 
    subject?: string, 
    toEmail?: string,
    attachments?: { name: string; url: string; type: string; size: number }[]
  ): Promise<Message> {
    return this.emailReply.replyToMessage(originalMessageId, body, subject, toEmail, attachments);
  }

  createFromEmail(data: any): Promise<Message> {
    return this.emailReply.createFromEmail(data);
  }

  sendOutboundMessage(data: any): Promise<Message> {
    return this.messageCore.sendOutboundMessage(data);
  }

  // MessageStatsService Delegates
  getMessageStats(agentId?: string): Promise<any> {
    return this.stats.getMessageStats(agentId);
  }

  retryFailedMessages(limit = 10): Promise<number> {
    return this.stats.retryFailedMessages(limit);
  }

  cleanupOldMessages(daysOld = 90): Promise<number> {
    return this.stats.cleanupOldMessages(daysOld);
  }
}
