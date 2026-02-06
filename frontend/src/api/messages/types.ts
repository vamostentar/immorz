import type { Message } from '@/types';

export type { Message };

// Message Query Parameters
export interface MessageQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: 'INBOUND' | 'OUTBOUND';
  fromEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  agentId?: string;
  propertyId?: string;
  read?: boolean;
  deleted?: boolean;
  search?: string;
}

// Message Stats
export interface MessageStats {
  total: number;
  byStatus: Record<string, number>;
  last24Hours: number;
  last7Days: number;
  unread?: number;
}
