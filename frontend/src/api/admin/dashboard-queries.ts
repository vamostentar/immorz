import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { DashboardStats } from './types';

/**
 * Dashboard Statistics
 * Fetches aggregated stats for the admin dashboard
 */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        // Fetch user statistics from auth service
        const userStatsResponse = await api.get('/api/v1/users/statistics');
        const userStats = userStatsResponse.data?.data || {
          total: 0,
          active: 0,
          inactive: 0,
          verified: 0,
          unverified: 0,
          withTwoFactor: 0,
          recentLogins: 0,
        };

        // Fetch property statistics from properties service
        let propertyStats = {
          total: 0,
          active: 0,
          pending: 0,
          inactive: 0,
          totalValue: 0,
          averagePrice: 0,
          monthlyViews: 0,
        };

        try {
          const propertyStatsResponse = await api.get('/api/v1/properties-stats');
          propertyStats = propertyStatsResponse.data?.data || propertyStats;
        } catch (error) {
          console.warn('Property stats not available:', error);
        }

        // Buscar aprovações pendentes do user-service
        let pendingApprovals = 0;
        try {
          const approvalsResponse = await api.get('/api/v1/admin/pending-approvals');
          pendingApprovals = approvalsResponse.data?.data?.count || 0;
        } catch (error) {
          console.warn('Erro ao buscar aprovações pendentes:', error);
        }

        return {
          users: userStats,
          properties: propertyStats,
          pendingApprovals,
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
