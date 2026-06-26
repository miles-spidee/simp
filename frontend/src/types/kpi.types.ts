export interface KPIMetric {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  trendPercentage: number;
  status: 'on_track' | 'at_risk' | 'behind';
  lastUpdated: string;
}
