import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { UserPreferences } from './types';

/**
 * Fetch user preferences
 */
export function useUserPreferences(userId?: string) {
  return useQuery<UserPreferences>({
    queryKey: ['user-preferences', userId],
    queryFn: async () => {
      const endpoint = userId ? `/api/v1/user-preferences/${userId}` : '/api/v1/user-preferences/me';
      const { data } = await api.get(endpoint);
      return data.data || {};
    },
    enabled: !!userId || true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Update user preferences
 */
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updateData: Partial<UserPreferences>) => {
      const { data } = await api.put('/api/v1/user-preferences/me', updateData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
}
