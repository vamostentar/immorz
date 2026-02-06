import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type {
    AuditLog,
    CommunicationData,
    CommunicationResult,
    ImportResult,
    ImportUserData,
    User,
    UserPermissions
} from './types';

// ===== User CRUD Operations =====

export function useUsers(params?: {
  query?: string;
  limit?: number;
  cursor?: string;
  roleId?: string;
  isActive?: boolean;
  [key: string]: any;
}) {
  return useQuery<{ data: User[]; pagination?: any }>({
    queryKey: ['users', params],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/users', { params });
        return data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

export function useAdminUser(userId: string) {
  return useQuery<User & { profile?: any }>({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/admin/users/${userId}`);
      return data.data || data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const { data } = await api.post('/api/v1/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<User> }) => {
      const { data } = await api.put(`/api/v1/users/${id}`, userData);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/users/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// ===== Communication =====

export function useSendCommunication() {
  const queryClient = useQueryClient();
  return useMutation<CommunicationResult, Error, CommunicationData>({
    mutationFn: async (data: CommunicationData) => {
      const { data: result } = await api.post('/api/v1/users/communication/send', data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// ===== Bulk Import =====

export function useBulkImportUsers() {
  const queryClient = useQueryClient();
  return useMutation<ImportResult, Error, { users: ImportUserData[] }>({
    mutationFn: async (data: { users: ImportUserData[] }) => {
      const { data: result } = await api.post('/api/v1/users/bulk-import', data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// ===== Audit Logs =====

export function useUserAuditLogs(userId: string, period?: string, limit?: number) {
  return useQuery<AuditLog[]>({
    queryKey: ['user-audit-logs', userId, period, limit],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/users/${userId}/audit`, {
        params: { period, limit }
      });
      return data.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ===== Permissions =====

export function useUserPermissions(userId: string) {
  return useQuery<UserPermissions>({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/users/${userId}/permissions`);
      return data.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateUserPermissions() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; permissions: string[] }, Error, { userId: string; permissions: string[] }>({
    mutationFn: async ({ userId, permissions }) => {
      const { data } = await api.put(`/api/v1/users/${userId}/permissions`, { permissions });
      return data.data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
