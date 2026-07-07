export interface CurriculumModule {
  name: string;
  topics: string[];
  learningOutcomes: string[];
  assessments: string[];
  assignments: string[];
  projects: string[];
}

export interface ProgramEnrollment {
  id: string;
  name: string;
  college: string;
  department: string;
  enrollmentDate: string;
  attendance: number; // percentage
  performance: number; // score out of 100
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ProgramMentor {
  id: string;
  name: string;
  department: string;
  assignedStudents: number;
  sessionsConducted: number;
  rating: number; // out of 5
  successRate: number; // percentage
  satisfaction: number; // out of 5
  completionContribution: number; // percentage
}

export interface ProgramAnalytics {
  completionRate: number;
  attendanceRate: number;
  avgScore: number;
  placementRate: number;
  satisfactionScore: number;
  enrollmentTrend: { month: string; count: number }[];
  completionTrend: { year: string; rate: number }[];
  attendanceTrend: { week: string; rate: number }[];
  assessmentPerformance: { testName: string; avgScore: number }[];
}

export interface CertificationStats {
  generated: number;
  issued: number;
  pending: number;
  list: { id: string; studentName: string; issueDate: string; status: 'Issued' | 'Pending' | 'Revoked' }[];
}

export interface ProgramMetadata {
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  domain: string;
  tags: string[];
  techStack: string[];
  skills: string[];
  certType: string;
}

export interface ProgramTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'created' | 'curriculum' | 'enrollment' | 'mentor' | 'assessment' | 'cert' | 'close' | 'update';
}

export interface Program {
  id: string;
  title: string; // Course Name / Program Title (compatible with batch/page.tsx)
  code: string;
  durationWeeks: number;
  organizationId: string; // Associated college/org
  status: 'Draft' | 'Upcoming' | 'Open Enrollment' | 'Active' | 'Completed' | 'Archived' | 'Suspended';
  
  type: 'Free Internship' | 'Paid Internship' | 'Stipend Internship' | 'Industrial Training' | 'Research Program' | 'Corporate Sponsored' | 'Placement Prep';
  startDate: string;
  endDate: string;
  studentsEnrolled: number;
  mentorsAssigned: number;
  completionRate: number;
  
  // Tab 1: Overview
  description: string;
  capacity: number;
  eligibility: string;
  
  // Tab 2: Curriculum Modules
  curriculum: CurriculumModule[];
  
  // Tab 4: Enrollments
  enrollments: ProgramEnrollment[];
  
  // Tab 5: Mentors
  mentors: ProgramMentor[];
  
  // Tab 6: Performance Analytics
  analytics: ProgramAnalytics;
  
  // Tab 7: Certifications
  certifications: CertificationStats;
  
  // Tab 8: Metadata
  metadata: ProgramMetadata;
  
  // Tab 9: Timeline
  timeline: ProgramTimelineEvent[];
}

export const MOCK_PROGRAMS: Program[] = [
  {
    id: 'prog-full-stack',
    title: 'Full Stack Engineering',
    code: 'FSE101',
    durationWeeks: 12,
    organizationId: 'ORG-001',
    status: 'Active',
    type: 'Free Internship',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    studentsEnrolled: 45,
    mentorsAssigned: 3,
    completionRate: 92,
    description: 'Comprehensive bootcamp covering React, Node, SQL, and DevOps.',
    capacity: 100,
    eligibility: 'All Students',
    curriculum: [],
    enrollments: [],
    mentors: [],
    analytics: {
      completionRate: 92,
      attendanceRate: 95,
      avgScore: 84,
      placementRate: 88,
      satisfactionScore: 4.7,
      enrollmentTrend: [],
      completionTrend: [],
      attendanceTrend: [],
      assessmentPerformance: []
    },
    certifications: { generated: 12, issued: 12, pending: 0, list: [] },
    metadata: { category: 'Software Development', level: 'Intermediate', domain: 'CS', tags: ['React', 'Node'], techStack: [], skills: [], certType: 'Degree' },
    timeline: []
  },
  {
    id: 'prog-data-science',
    title: 'Data Science & Analytics',
    code: 'DSA202',
    durationWeeks: 16,
    organizationId: 'ORG-001',
    status: 'Active',
    type: 'Paid Internship',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    studentsEnrolled: 30,
    mentorsAssigned: 2,
    completionRate: 88,
    description: 'Python, statistics, machine learning algorithms and visual modeling.',
    capacity: 60,
    eligibility: 'All Students',
    curriculum: [],
    enrollments: [],
    mentors: [],
    analytics: {
      completionRate: 88,
      attendanceRate: 92,
      avgScore: 81,
      placementRate: 82,
      satisfactionScore: 4.5,
      enrollmentTrend: [],
      completionTrend: [],
      attendanceTrend: [],
      assessmentPerformance: []
    },
    certifications: { generated: 8, issued: 8, pending: 0, list: [] },
    metadata: { category: 'Data Science', level: 'Advanced', domain: 'Math/CS', tags: ['Python', 'Pandas'], techStack: [], skills: [], certType: 'Degree' },
    timeline: []
  },
  {
    id: 'prog-ui-ux',
    title: 'UI/UX Design Bootcamp',
    code: 'UIUX303',
    durationWeeks: 8,
    organizationId: 'ORG-002',
    status: 'Active',
    type: 'Free Internship',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    studentsEnrolled: 25,
    mentorsAssigned: 1,
    completionRate: 95,
    description: 'Wireframing, Figma components, typography, design systems, and heuristics.',
    capacity: 50,
    eligibility: 'All Students',
    curriculum: [],
    enrollments: [],
    mentors: [],
    analytics: {
      completionRate: 95,
      attendanceRate: 96,
      avgScore: 90,
      placementRate: 90,
      satisfactionScore: 4.8,
      enrollmentTrend: [],
      completionTrend: [],
      attendanceTrend: [],
      assessmentPerformance: []
    },
    certifications: { generated: 5, issued: 5, pending: 0, list: [] },
    metadata: { category: 'Design', level: 'Beginner', domain: 'Art/CS', tags: ['Figma', 'Prototyping'], techStack: [], skills: [], certType: 'Degree' },
    timeline: []
  }
];
