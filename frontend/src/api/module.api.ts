import { apiClient } from './api.client';
import { Module } from '../types/api/module.types';

export const moduleApi = {
  getModules: async (): Promise<Module[]> => {
    const res = await apiClient.get<Module[]>('/api/v1/rbac/modules');
    return (res.data as any)?.data || res.data;
  },

  getModule: async (id: string): Promise<Module> => {
    const res = await apiClient.get<Module>(`/api/v1/rbac/modules/${id}`);
    return (res.data as any)?.data || res.data;
  },

  createModule: async (data: Omit<Module, 'active'> & { active?: boolean }): Promise<Module> => {
    const res = await apiClient.post<Module>('/api/v1/rbac/modules', data);
    return (res.data as any)?.data || res.data;
  },

  updateModule: async (id: string, updates: Partial<Module>): Promise<Module> => {
    const res = await apiClient.patch<Module>(`/api/v1/rbac/modules/${id}`, updates);
    return (res.data as any)?.data || res.data;
  }
};
