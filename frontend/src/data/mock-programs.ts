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
    id: 'prog-1',
    title: 'Summer Software Engineering Internship',
    code: 'SEI-2023',
    durationWeeks: 12,
    organizationId: 'org-1', // Stanford University
    status: 'Active',
    type: 'Stipend Internship',
    startDate: '2026-05-15',
    endDate: '2026-08-15',
    studentsEnrolled: 650,
    mentorsAssigned: 4,
    completionRate: 96,
    description: 'A structured summer internship program focused on full-stack application development, agile pipelines, cloud hosting, and robust software engineering practices.',
    capacity: 700,
    eligibility: '3rd and 4th year CSE/ECE students with basic JavaScript & DS knowledge.',
    curriculum: [
      {
        name: 'Module 1: Advanced Frontend with React',
        topics: ['React Hooks', 'State Management (Redux/Zustand)', 'Performance Optimization', 'Tailwind CSS Layouts'],
        learningOutcomes: ['Build reactive client portals', 'Implement responsive components and grids'],
        assessments: ['Frontend Framework Quiz'],
        assignments: ['Responsive ERP Dashboard Build'],
        projects: ['SaaS Analytics Portal']
      },
      {
        name: 'Module 2: Server Architecture with Node & NestJS',
        topics: ['REST APIs', 'PostgreSQL Relationships', 'JWT Security Authentication', 'Middleware & Interceptors'],
        learningOutcomes: ['Design production-ready backends', 'Handle relational SQL schemas'],
        assessments: ['Backend System Test'],
        assignments: ['Task Manager API Server'],
        projects: ['ERP Pipeline Controller Node']
      }
    ],
    enrollments: [
      { id: 'STU-1001', name: 'Alice Freeman', college: 'Stanford University', department: 'Computer Science', enrollmentDate: '2026-05-01', attendance: 98, performance: 94, status: 'Approved' },
      { id: 'STU-1002', name: 'Bob Johnson', college: 'Stanford University', department: 'Computer Science', enrollmentDate: '2026-05-02', attendance: 95, performance: 88, status: 'Approved' },
      { id: 'STU-1005', name: 'Charlie Miller', college: 'Stanford University', department: 'Electrical Engineering', enrollmentDate: '2026-05-05', attendance: 92, performance: 78, status: 'Approved' }
    ],
    mentors: [
      { id: 'emp-2', name: 'Bob Johnson', department: 'Engineering', assignedStudents: 15, sessionsConducted: 8, rating: 4.8, successRate: 96, satisfaction: 4.9, completionContribution: 98 },
      { id: 'emp-3', name: 'Diana Prince', department: 'Academics', assignedStudents: 10, sessionsConducted: 4, rating: 4.5, successRate: 92, satisfaction: 4.4, completionContribution: 90 }
    ],
    analytics: {
      completionRate: 96,
      attendanceRate: 98,
      avgScore: 92,
      placementRate: 95,
      satisfactionScore: 4.8,
      enrollmentTrend: [
        { month: 'Mar', count: 120 },
        { month: 'Apr', count: 350 },
        { month: 'May', count: 650 }
      ],
      completionTrend: [
        { year: '2024', rate: 94 },
        { year: '2025', rate: 95 }
      ],
      attendanceTrend: [
        { week: 'Wk 1', rate: 99 },
        { week: 'Wk 2', rate: 98 },
        { week: 'Wk 3', rate: 98 }
      ],
      assessmentPerformance: [
        { testName: 'React Framework Quiz', avgScore: 90 },
        { testName: 'Backend System Test', avgScore: 88 }
      ]
    },
    certifications: {
      generated: 620,
      issued: 600,
      pending: 20,
      list: [
        { id: 'CERT-STAN-01', studentName: 'Alice Freeman', issueDate: '2026-08-15', status: 'Pending' }
      ]
    },
    metadata: {
      category: 'Software Engineering',
      level: 'Advanced',
      domain: 'Web Development',
      tags: ['React', 'NodeJS', 'ERP', 'SaaS'],
      techStack: ['TypeScript', 'NextJS', 'NestJS', 'PostgreSQL'],
      skills: ['Frontend Engineering', 'Backend Design', 'Database Queries', 'REST APIs'],
      certType: 'Co-branded Institutional Certificate'
    },
    timeline: [
      { date: '2026-04-01', title: 'Program Created', description: 'Summer Internship draft program created.', type: 'created' },
      { date: '2026-04-15', title: 'Curriculum Published', description: 'All-module curriculum published for public enrollment.', type: 'curriculum' },
      { date: '2026-05-01', title: 'Enrollment Opened', description: 'Registration links dispatched to Stanford University.', type: 'enrollment' }
    ]
  },
  {
    id: 'prog-2',
    title: 'Product Management Fellowship',
    code: 'PMF-2024',
    durationWeeks: 24,
    organizationId: 'org-2', // MIT
    status: 'Draft',
    type: 'Corporate Sponsored',
    startDate: '2026-09-01',
    endDate: '2027-02-28',
    studentsEnrolled: 0,
    mentorsAssigned: 1,
    completionRate: 0,
    description: 'Structured leadership and product design cohort mapping competitive analytics, customer development, GTM strategist tools, and product specs.',
    capacity: 100,
    eligibility: 'MBA or Senior Graduate Engineering students with project experience.',
    curriculum: [
      {
        name: 'Module 1: Customer Discovery & Specs',
        topics: ['User Interviews', 'Hypothesis Drafting', 'PRD Building', 'Wireframing'],
        learningOutcomes: ['Write standard PRDs', 'Outline user personas'],
        assessments: ['Customer Discovery Check'],
        assignments: ['PRD Writing Exercise'],
        projects: ['Product Redesign PRD']
      }
    ],
    enrollments: [],
    mentors: [
      { id: 'emp-1', name: 'Charlie Davis', department: 'Management', assignedStudents: 0, sessionsConducted: 0, rating: 4.6, successRate: 0, satisfaction: 4.5, completionContribution: 0 }
    ],
    analytics: {
      completionRate: 0,
      attendanceRate: 0,
      avgScore: 0,
      placementRate: 0,
      satisfactionScore: 4.6,
      enrollmentTrend: [],
      completionTrend: [],
      attendanceTrend: [],
      assessmentPerformance: []
    },
    certifications: {
      generated: 0,
      issued: 0,
      pending: 0,
      list: []
    },
    metadata: {
      category: 'Product Management',
      level: 'Intermediate',
      domain: 'Strategy & Growth',
      tags: ['PRD', 'User Research', 'GTM', 'Agile'],
      techStack: ['Figma', 'Jira', 'Notion', 'Productboard'],
      skills: ['Product Discovery', 'Roadmapping', 'Agile Scrum', 'Analytical Thinking'],
      certType: 'Corporate Sponsored Fellowship'
    },
    timeline: [
      { date: '2026-06-01', title: 'Program Created', description: 'Product fellowship draft registered.', type: 'created' }
    ]
  },
  {
    id: 'prog-3',
    title: 'Sales Boot Camp',
    code: 'SBC-101',
    durationWeeks: 4,
    organizationId: 'org-3', // UC Berkeley
    status: 'Completed',
    type: 'Free Internship',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    studentsEnrolled: 150,
    mentorsAssigned: 1,
    completionRate: 92,
    description: 'High density sales boot camp teaching modern CRM tools, client relationship strategy, cold emailing hacks, and GTM cycles.',
    capacity: 200,
    eligibility: 'Open enrollment to all departments.',
    curriculum: [
      {
        name: 'Module 1: CRM & Email Cycles',
        topics: ['HubSpot CRM usage', 'Cold email drafting', 'Pitching techniques'],
        learningOutcomes: ['Use HubSpot pipelines', 'Handle client queries'],
        assessments: ['Mock Sales Call'],
        assignments: ['Cold Email Sequence'],
        projects: ['CRM Pipeline Optimization']
      }
    ],
    enrollments: [
      { id: 'STU-3001', name: 'George Green', college: 'UC Berkeley', department: 'Computer Science', enrollmentDate: '2026-02-15', attendance: 95, performance: 90, status: 'Approved' }
    ],
    mentors: [
      { id: 'emp-3', name: 'Diana Prince', department: 'Sales', assignedStudents: 150, sessionsConducted: 4, rating: 4.4, successRate: 92, satisfaction: 4.3, completionContribution: 94 }
    ],
    analytics: {
      completionRate: 92,
      attendanceRate: 96,
      avgScore: 85,
      placementRate: 80,
      satisfactionScore: 4.4,
      enrollmentTrend: [
        { month: 'Jan', count: 30 },
        { month: 'Feb', count: 150 }
      ],
      completionTrend: [
        { year: '2026', rate: 92 }
      ],
      attendanceTrend: [
        { week: 'Wk 1', rate: 98 },
        { week: 'Wk 2', rate: 96 }
      ],
      assessmentPerformance: [
        { testName: 'Mock Sales Call', avgScore: 85 }
      ]
    },
    certifications: {
      generated: 138,
      issued: 138,
      pending: 0,
      list: [
        { id: 'CERT-UCB-01', studentName: 'George Green', issueDate: '2026-03-31', status: 'Issued' }
      ]
    },
    metadata: {
      category: 'Sales & BD',
      level: 'Beginner',
      domain: 'Sales Operations',
      tags: ['Sales', 'CRM', 'HubSpot', 'Cold Outreach'],
      techStack: ['HubSpot', 'Salesforce', 'Apollo.io', 'Loom'],
      skills: ['Lead Generation', 'CRM Pipelines', 'Pitching', 'Negotiation'],
      certType: 'Sales Operations Academy Certificate'
    },
    timeline: [
      { date: '2026-02-01', title: 'Program Created', description: 'Roster initialized.', type: 'created' },
      { date: '2026-03-01', title: 'Enrollment Opened', description: 'Class opened.', type: 'enrollment' },
      { date: '2026-03-31', title: 'Program Closed', description: 'Certificates generated and issued.', type: 'close' }
    ]
  },
  {
    id: 'prog-4',
    title: 'Pinesphere Global Leadership',
    code: 'PGL-24',
    durationWeeks: 52,
    organizationId: 'org-1', // Stanford University
    status: 'Active',
    type: 'Corporate Sponsored',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    studentsEnrolled: 80,
    mentorsAssigned: 2,
    completionRate: 98,
    description: 'Selective executive leadership program preparing high potential senior interns for fast track technology management roles.',
    capacity: 100,
    eligibility: 'Direct recommendation by VP of Technology and senior mentors.',
    curriculum: [
      {
        name: 'Module 1: Technical Leadership',
        topics: ['System Design Scale', 'Team Dynamics', 'Grooming talent'],
        learningOutcomes: ['Design distributed databases', 'Lead agile standups'],
        assessments: ['System Design Review'],
        assignments: ['Architectural Blueprint'],
        projects: ['PineSphere ERP Migration plan']
      }
    ],
    enrollments: [
      { id: 'STU-1001', name: 'Alice Freeman', college: 'Stanford University', department: 'Computer Science', enrollmentDate: '2025-12-10', attendance: 100, performance: 98, status: 'Approved' }
    ],
    mentors: [
      { id: 'emp-1', name: 'Charlie Davis', department: 'Leadership', assignedStudents: 40, sessionsConducted: 12, rating: 4.9, successRate: 98, satisfaction: 4.9, completionContribution: 100 }
    ],
    analytics: {
      completionRate: 98,
      attendanceRate: 99,
      avgScore: 95,
      placementRate: 100,
      satisfactionScore: 4.9,
      enrollmentTrend: [
        { month: 'Nov', count: 10 },
        { month: 'Dec', count: 80 }
      ],
      completionTrend: [
        { year: '2025', rate: 98 }
      ],
      attendanceTrend: [
        { week: 'Wk 1', rate: 100 },
        { week: 'Wk 2', rate: 99 }
      ],
      assessmentPerformance: [
        { testName: 'System Design Review', avgScore: 95 }
      ]
    },
    certifications: {
      generated: 78,
      issued: 70,
      pending: 8,
      list: [
        { id: 'CERT-STAN-PGL', studentName: 'Alice Freeman', issueDate: '2026-12-31', status: 'Pending' }
      ]
    },
    metadata: {
      category: 'Leadership',
      level: 'Advanced',
      domain: 'Technology Management',
      tags: ['Scale', 'VP Tech', 'Grooming', 'ERP'],
      techStack: ['Draw.io', 'Slack', 'Jira Enterprise', 'Miro'],
      skills: ['Distributed Systems', 'Engineering Leadership', 'Strategic Planning', 'Agile Scale'],
      certType: 'PineSphere Executive Leadership Credential'
    },
    timeline: [
      { date: '2025-12-01', title: 'Program Created', description: 'PGL cohort designed.', type: 'created' }
    ]
  }
];
