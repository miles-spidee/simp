import { apiClient } from '../api/api.client';
import { StudentDashboardData } from '../types/student-dashboard.types';

export const studentDashboardService = {
  async getDashboardData(): Promise<StudentDashboardData> {
    try {
      const res = await apiClient.get('/api/v1/studentDashboard');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
