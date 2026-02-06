import type { Project } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '../client';

/**
 * Fetch all projects
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/projects');
      return data;
    },
    enabled: false, // Desabilitar chamada automática
  });
}
