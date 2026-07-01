import { apiClient } from './api.client';
import { ReportingManager, ManagerAssignment, ManagerEvaluation } from '../types/reporting-manager.types';
import {} from '../types/reporting-managers.types';
import {} from '../types/manager-assignments.types';
import {} from '../types/manager-evaluations.types';

export const reportingManagerApi = {
  getManagers: async (): Promise<ReportingManager[]> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getManagerById: async (id: string): Promise<ReportingManager | undefined> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  getAssignmentsByManager: async (managerId: string): Promise<ManagerAssignment[]> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  getEvaluationsByManager: async (managerId: string): Promise<ManagerEvaluation[]> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
