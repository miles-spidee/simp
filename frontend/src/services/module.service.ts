import { apiClient } from '../api/api.client';
// import {} from '../types/modules.types';
import { Module } from '../types/api/module.types';
import { moduleApi } from '../api/module.api';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    try {
      return await moduleApi.getModules();
    } catch (error) {
      return [];
    }
  },

  async getModule(id: string): Promise<Module | undefined> {
    try {
      return await moduleApi.getModule(id);
    } catch (error) {
      return undefined;
    }
  },

  async createModule(mod: Omit<Module, 'active'> & { active?: boolean }): Promise<Module> {
    try {
      return await moduleApi.createModule(mod);
    } catch (error) {
      return null as any;
    }
  },

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    try {
      return await moduleApi.updateModule(id, updates);
    } catch (error) {
      return undefined;
    }
  }
};
