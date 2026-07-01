import { apiClient } from '../api/api.client';
import {} from '../types/learning-modules.types';
import { LearningModule } from '../types/api/lms.types';
import { lmsApi } from '../api/lms.api';

class LMSService {
  async getModules(): Promise<LearningModule[]> {
    try {
      const res = await apiClient.get('/api/v1/lms');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getModule(id: string): Promise<LearningModule | undefined> {
    try {
      const res = await apiClient.get('/api/v1/lms');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }

  async getModulesForProgram(programId: string): Promise<LearningModule[]> {
    try {
      const res = await apiClient.get('/api/v1/lms');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
}

export const lmsService = new LMSService();
