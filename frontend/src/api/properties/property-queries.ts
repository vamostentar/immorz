import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { PropertiesListResponse, Property, PropertyQueryParams } from './types';

/**
 * Fetch system settings
 */
export function useSettings() {
  return useQuery<import('@/types').SystemSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/settings');
      return data;
    },
    staleTime: 1000 * 60, // 1 min
    enabled: false, // Desabilitar chamada automática
  });
}

/**
 * Fetch properties list with optional filters
 */
export function useProperties(params?: Partial<PropertyQueryParams>) {
  return useQuery<PropertiesListResponse>({
    queryKey: ['properties', params],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/properties', { params });
      if (Array.isArray(data)) {
        return { data } as PropertiesListResponse;
      }
      return data as PropertiesListResponse;
    },
    retry: 1,
    staleTime: 0,
  });
}

/**
 * Fetch a single property by ID
 */
export function useProperty(propertyId: string) {
  return useQuery<Property>({
    queryKey: ['property', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/properties/${propertyId}`);
      return data?.data ?? data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Create a new property
 */
export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Property>) => {
      const { data } = await api.post('/api/v1/properties', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

/**
 * Update an existing property
 */
export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Property> }) => {
      const { data } = await api.put(`/api/v1/properties/${id}`, payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

/**
 * Delete a property
 */
export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/properties/${id}`);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

/**
 * Update property admin status (ACTIVE/PENDING/INACTIVE)
 */
export function useUpdatePropertyAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, adminStatus }: { propertyId: string; adminStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE' }) => {
      const { data } = await api.patch(`/api/v1/properties/${propertyId}/admin-status`, { adminStatus });
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidar todas as queries relacionadas com propriedades
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });

      // Forçar refetch imediato
      queryClient.refetchQueries({ queryKey: ['properties'] });

      console.log('✅ Estado administrativo atualizado:', variables.adminStatus);
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar estado administrativo:', error);
    },
  });
}

/**
 * Increment property views count
 */
export function useIncrementPropertyViews() {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/api/v1/properties/${id}/views`);
      return true;
    },
  });
}
