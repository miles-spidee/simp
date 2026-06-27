import { Module, MOCK_MODULES } from '../data/mock-modules';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_MODULES;
  },

  async getModule(id: string): Promise<Module | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_MODULES.find(m => m.id === id);
  },

  async createModule(mod: Omit<Module, 'active'> & { active?: boolean }): Promise<Module> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMod: Module = {
      ...mod,
      active: mod.active !== undefined ? mod.active : true
    };
    MOCK_MODULES.push(newMod);
    return newMod;
  },

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = MOCK_MODULES.findIndex(m => m.id === id);
    if (idx !== -1) {
      MOCK_MODULES[idx] = {
        ...MOCK_MODULES[idx],
        ...updates
      };
      return MOCK_MODULES[idx];
    }
    return undefined;
  }
};
