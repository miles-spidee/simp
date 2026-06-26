import { InsightForecast, StudentRisk } from '../types/insight.types';

export const MOCK_FORECASTS: InsightForecast[] = [
  { id: 'fc_1', metric: 'Next Quarter Revenue', historicalValues: [10, 11, 11.5, 12.5], predictedValues: [13.2, 14.1, 15.0], confidence: 85 },
  { id: 'fc_2', metric: 'Expected Placements', historicalValues: [400, 450, 500, 600], predictedValues: [650, 720, 800], confidence: 92 },
];

export const MOCK_STUDENT_RISKS: StudentRisk[] = Array.from({ length: 50 }).map((_, i) => ({
  studentId: `std_${i + 1}`,
  name: `Student ${i + 1}`,
  program: 'Full Stack Web Development',
  riskScore: Math.floor(Math.random() * 40) + 60, // 60-100
  factors: ['Low Attendance', 'Missed Assessments']
})).sort((a, b) => b.riskScore - a.riskScore);
