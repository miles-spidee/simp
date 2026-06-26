import { ReportingManager, ManagerAssignment, ManagerEvaluation } from '../types/reporting-manager.types';
import { MOCK_REPORTING_MANAGERS } from '../data/mock-reporting-managers';
import { MOCK_MANAGER_ASSIGNMENTS } from '../data/mock-manager-assignments';
import { MOCK_MANAGER_EVALUATIONS } from '../data/mock-manager-evaluations';

export const reportingManagerApi = {
  getManagers: async (): Promise<ReportingManager[]> => {
    return Promise.resolve([...MOCK_REPORTING_MANAGERS]);
  },
  
  getManagerById: async (id: string): Promise<ReportingManager | undefined> => {
    return Promise.resolve(MOCK_REPORTING_MANAGERS.find(m => m.id === id));
  },

  getAssignmentsByManager: async (managerId: string): Promise<ManagerAssignment[]> => {
    return Promise.resolve(MOCK_MANAGER_ASSIGNMENTS.filter(a => a.managerId === managerId));
  },

  getEvaluationsByManager: async (managerId: string): Promise<ManagerEvaluation[]> => {
    return Promise.resolve(MOCK_MANAGER_EVALUATIONS.filter(e => e.managerId === managerId));
  }
};
