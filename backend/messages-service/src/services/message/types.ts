import { Message } from '@prisma/client';

export interface CreateMessageDto {
  fromName: string;
  fromEmail: string;
  phone?: string;
  body: string;
  context?: any;
  propertyId?: string;
  agentId?: string;
  correlationId?: string;
  attachments?: any;
}

export interface SendOutboundMessageDto {
  toEmail: string;
  subject: string;
  body: string;
  attachments?: { name: string; url: string; type: string; size: number }[];
  agentId: string; // The sender
}


export interface MessageWithEvents extends Message {
  events: Array<{
    id: string;
    type: string;
    details: any;
    createdAt: Date;
  }>;
}

export interface PaginatedMessages {
  data: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
