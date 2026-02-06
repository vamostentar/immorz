import type {
    CreateModuleSettingRequest,
    ModuleSettingsList,
    SettingsOperationResult,
    SystemSettings,
    UpdateModuleSettingRequest,
    UpdateSystemSettingsRequest
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { SEOValidationResult } from './types';

// ===== System Settings =====

export function useSystemSettings() {
  return useQuery<SettingsOperationResult<SystemSettings>>({
    queryKey: ['system-settings'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/settings');
        return data;
      } catch (error) {
        console.error('Error fetching system settings:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: UpdateSystemSettingsRequest) => {
      const { data } = await api.put('/api/v1/settings', settings);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useResetSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/api/v1/settings/reset');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useSettingsField(fieldName: string) {
  return useQuery<SettingsOperationResult<{ field: string; value: any }>>({
    queryKey: ['settings-field', fieldName],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/settings/field/${fieldName}`);
      return data;
    },
    enabled: !!fieldName,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUpdateSettingsField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ fieldName, value }: { fieldName: string; value: any }) => {
      const { data } = await api.put(`/api/v1/settings/field/${fieldName}`, { value });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings-field'] });
    },
  });
}

export function useValidateSettings() {
  return useMutation({
    mutationFn: async (settings: UpdateSystemSettingsRequest) => {
      const { data } = await api.post('/api/v1/settings/validate', settings);
      return data;
    },
  });
}

export function useSettingsStats() {
  return useQuery<SettingsOperationResult<any>>({
    queryKey: ['settings-stats'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/settings/stats');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useValidateSEO() {
  return useMutation({
    mutationFn: async (settings: UpdateSystemSettingsRequest): Promise<SEOValidationResult> => {
      const { data } = await api.post('/api/v1/settings/validate/seo', settings);
      return data.data;
    },
  });
}

// ===== Module Settings =====

export function useModuleSettings(moduleName: string) {
  return useQuery<SettingsOperationResult<any>>({
    queryKey: ['module-settings', moduleName],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/module-settings/${moduleName}`);
      return data;
    },
    enabled: !!moduleName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateModuleSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ moduleName, settings }: { moduleName: string; settings: Record<string, any> }) => {
      const { data } = await api.put(`/api/v1/module-settings/${moduleName}`, settings);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['module-settings', variables.moduleName] });
      queryClient.invalidateQueries({ queryKey: ['module-settings-list'] });
    },
  });
}

export function useModuleSetting(moduleName: string, settingsKey: string) {
  return useQuery<SettingsOperationResult<{ module: string; key: string; value: any }>>({
    queryKey: ['module-setting', moduleName, settingsKey],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/module-settings/${moduleName}/${settingsKey}`);
      return data;
    },
    enabled: !!moduleName && !!settingsKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateModuleSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setting: CreateModuleSettingRequest) => {
      const { data } = await api.post('/api/v1/module-settings', setting);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-settings-list'] });
    },
  });
}

export function useUpdateModuleSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateModuleSettingRequest }) => {
      const { data: response } = await api.put(`/api/v1/module-settings/setting/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-settings-list'] });
      queryClient.invalidateQueries({ queryKey: ['module-settings'] });
    },
  });
}

export function useDeleteModuleSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/module-settings/setting/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-settings-list'] });
      queryClient.invalidateQueries({ queryKey: ['module-settings'] });
    },
  });
}

export function useDeleteModuleSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleName: string) => {
      await api.delete(`/api/v1/module-settings/module/${moduleName}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-settings-list'] });
      queryClient.invalidateQueries({ queryKey: ['module-settings'] });
    },
  });
}

export function useModuleSettingsList(params?: {
  page?: number;
  limit?: number;
  filters?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery<ModuleSettingsList>({
    queryKey: ['module-settings-list', params],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/module-settings', { params });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
