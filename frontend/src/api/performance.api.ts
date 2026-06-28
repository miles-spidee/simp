import { apiClient } from './api.client';
import { StudentPerformance, BatchPerformance } from '../types/api/performance.types';

export const performanceApi = {
  getStudentPerformances: async (): Promise<StudentPerformance[]> => {
    const res = await apiClient.get<StudentPerformance[]>('/api/v1/performance/students');
    return res.data;
  },

  getBatchPerformances: async (): Promise<BatchPerformance[]> => {
    const res = await apiClient.get<BatchPerformance[]>('/api/v1/performance/batches');
    return res.data;
  },

  getStudentPerformance: async (studentId: string): Promise<StudentPerformance> => {
    const res = await apiClient.get<StudentPerformance>(`/api/v1/performance/students/${studentId}`);
    return res.data;
  }
};
