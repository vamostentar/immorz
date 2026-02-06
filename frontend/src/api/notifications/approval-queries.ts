import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type {
    Approval,
    ApprovalQueryParams,
    ApprovalStats,
    ApproveApprovalPayload,
    PaginatedResponse,
    RejectApprovalPayload,
} from './types';

/**
 * Fetch approvals with optional filters
 */
export function useApprovals(params?: ApprovalQueryParams) {
  return useQuery<PaginatedResponse<Approval>>({
    queryKey: ['approvals', params],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/approvals', { params });
      return data;
    },
  });
}

/**
 * Get pending approvals (convenience hook)
 */
export function usePendingApprovals(params?: Omit<ApprovalQueryParams, 'status'>) {
  return useApprovals({ ...params, status: 'PENDING' });
}

/**
 * Get approval statistics
 */
export function useApprovalStats() {
  return useQuery<ApprovalStats>({
    queryKey: ['approvals', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/approvals/stats');
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Get a single approval by ID
 */
export function useApproval(approvalId: string | undefined) {
  return useQuery<Approval>({
    queryKey: ['approvals', approvalId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/approvals/${approvalId}`);
      return data;
    },
    enabled: !!approvalId,
  });
}

/**
 * Approve an approval request
 */
export function useApproveApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ApproveApprovalPayload) => {
      const { data } = await api.patch(
        `/api/v1/approvals/${payload.id}/approve`,
        { notes: payload.notes }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate all approval-related queries
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

/**
 * Reject an approval request
 */
export function useRejectApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RejectApprovalPayload) => {
      const { data } = await api.patch(
        `/api/v1/approvals/${payload.id}/reject`,
        { notes: payload.notes }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

/**
 * Delete an approval (for cleanup purposes)
 */
export function useDeleteApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (approvalId: string) => {
      await api.delete(`/api/v1/approvals/${approvalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

/**
 * Get approvals by entity
 */
export function useApprovalsByEntity(entityType: string, entityId: string) {
  return useQuery<Approval[]>({
    queryKey: ['approvals', 'entity', entityType, entityId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/approvals/entity/${entityType}/${entityId}`);
      return data;
    },
    enabled: !!entityType && !!entityId,
  });
}

