export interface AnalyticsDataPoint {
  date: string;
  value: number;
  category?: string;
}

export interface AnalyticsSummary {
  totalStudents: number;
  activeInterns: number;
  completionRate: number;
  attendanceRate: number;
  averageScore: number;
  placementRate: number;
  revenue: number;
  certificatesIssued: number;
}

export interface AnalyticsDimension {
  id: string;
  name: string;
  value: number;
  percentage?: number;
}
