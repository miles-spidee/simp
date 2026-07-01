import { apiClient } from './api.client';
import { Module } from '../types/api/module.types';

export const moduleApi = {
  getModules: async (): Promise<Module[]> => {
    const res = await apiClient.get<Module[]>('/api/v1/modules');
    return res.data;
  },

  getModule: async (id: string): Promise<Module> => {
    const res = await apiClient.get<Module>(`/api/v1/modules/${id}`);
    return res.data;
  },

  createModule: async (data: Omit<Module, 'active'> & { active?: boolean }): Promise<Module> => {
    const res = await apiClient.post<Module>('/api/v1/modules', data);
    return res.data;
  },

  updateModule: async (id: string, updates: Partial<Module>): Promise<Module> => {
    const res = await apiClient.put<Module>(`/api/v1/modules/${id}`, updates);
    return res.data;
  }
};
