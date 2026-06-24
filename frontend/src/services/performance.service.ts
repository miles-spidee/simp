import { StudentPerformance, BatchPerformance, MOCK_STUDENT_PERFORMANCE, MOCK_BATCH_PERFORMANCE } from '../data/mock-performance';

class PerformanceService {
  async getStudentPerformances(): Promise<StudentPerformance[]> {
    return [...MOCK_STUDENT_PERFORMANCE];
  }

  async getBatchPerformances(): Promise<BatchPerformance[]> {
    return [...MOCK_BATCH_PERFORMANCE];
  }

  async getStudentPerformance(studentId: string): Promise<StudentPerformance | undefined> {
    return MOCK_STUDENT_PERFORMANCE.find(p => p.studentId === studentId);
  }
}

export const performanceService = new PerformanceService();
