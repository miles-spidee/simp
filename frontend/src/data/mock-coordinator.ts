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

export const MOCK_BATCH_PERFORMANCE: BatchPerformance[] = [
  { batchId: 'B-2023-FA-01', program: 'Full Stack Engineering', studentCount: 25, avgScore: 82.5, status: 'On Track' },
  { batchId: 'B-2023-FA-02', program: 'AI/ML Specialization', studentCount: 18, avgScore: 71.0, status: 'At Risk' },
  { batchId: 'B-2023-SP-01', program: 'Cloud DevOps', studentCount: 22, avgScore: 89.0, status: 'On Track' }
];
