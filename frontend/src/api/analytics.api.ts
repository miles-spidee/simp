import { AnalyticsSummary, AnalyticsDataPoint, AnalyticsDimension } from '../types/analytics.types';
import { MOCK_ANALYTICS_SUMMARY, MOCK_ATTENDANCE_TREND, MOCK_TOP_PROGRAMS } from '../data/mock-analytics';

export const AnalyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ANALYTICS_SUMMARY), 600));
  },
  getAttendanceTrend: async (): Promise<AnalyticsDataPoint[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ATTENDANCE_TREND), 600));
  },
  getTopPrograms: async (): Promise<AnalyticsDimension[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_TOP_PROGRAMS), 600));
  }
};
