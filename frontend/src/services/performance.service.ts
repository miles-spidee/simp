import { StudentPerformance, BatchPerformance } from '../types/api/performance.types';
import { MOCK_STUDENT_PERFORMANCE, MOCK_BATCH_PERFORMANCE } from '../data/mock-performance';
import { performanceApi } from '../api/performance.api';

class PerformanceService {
  async getStudentPerformances(): Promise<StudentPerformance[]> {
    try {
      const data = await performanceApi.getStudentPerformances();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch student performances via API, returning mock:', e);
    }
    return [...MOCK_STUDENT_PERFORMANCE];
  }

  async getBatchPerformances(): Promise<BatchPerformance[]> {
    try {
      const data = await performanceApi.getBatchPerformances();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch batch performances via API, returning mock:', e);
    }
    return [...MOCK_BATCH_PERFORMANCE];
  }

  async getStudentPerformance(studentId: string): Promise<StudentPerformance | undefined> {
    try {
      const data = await performanceApi.getStudentPerformance(studentId);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch student performance ${studentId} via API, returning mock:`, e);
    }
    return MOCK_STUDENT_PERFORMANCE.find(p => p.studentId === studentId);
  }
}

export const performanceService = new PerformanceService();
