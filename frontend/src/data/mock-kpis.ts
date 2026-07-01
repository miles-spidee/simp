import { KPIMetric } from '../types/kpi.types';

export const MOCK_KPIS: KPIMetric[] = [
  { id: 'kpi_1', name: 'Overall Attendance Rate', category: 'Attendance', currentValue: 88.5, targetValue: 90, unit: '%', trend: 'up', trendPercentage: 2.5, status: 'on_track', lastUpdated: new Date().toISOString() },
  { id: 'kpi_2', name: 'Placement Success Rate', category: 'Placement', currentValue: 76.8, targetValue: 80, unit: '%', trend: 'up', trendPercentage: 5.2, status: 'on_track', lastUpdated: new Date().toISOString() },
  { id: 'kpi_3', name: 'Revenue Target', category: 'Finance', currentValue: 12.5, targetValue: 15, unit: 'M', trend: 'up', trendPercentage: 8.4, status: 'on_track', lastUpdated: new Date().toISOString() },
  { id: 'kpi_4', name: 'Student Dropout Rate', category: 'Retention', currentValue: 4.2, targetValue: 3.0, unit: '%', trend: 'down', trendPercentage: -0.5, status: 'at_risk', lastUpdated: new Date().toISOString() },
  { id: 'kpi_5', name: 'Average Assessment Score', category: 'Performance', currentValue: 72.4, targetValue: 75, unit: '%', trend: 'flat', trendPercentage: 0.1, status: 'behind', lastUpdated: new Date().toISOString() },
];
