import { reportingManagerApi } from '../api/reportingManager.api';
import { ReportingManager, ManagerAssignment, ManagerEvaluation } from '../types/reporting-manager.types';

export const reportingManagerService = {
  getDashboardKPIs: async (managerId: string) => {
    const assignments = await reportingManagerApi.getAssignmentsByManager(managerId);
    return {
      totalInterns: assignments.length,
      averagePerformance: assignments.reduce((acc, curr) => acc + curr.performanceScore, 0) / (assignments.length || 1),
      highRiskInterns: assignments.filter(a => a.riskLevel === 'High').length,
    };
  },

  getInternAssignments: async (managerId: string): Promise<ManagerAssignment[]> => {
    return await reportingManagerApi.getAssignmentsByManager(managerId);
  },
  
  getEvaluations: async (managerId: string): Promise<ManagerEvaluation[]> => {
    return await reportingManagerApi.getEvaluationsByManager(managerId);
  }
};
