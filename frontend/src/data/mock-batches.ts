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

export const MOCK_BATCHES: Batch[] = [
  {
    id: 'batch-001',
    name: 'Summer 2026 Engineering Cohort',
    code: 'B-ENG-26',
    programId: 'prog-1',
    programName: 'Software Engineering',
    internshipType: 'Paid Internship',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    capacity: 50,
    status: 'Active',
    completionRate: 85,
    students: [
      { id: 'st-001', name: 'Student 1', internId: 'INT-001', college: 'Stanford University', department: 'CS', performanceScore: 92, status: 'Active' },
      { id: 'st-002', name: 'Student 2', internId: 'INT-002', college: 'MIT', department: 'IT', performanceScore: 88, status: 'Active' },
      { id: 'st-003', name: 'Student 3', internId: 'INT-003', college: 'Stanford University', department: 'SE', performanceScore: 95, status: 'Active' },
      { id: 'st-021', name: 'Student 21', internId: 'INT-021', college: 'IIT Madras', department: 'ECE', performanceScore: 89, status: 'Active' },
    ],
    mentor: {
      id: 'm-01', name: 'Alice Mentor', department: 'Engineering', expertise: 'Fullstack', rating: 4.8, sessionsConducted: 12, studentSatisfaction: 4.9, successRate: 98, completionContribution: 100
    },
    projects: [],
    performance: {
      attendanceRate: 95, assessmentAverage: 90, placementConversion: 80, satisfactionScore: 4.5,
      attendanceTrend: [], assessmentTrend: [], performanceTrend: [], completionTrend: []
    },
    metadata: {
      type: 'Technical', category: 'Engineering', domain: 'Web', techStack: ['React', 'Python'], tags: [], priority: 'High', academicYear: '2026'
    },
    timeline: []
  }
];
