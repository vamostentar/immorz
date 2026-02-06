import { useQuery } from '@tanstack/react-query';

/**
 * Analytics Data
 * Fetches analytics for the admin dashboard
 */
export function useAnalyticsData() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      try {
        // TODO: Implementar endpoints reais de analytics
        // Por enquanto retorna dados vazios
        return {
          propertyTypes: [],
          topRegions: [],
          monthlyStats: []
        };
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
