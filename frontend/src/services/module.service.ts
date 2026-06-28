import {  MOCK_MODULES } from '../data/mock-modules';
import { Module } from '../types/api/module.types';
import { moduleApi } from '../api/module.api';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    try {
      const data = await moduleApi.getModules();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch system modules via API, returning mock:', e);
    }
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_MODULES;
  },

  async getModule(id: string): Promise<Module | undefined> {
    try {
      const data = await moduleApi.getModule(id);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch system module ${id} via API, returning mock:`, e);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_MODULES.find(m => m.id === id);
  },

  async createModule(mod: Omit<Module, 'active'> & { active?: boolean }): Promise<Module> {
    try {
      const result = await moduleApi.createModule(mod);
      if (result) return result;
    } catch (e) {
      console.debug('Failed to create system module via API, creating mock:', e);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMod: Module = {
      ...mod,
      active: mod.active !== undefined ? mod.active : true
    };
    MOCK_MODULES.push(newMod);
    return newMod;
  },

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    try {
      const result = await moduleApi.updateModule(id, updates);
      if (result) return result;
    } catch (e) {
      console.debug(`Failed to update system module ${id} via API, updating mock:`, e);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = MOCK_MODULES.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    MOCK_MODULES[index] = { ...MOCK_MODULES[index], ...updates };
    return MOCK_MODULES[index];
  }
};
