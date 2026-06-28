import { apiClient } from './api.client';
import { LearningModule } from '../types/api/lms.types';

export const lmsApi = {
  getModules: async (): Promise<LearningModule[]> => {
    const res = await apiClient.get<LearningModule[]>('/api/v1/lms/modules');
    return res.data;
  },
  
  getModule: async (id: string): Promise<LearningModule> => {
    const res = await apiClient.get<LearningModule>(`/api/v1/lms/modules/${id}`);
    return res.data;
  },

  getModulesForProgram: async (programId: string): Promise<LearningModule[]> => {
    const res = await apiClient.get<LearningModule[]>(`/api/v1/lms/programs/${programId}/modules`);
    return res.data;
  }
};
