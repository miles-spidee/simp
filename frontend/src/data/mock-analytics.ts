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

export const MOCK_TOP_PROGRAMS: AnalyticsDimension[] = [
  { id: 'prog_1', name: 'Full Stack Web Development', value: 4500, percentage: 36 },
  { id: 'prog_2', name: 'Data Science & AI', value: 3200, percentage: 25.6 },
  { id: 'prog_3', name: 'Cloud Computing', value: 2800, percentage: 22.4 },
  { id: 'prog_4', name: 'Cyber Security', value: 2000, percentage: 16 }
];
