import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { PropertyInterest, SavedProperty } from './types';

// ===== Property Interests =====

/**
 * Fetch user's property interests
 */
export function useUserPropertyInterests(userId?: string) {
  return useQuery<PropertyInterest[]>({
    queryKey: ['property-interests', userId],
    queryFn: async () => {
      const endpoint = userId ? `/api/v1/property-interests/${userId}` : '/api/v1/property-interests/me';
      const { data } = await api.get(endpoint);
      return data.data || [];
    },
    enabled: !!userId || true,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Add a property interest
 */
export function useAddPropertyInterest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, interestType }: { propertyId: string; interestType?: string }) => {
      const { data } = await api.post('/api/v1/property-interests', {
        propertyId,
        interestType: interestType || 'VIEWED'
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-interests'] });
    },
  });
}

// ===== Saved Properties =====

/**
 * Fetch user's saved properties
 */
export function useUserSavedProperties(userId?: string) {
  return useQuery<SavedProperty[]>({
    queryKey: ['saved-properties', userId],
    queryFn: async () => {
      const endpoint = userId ? `/api/v1/saved-properties/${userId}` : '/api/v1/saved-properties/me';
      const { data } = await api.get(endpoint);
      return data.data || [];
    },
    enabled: !!userId || true,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Save a property
 */
export function useSaveProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, notes }: { propertyId: string; notes?: string }) => {
      const { data } = await api.post('/api/v1/saved-properties', {
        propertyId,
        notes: notes || ''
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-properties'] });
    },
  });
}

/**
 * Remove a saved property
 */
export function useRemoveSavedProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      await api.delete(`/api/v1/saved-properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-properties'] });
    },
  });
}

// ===== Utility Functions =====

/**
 * Track a property view (fire-and-forget)
 */
export async function trackPropertyView(propertyId: string) {
  try {
    await api.post('/api/v1/property-interests', {
      propertyId,
      interestType: 'VIEWED'
    });
  } catch (error) {
    console.warn('Failed to track property view:', error);
  }
}
