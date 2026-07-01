import { apiClient } from './api.client';
import { AnalyticsSummary, AnalyticsDataPoint, AnalyticsDimension } from '../types/analytics.types';
import {} from '../types/analytics.types';

export const AnalyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    try {
      const res = await apiClient.get('/api/v1/analytics');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  getAttendanceTrend: async (): Promise<AnalyticsDataPoint[]> => {
    try {
      const res = await apiClient.get('/api/v1/analytics');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getTopPrograms: async (): Promise<AnalyticsDimension[]> => {
    try {
      const res = await apiClient.get('/api/v1/analytics');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
