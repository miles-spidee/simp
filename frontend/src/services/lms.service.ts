import { LearningModule, MOCK_LEARNING_MODULES } from '../data/mock-learning-modules';

class LMSService {
  async getModules(): Promise<LearningModule[]> {
    return [...MOCK_LEARNING_MODULES];
  }

  async getModule(id: string): Promise<LearningModule | undefined> {
    return MOCK_LEARNING_MODULES.find(m => m.id === id);
  }

  async getModulesForProgram(programId: string): Promise<LearningModule[]> {
    return MOCK_LEARNING_MODULES.filter(m => m.programId === programId);
  }
}

export const lmsService = new LMSService();
