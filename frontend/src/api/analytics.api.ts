import { apiClient } from './api.client';
import { AnalyticsSummary, AnalyticsDataPoint, AnalyticsDimension } from '../types/analytics.types';
import {} from '../types/analytics.types';

export const AnalyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const res = await apiClient.get('/api/v1/analytics/summary');
    return res.data?.data;
  },
  getAttendanceTrend: async (): Promise<AnalyticsDataPoint[]> => {
    const res = await apiClient.get('/api/v1/analytics/attendance-trend');
    return res.data?.data || [];
  },
  getTopPrograms: async (): Promise<AnalyticsDimension[]> => {
    const res = await apiClient.get('/api/v1/analytics/top-programs');
    return res.data?.data || [];
  }
};
