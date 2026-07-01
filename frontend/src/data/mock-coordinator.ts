export interface CoordinatorStats {
  totalStudents: number;
  activeBatches: number;
  averageAttendance: number;
  pendingAssessments: number;
}

export interface BatchPerformance {
  batchId: string;
  program: string;
  studentCount: number;
  avgScore: number;
  status: 'On Track' | 'At Risk' | 'Completed';
}

export const MOCK_COORDINATOR_STATS: CoordinatorStats = {
  totalStudents: 145,
  activeBatches: 6,
  averageAttendance: 88.5,
  pendingAssessments: 12
};

export const MOCK_BATCH_PERFORMANCE: BatchPerformance[] = [];
