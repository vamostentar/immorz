import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { BackupItem, CreateBackupRequest, RestoreBackupRequest } from './types';

// ===== Backup & Restore APIs =====

export function useBackups() {
  return useQuery<BackupItem[]>({
    queryKey: ['backups'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/backup');
      return data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateBackupRequest) => {
      const { data } = await api.post('/api/v1/backup', request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
    },
  });
}

export function useRestoreBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RestoreBackupRequest) => {
      const { data } = await api.post('/api/v1/backup/restore', request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
  });
}

export function useDeleteBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backupId: string) => {
      const { data } = await api.delete(`/api/v1/backup/${backupId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
    },
  });
}

export function useDownloadBackup() {
  return useMutation({
    mutationFn: async (backupId: string) => {
      const response = await api.get(`/api/v1/backup/${backupId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    },
  });
}
