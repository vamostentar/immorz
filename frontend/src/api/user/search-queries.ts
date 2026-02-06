import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { SearchHistory } from './types';

/**
 * Fetch user's search history
 */
export function useUserSearchHistory(userId?: string) {
  return useQuery<SearchHistory[]>({
    queryKey: ['search-history', userId],
    queryFn: async () => {
      const endpoint = userId ? `/api/v1/search-history/${userId}` : '/api/v1/search-history/me';
      const { data } = await api.get(endpoint);
      return data.data || [];
    },
    enabled: !!userId || true,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Add to search history
 */
export function useAddSearchHistory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ searchQuery, resultsCount }: { searchQuery: string; resultsCount?: number }) => {
      const { data } = await api.post('/api/v1/search-history', {
        searchQuery,
        resultsCount: resultsCount || 0
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });
}

/**
 * Track a search (fire-and-forget)
 */
export async function trackSearch(searchQuery: string, resultsCount: number) {
  try {
    await api.post('/api/v1/search-history', {
      searchQuery,
      resultsCount
    });
  } catch (error) {
    console.warn('Failed to track search:', error);
  }
}
