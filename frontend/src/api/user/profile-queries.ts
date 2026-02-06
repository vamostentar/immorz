import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { UserProfile } from './types';

/**
 * Fetch user profile
 */
export function useUserProfile(userId?: string) {
  return useQuery<UserProfile>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const endpoint = userId ? `/api/v1/user-profiles/${userId}` : '/api/v1/user-profiles/me';
      const { data } = await api.get(endpoint);
      return data.data;
    },
    enabled: !!userId || true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Update other user's profile (Admin)
 */
export function useUpdateUserProfileById() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserProfile> }) => {
      const response = await api.put(`/api/v1/user-profiles/${userId}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.userId] });
    },
  });
}

/**
 * Update current user's profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updateData: Partial<UserProfile>) => {
      const { data } = await api.put('/api/v1/user-profiles/me', updateData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}
