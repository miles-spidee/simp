import { AnalyticsDataPoint, AnalyticsSummary, AnalyticsDimension } from '../types/analytics.types';

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalStudents: 12500,
  activeInterns: 4200,
  completionRate: 94.5,
  attendanceRate: 88.2,
  averageScore: 82.4,
  placementRate: 76.8,
  revenue: 12500000,
  certificatesIssued: 8300
};

export const MOCK_ATTENDANCE_TREND: AnalyticsDataPoint[] = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (30 - i));
  return {
    date: d.toISOString().split('T')[0],
    value: 80 + Math.random() * 15
  };
});

export const MOCK_TOP_PROGRAMS: AnalyticsDimension[] = [];
