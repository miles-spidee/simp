import { AnalyticsApi } from '../api/analytics.api';

export const AnalyticsService = {
  getDashboardData: async () => {
    const [summary, attendanceTrend, topPrograms] = await Promise.all([
      AnalyticsApi.getSummary(),
      AnalyticsApi.getAttendanceTrend(),
      AnalyticsApi.getTopPrograms()
    ]);
    return { summary, attendanceTrend, topPrograms };
  }
};
