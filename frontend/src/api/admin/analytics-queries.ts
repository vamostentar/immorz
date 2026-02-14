import { useQuery } from '@tanstack/react-query';
import { AnalyticsData } from './types';

import { api } from '../client';

/**
 * Analytics Data
 * Fetches analytics for the admin dashboard
 */
export function useAnalyticsData() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      try {
        const { data } = await api.get('/api/v1/analytics/dashboard');
        
        if (!data.success) {
          throw new Error(data.error || 'Falha ao carregar dados analíticos');
        }

        return data.data;
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
