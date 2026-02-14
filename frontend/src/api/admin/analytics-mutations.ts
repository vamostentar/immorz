import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

/**
 * Hook para disparar manualmente o ciclo de agregação de dados no servidor
 */
export function useTriggerAggregation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/api/v1/analytics/aggregate');
      return data;
    },
    onSuccess: () => {
      // Invalida o dashboard de analytics após a agregação
      queryClient.invalidateQueries({ queryKey: ['analytics-dashboard'] });
    },
  });
}
