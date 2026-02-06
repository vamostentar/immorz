import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { Role } from './types';

// Fallback roles when API is unavailable
const FALLBACK_ROLES: Role[] = [
  { id: 'super_admin', name: 'super_admin', displayName: 'Super Administrador', permissions: ['*'], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'admin', name: 'admin', displayName: 'Administrador', permissions: [], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'agent', name: 'agent', displayName: 'Agente', permissions: [], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'client', name: 'client', displayName: 'Cliente', permissions: [], isActive: true, createdAt: '', updatedAt: '' },
];

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching roles from API...');
        const response = await api.get('/api/v1/roles');
        console.log('📥 Raw API response:', response);

        // Handle different response structures
        const roles = response.data?.data || response.data || [];
        console.log('📋 Extracted roles:', roles);

        // Validate each role has required fields
        if (Array.isArray(roles) && roles.length > 0) {
          const validRoles = roles.filter((r: any) => r && (r.id || r.name));
          if (validRoles.length > 0) {
            console.log('✅ Using API roles:', validRoles);
            return validRoles;
          }
        }

        console.warn('⚠️ No valid roles from API, using fallback');
        return FALLBACK_ROLES;
      } catch (error) {
        console.warn('❌ Failed to fetch roles, using fallback:', error);
        return FALLBACK_ROLES;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry, use fallback immediately
  });
}
