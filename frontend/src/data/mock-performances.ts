export interface Performance {
  id: string;
  studentId: string;
  batchId: string;
  overallScore: number;
  attendancePercentage: number;
  taskCompletionRate: number;
  lastUpdated: string;
}

export const MOCK_PERFORMANCES: Performance[] = [];
