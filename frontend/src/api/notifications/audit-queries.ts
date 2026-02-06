import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type {
    AuditLog,
    AuditLogQueryParams,
    PaginatedResponse,
} from './types';

/**
 * Fetch audit logs with optional filters
 */
export function useAuditLogs(params?: AuditLogQueryParams) {
  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/audit-logs', { params });
      return data;
    },
  });
}

/**
 * Get audit logs for a specific entity
 */
export function useEntityAuditLogs(entityType: string, entityId: string) {
  return useQuery<AuditLog[]>({
    queryKey: ['audit-logs', 'entity', entityType, entityId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/audit-logs/entity/${entityType}/${entityId}`);
      return data;
    },
    enabled: !!entityType && !!entityId,
  });
}

/**
 * Get recent audit logs (for activity feed)
 */
export function useRecentAuditLogs(limit: number = 10) {
  return useQuery<AuditLog[]>({
    queryKey: ['audit-logs', 'recent', limit],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/audit-logs/recent', {
        params: { limit },
      });
      return data;
    },
  });
}
