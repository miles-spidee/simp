import { apiClient } from '../api/api.client';
// import {} from '../types/modules.types';
import { Module } from '../types/api/module.types';
import { moduleApi } from '../api/module.api';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    try {
      const res = await apiClient.get('/api/v1/module');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  async getModule(id: string): Promise<Module | undefined> {
    try {
      const res = await apiClient.get('/api/v1/module');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async createModule(mod: Omit<Module, 'active'> & { active?: boolean }): Promise<Module> {
    try {
      const res = await apiClient.post('/api/v1/module');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    try {
      const res = await apiClient.patch('/api/v1/module');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
