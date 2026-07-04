export type Role = 'Mentor' | 'College Coordinator' | 'Super Admin';

export interface Student {
  id: string;
  name: string;
  photo: string;
  college: string;
  department: string;
  program: string;
  batch: string;
  mentor: string;
  reportingManager: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Assessment {
  id: string;
  name: string;
  program: string;
  batch: string;
  assignedStudents: number;
  completedAttempts: number;
  pendingAttempts: number;
  averageScore: number;
  passPercentage: number;
  duration: number; // in minutes
  status: 'Active' | 'Completed' | 'Upcoming';
  createdBy: string;
  createdDate: string;
}

export interface StudentAssessment {
  id: string;
  studentId: string;
  assessmentId: string;
  studentName: string;
  college: string;
  program: string;
  assessmentName: string;
  attempt: number;
  score: number;
  percentage: number;
  rank: number;
  passStatus: 'Pass' | 'Fail';
  completionTime: number; // in minutes
  status: 'Completed' | 'Pending' | 'Late Submission';
  dateCompleted?: string;
  sections: {
    name: string;
    score: number;
    max: number;
  }[];
  questions: {
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    marksAwarded: number;
    timeTaken: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    explanation: string;
  }[];
}

export interface DashboardStats {
  mentor: {
    assignedStudents: number;
    activeAssessments: number;
    completedAssessments: number;
    pendingAttempts: number;
    averageScore: number;
    passRate: number;
    highestScore: number;
    lowestScore: number;
    avgCompletionTime: number;
    studentsAtRisk: number;
  };
  coordinator: {
    collegeStudents: number;
    activeAssessments: number;
    completedAssessments: number;
    averageCollegeScore: number;
    collegePassRate: number;
    topPerformingBatch: string;
    weakestBatch: string;
    studentsPending: number;
    highestScorer: string;
    lowestScorer: string;
  };
  admin: {
    totalAssessments: number;
    totalAttempts: number;
    activeExams: number;
    platformAverage: number;
    overallPassRate: number;
    totalStudents: number;
    topPerformingCollege: string;
    weakestCollege: string;
    highestScore: number;
    lowestScore: number;
  };
}
