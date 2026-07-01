import {  MOCK_LEARNING_MODULES } from '../data/mock-learning-modules';
import { LearningModule } from '../types/api/lms.types';
import { lmsApi } from '../api/lms.api';

class LMSService {
  async getModules(): Promise<LearningModule[]> {
    try {
      const data = await lmsApi.getModules();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch LMS modules via API, returning mock:', e);
    }
    return [...MOCK_LEARNING_MODULES];
  }

  async getModule(id: string): Promise<LearningModule | undefined> {
    try {
      const data = await lmsApi.getModule(id);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch LMS module ${id} via API, returning mock:`, e);
    }
    return MOCK_LEARNING_MODULES.find(m => m.id === id);
  }

  async getModulesForProgram(programId: string): Promise<LearningModule[]> {
    try {
      const data = await lmsApi.getModulesForProgram(programId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch LMS modules for program ${programId} via API, returning mock:`, e);
    }
    return MOCK_LEARNING_MODULES.filter(m => m.programId === programId);
  }
}

export const lmsService = new LMSService();
