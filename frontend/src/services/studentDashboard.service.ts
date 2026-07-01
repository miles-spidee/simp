import { StudentDashboardData, MOCK_STUDENT_DASHBOARD } from '../data/mock-student-dashboard';

export const studentDashboardService = {
  async getDashboardData(): Promise<StudentDashboardData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_STUDENT_DASHBOARD;
  }
};
