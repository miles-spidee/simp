import axios from 'axios';
import { Assessment, DashboardStats, StudentAssessment, Role } from '../types/assessment-monitoring.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface MonitoringDataResponse {
  assessments: Assessment[];
  studentAssessments: StudentAssessment[];
  dashboardStats: DashboardStats;
}

export const fetchMonitoringData = async (role: Role): Promise<MonitoringDataResponse> => {
  const response = await axios.get(`${API_BASE_URL}/assessment/monitoring/data`, {
    params: { role }
  });
  return response.data;
};
