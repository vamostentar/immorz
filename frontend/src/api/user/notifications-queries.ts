import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { Notification } from './types';

/**
 * Fetch user's notifications
 */
export function useUserNotifications(userId?: string) {
  return useQuery<Notification[]>({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const endpoint = userId ? `/api/v1/notifications/${userId}` : '/api/v1/notifications/me';
      const { data } = await api.get(endpoint);
      return data.data || [];
    },
    enabled: !!userId || true,
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refetch a cada minuto
  });
}

/**
 * Mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.put(`/api/v1/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
