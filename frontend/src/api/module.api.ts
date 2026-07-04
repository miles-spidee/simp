import { apiClient } from './api.client';
import { Module } from '../types/api/module.types';

type ApiEnvelope<T> = {
  data?: T;
};

const unwrapResponse = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
};

export const moduleApi = {
  getModules: async (): Promise<Module[]> => {
    const res = await apiClient.get<Module[] | ApiEnvelope<Module[]>>('/api/v1/rbac/modules/');
    return unwrapResponse(res.data);
  },

  getModule: async (id: string): Promise<Module> => {
    const res = await apiClient.get<Module | ApiEnvelope<Module>>(`/api/v1/rbac/modules/${id}`);
    return unwrapResponse(res.data);
  },

  createModule: async (data: Omit<Module, 'id' | 'displayId' | 'active'> & { active?: boolean }): Promise<Module> => {
    const res = await apiClient.post<Module | ApiEnvelope<Module>>('/api/v1/rbac/modules/', data);
    return unwrapResponse(res.data);
  },

  updateModule: async (id: string, updates: Partial<Module>): Promise<Module> => {
    const res = await apiClient.patch<Module | ApiEnvelope<Module>>(`/api/v1/rbac/modules/${id}`, updates);
    return unwrapResponse(res.data);
  }
};