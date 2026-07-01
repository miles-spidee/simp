export interface BatchStudent {
  id: string;
  name: string;
  internId: string;
  college: string;
  department: string;
  performanceScore: number;
  status: 'Active' | 'Completed' | 'Dropped';
}

export interface BatchMentor {
  id: string;
  name: string;
  department: string;
  expertise: string;
  rating: number; // out of 5
  sessionsConducted: number;
  studentSatisfaction: number; // out of 5
  successRate: number; // percentage
  completionContribution: number; // percentage
}

export interface BatchProject {
  name: string;
  submissionRate: number; // percentage
  evaluationStatus: 'Pending' | 'Ongoing' | 'Completed';
}

export interface BatchPerformance {
  attendanceRate: number; // percentage
  assessmentAverage: number; // out of 100
  placementConversion: number; // percentage
  satisfactionScore: number; // out of 5
  attendanceTrend: { week: string; rate: number }[];
  assessmentTrend: { test: string; average: number }[];
  performanceTrend: { month: string; score: number }[];
  completionTrend: { cohort: string; rate: number }[];
}

export interface BatchMetadata {
  type: string;
  category: string;
  domain: string;
  techStack: string[];
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  academicYear: string;
}

export interface BatchTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'create' | 'mentor' | 'student' | 'capacity' | 'start' | 'assessment' | 'cert' | 'complete' | 'info';
}

export interface Batch {
  id: string;
  name: string;
  code: string;
  programId: string;
  programName: string;
  internshipType: 'Free Internship' | 'Paid Internship' | 'Stipend Internship' | 'Industrial Internship' | 'Research Internship' | 'Corporate Internship';
  startDate: string;
  endDate: string;
  capacity: number;
  status: 'Draft' | 'Upcoming' | 'Enrollment Open' | 'Active' | 'On Hold' | 'Completed' | 'Archived';
  completionRate: number; // percentage
  students: BatchStudent[];
  mentor: BatchMentor;
  projects: BatchProject[];
  performance: BatchPerformance;
  metadata: BatchMetadata;
  timeline: BatchTimelineEvent[];
}