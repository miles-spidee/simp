import { apiClient } from '../api/api.client';
import { StudentPerformance, BatchPerformance } from '../types/api/performance.types';
import {} from '../types/performance.types';
import { performanceApi } from '../api/performance.api';

class PerformanceService {
  async getStudentPerformances(): Promise<StudentPerformance[]> {
    try {
      const res = await apiClient.get('/api/v1/performance');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getBatchPerformances(): Promise<BatchPerformance[]> {
    try {
      const res = await apiClient.get('/api/v1/performance');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getStudentPerformance(studentId: string): Promise<StudentPerformance | undefined> {
    try {
      const res = await apiClient.get('/api/v1/performance');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
}

export const performanceService = new PerformanceService();
