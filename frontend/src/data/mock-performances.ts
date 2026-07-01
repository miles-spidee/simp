export interface Performance {
  id: string;
  studentId: string;
  batchId: string;
  overallScore: number;
  attendancePercentage: number;
  taskCompletionRate: number;
  lastUpdated: string;
}

export const MOCK_PERFORMANCES: Performance[] = [
  { id: 'perf-1', studentId: 'stu-1', batchId: 'batch-1', overallScore: 88, attendancePercentage: 95, taskCompletionRate: 90, lastUpdated: '2023-11-01' },
  { id: 'perf-2', studentId: 'stu-2', batchId: 'batch-3', overallScore: 72, attendancePercentage: 80, taskCompletionRate: 75, lastUpdated: '2023-06-15' },
];
