import { Module } from '../types/api/module.types';
import { moduleApi } from '../api/module.api';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    try {
      return await moduleApi.getModules();
    } catch {
      return [];
    }
  },

  async getModule(id: string): Promise<Module | undefined> {
    try {
      return await moduleApi.getModule(id);
    } catch {
      return undefined;
    }
  },

  async createModule(mod: Omit<Module, 'id' | 'displayId' | 'active'> & { active?: boolean }): Promise<Module> {
    try {
      return await moduleApi.createModule(mod);
    } catch {
      return null as unknown as Module;
    }
  },

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    try {
      return await moduleApi.updateModule(id, updates);
    } catch {
      return undefined;
    }
  }
};