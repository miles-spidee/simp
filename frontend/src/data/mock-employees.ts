export interface EmployeeDocument {
  type: string;
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  version: string;
  previewContent?: string;
}

export interface EmployeeAttendance {
  presentDays: number;
  absentDays: number;
  lateArrivals: number;
  totalHours: number;
}

export interface EmployeeLeave {
  available: number;
  used: number;
  pending: number;
  approved: number;
}

export interface MentorMetrics {
  assignedInterns: number;
  assignedEmployees: number;
  activeProjects: number;
  trainingSessions: number;
  interns: { id: string; name: string; batch: string }[];
  employees: { id: string; name: string; department: string }[];
  batchInfo: string;
  successRate: number; // percentage
  trainingHours: number;
  avgRating: number; // out of 5
  retentionRate: number; // percentage
}

export interface AccessControl {
  role: string;
  permissions: string[];
  moduleAccess: string[];
  securityPolicies: string[];
}

export interface AuditTrailEntry {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  details: string;
}

export interface PerformanceMetric {
  productivity: number; // out of 100
  communication: number; // out of 100
  leadership: number; // out of 100
  technical: number; // out of 100
  attendance: number; // out of 100
  learningProgress: number; // out of 100
}

export interface PerformanceRatingTrend {
  month: string;
  rating: number; // out of 5
}

export interface PerformanceReview {
  reviewerName: string;
  role: 'Manager' | 'Mentor' | 'Self' | 'HR';
  score: number;
  comment: string;
  date: string;
}

export interface EmployeeProject {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
  score: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'onboarding' | 'promotion' | 'transfer' | 'document' | 'mentor' | 'review' | 'status' | 'training';
}

export interface Employee {
  id: string;
  userId: string;
  organizationId: string;
  designation: string;
  joinDate: string;
  status: 'Active' | 'Probation' | 'Training' | 'On Leave' | 'Suspended' | 'Notice Period' | 'Resigned' | 'Terminated' | 'Inactive';
  managerId?: string;
  mentorId?: string;
  
  // Extra detailed profile fields
  name: string;
  email: string;
  avatar: string;
  roleName: string;
  
  // Tab 1: Personal Info
  phone: string;
  dob: string;
  gender: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  location: string;
  experienceLevel: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Director';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Training';
  
  // Tab 2: Documents Center
  documents: EmployeeDocument[];
  
  // Tab 3: HR Operations
  salaryGrade: string;
  band: string;
  shift: string;
  attendance: EmployeeAttendance;
  leave: EmployeeLeave;
  
  // Tab 4: Mentor Management
  mentorMetrics?: MentorMetrics;
  
  // Tab 5: Access & Admin
  accessControl?: AccessControl;
  auditTrail?: AuditTrailEntry[];
  
  // Tab 6: Performance Center
  performanceMetrics?: PerformanceMetric;
  performanceTrend?: PerformanceRatingTrend[];
  performanceReviews?: PerformanceReview[];
  
  // Tab 7: Projects
  projects?: EmployeeProject[];
  
  // Tab 8: Timeline
  timeline: TimelineEvent[];
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    userId: '3',
    organizationId: 'org-1',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    avatar: 'CD',
    roleName: 'HR',
    designation: 'Senior HR Manager',
    joinDate: '2022-01-15',
    status: 'Active',
    phone: '+1 (555) 019-2834',
    dob: '1988-04-12',
    gender: 'Male',
    address: '452 Pine Heights Blvd, SF, CA',
    emergencyContact: {
      name: 'Sarah Davis',
      relation: 'Spouse',
      phone: '+1 (555) 019-2835'
    },
    location: 'San Francisco, CA',
    experienceLevel: 'Director',
    employmentType: 'Full-time',
    documents: [
      { type: 'Offer Letter', name: 'offer_letter_charlie.pdf', uploadDate: '2022-01-02', status: 'Verified', verifiedBy: 'System Admin', version: 'v1.0' },
      { type: 'NDA', name: 'nda_charlie_signed.pdf', uploadDate: '2022-01-15', status: 'Verified', verifiedBy: 'System Admin', version: 'v1.0' },
      { type: 'Employment Agreement', name: 'employment_agreement_charlie.pdf', uploadDate: '2022-01-15', status: 'Verified', verifiedBy: 'System Admin', version: 'v1.1' }
    ],
    salaryGrade: 'Grade 9',
    band: 'Band E2',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 240, absentDays: 5, lateArrivals: 2, totalHours: 1920 },
    leave: { available: 15, used: 10, pending: 1, approved: 10 },
    accessControl: {
      role: 'HR Admin',
      permissions: ['Manage Users', 'View Dashboard', 'Edit Employee Records', 'Approve Leaves', 'Initiate Exit'],
      moduleAccess: ['Employee Directory', 'HR Operations', 'Leave Tracker', 'Performance Center'],
      securityPolicies: ['2FA Enabled', 'IP Restricted Access']
    },
    auditTrail: [
      { id: 'aud-101', date: '2026-06-15 10:24', action: 'Leave Approval', performedBy: 'Charlie Davis', details: 'Approved leave for Alice Freeman (emp-4)' },
      { id: 'aud-102', date: '2026-06-10 14:15', action: 'Document Verification', performedBy: 'Charlie Davis', details: 'Verified Degree certificate for Alice Freeman (emp-4)' }
    ],
    performanceMetrics: { productivity: 94, communication: 96, leadership: 90, technical: 75, attendance: 98, learningProgress: 88 },
    performanceTrend: [
      { month: 'Jan', rating: 4.5 },
      { month: 'Feb', rating: 4.6 },
      { month: 'Mar', rating: 4.7 },
      { month: 'Apr', rating: 4.7 },
      { month: 'May', rating: 4.8 },
      { month: 'Jun', rating: 4.8 }
    ],
    performanceReviews: [
      { reviewerName: 'System Admin', role: 'Manager', score: 4.8, comment: 'Charlie runs the HR department flawlessly. Incredible organization.', date: '2025-12-15' },
      { reviewerName: 'Diana Prince', role: 'HR', score: 4.7, comment: 'Great collaborator and handles people issues with high emotional intelligence.', date: '2025-12-01' }
    ],
    projects: [
      { name: 'Global ERP Migration', role: 'HR Lead', startDate: '2024-01-01', endDate: '2024-06-30', status: 'Completed', score: 95 },
      { name: 'Workforce Restructuring Q3', role: 'Coordinator', startDate: '2025-07-01', endDate: '2025-09-30', status: 'Completed', score: 92 }
    ],
    timeline: [
      { date: '2022-01-15', title: 'Joined Organization', description: 'Charlie Davis joined as Senior HR Manager.', type: 'onboarding' },
      { date: '2022-01-18', title: 'Completed Onboarding', description: 'Completed standard HR and security onboarding flow.', type: 'onboarding' },
      { date: '2023-01-15', title: 'Annual Performance Review', description: 'Rated 4.7/5. Outstanding leadership skills noted.', type: 'review' }
    ]
  },
  {
    id: 'emp-2',
    userId: '2',
    organizationId: 'org-2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'BJ',
    roleName: 'Mentor',
    designation: 'Engineering Mentor',
    joinDate: '2023-03-10',
    status: 'Active',
    managerId: 'emp-1',
    phone: '+1 (555) 014-9922',
    dob: '1990-11-23',
    gender: 'Male',
    address: '889 Silicon Valley Rd, San Jose, CA',
    emergencyContact: {
      name: 'Linda Johnson',
      relation: 'Mother',
      phone: '+1 (555) 014-9923'
    },
    location: 'San Jose, CA',
    experienceLevel: 'Senior',
    employmentType: 'Full-time',
    documents: [
      { type: 'Offer Letter', name: 'offer_letter_bob.pdf', uploadDate: '2023-02-20', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'NDA', name: 'nda_bob.pdf', uploadDate: '2023-03-10', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'Degree Certificates', name: 'mtech_degree_bob.pdf', uploadDate: '2023-03-10', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' }
    ],
    salaryGrade: 'Grade 8',
    band: 'Band T4',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 220, absentDays: 4, lateArrivals: 8, totalHours: 1760 },
    leave: { available: 18, used: 8, pending: 0, approved: 8 },
    mentorMetrics: {
      assignedInterns: 4,
      assignedEmployees: 2,
      activeProjects: 3,
      trainingSessions: 12,
      interns: [
        { id: 'emp-4', name: 'Alice Freeman', batch: '2026 Batch A' },
        { id: 'emp-5', name: 'Evan Wright', batch: '2026 Batch B' }
      ],
      employees: [
        { id: 'emp-6', name: 'Frank Miller', department: 'Engineering' }
      ],
      batchInfo: 'Software Engineering Batch Alpha & Beta',
      successRate: 95,
      trainingHours: 84,
      avgRating: 4.8,
      retentionRate: 98
    },
    accessControl: {
      role: 'Mentor / Tech Lead',
      permissions: ['Review Assignments', 'Assign Intern Projects', 'Input Evaluation Grades', 'Read-only Directory'],
      moduleAccess: ['Employee Profile', 'Mentor Management', 'Performance Center', 'Projects'],
      securityPolicies: ['2FA Enabled']
    },
    auditTrail: [
      { id: 'aud-201', date: '2026-06-20 09:30', action: 'Mentor Assignment', performedBy: 'Bob Johnson', details: 'Assigned mentorship project task to Alice Freeman' },
      { id: 'aud-202', date: '2026-06-18 16:50', action: 'Performance Review', performedBy: 'Bob Johnson', details: 'Submitted Midterm Review for Evan Wright' }
    ],
    performanceMetrics: { productivity: 96, communication: 90, leadership: 95, technical: 98, attendance: 96, learningProgress: 94 },
    performanceTrend: [
      { month: 'Jan', rating: 4.8 },
      { month: 'Feb', rating: 4.7 },
      { month: 'Mar', rating: 4.9 },
      { month: 'Apr', rating: 4.8 },
      { month: 'May', rating: 4.9 },
      { month: 'Jun', rating: 4.9 }
    ],
    performanceReviews: [
      { reviewerName: 'Charlie Davis', role: 'Manager', score: 4.9, comment: 'Bob is a stellar mentor. His feedback guides engineers to achieve amazing progress.', date: '2025-12-10' },
      { reviewerName: 'Diana Prince', role: 'HR', score: 4.8, comment: 'Interns consistently rate Bob as the most helpful and descriptive mentor.', date: '2025-12-05' }
    ],
    projects: [
      { name: 'Core Engine Refactor', role: 'Architect & Lead', startDate: '2025-01-01', endDate: '2025-06-30', status: 'Completed', score: 98 },
      { name: 'Antigravity Workspace', role: 'Advisor', startDate: '2026-02-15', endDate: '2026-08-31', status: 'Active', score: 96 }
    ],
    timeline: [
      { date: '2023-03-10', title: 'Joined Organization', description: 'Bob Johnson joined as Engineering Mentor.', type: 'onboarding' },
      { date: '2023-03-12', title: 'Assigned Manager', description: 'Charlie Davis assigned as Bob\'s manager.', type: 'mentor' },
      { date: '2024-03-10', title: 'Promoted to Senior Mentor', description: 'Promoted due to exceptional training success scores.', type: 'promotion' }
    ]
  },
  {
    id: 'emp-3',
    userId: '4',
    organizationId: 'org-3',
    name: 'Diana Prince',
    email: 'diana@example.com',
    avatar: 'DP',
    roleName: 'College Coordinator',
    designation: 'College Coordinator',
    joinDate: '2023-06-20',
    status: 'Active',
    phone: '+1 (555) 018-4729',
    dob: '1992-07-04',
    gender: 'Female',
    address: '100 Themis Island Ave, Washington, DC',
    emergencyContact: {
      name: 'Hippolyta Prince',
      relation: 'Mother',
      phone: '+1 (555) 018-4730'
    },
    location: 'Washington, DC',
    experienceLevel: 'Mid',
    employmentType: 'Full-time',
    documents: [
      { type: 'Offer Letter', name: 'offer_letter_diana.pdf', uploadDate: '2023-06-01', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'NDA', name: 'nda_diana.pdf', uploadDate: '2023-06-20', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'Experience Certificates', name: 'experience_cert_diana.pdf', uploadDate: '2023-06-20', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' }
    ],
    salaryGrade: 'Grade 6',
    band: 'Band C1',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 200, absentDays: 10, lateArrivals: 15, totalHours: 1600 },
    leave: { available: 20, used: 12, pending: 2, approved: 10 },
    accessControl: {
      role: 'Coordinator',
      permissions: ['Manage Intern Placement', 'View College Portals', 'Submit Student Lists', 'Verify Transcripts'],
      moduleAccess: ['Employee Directory', 'Student Portals', 'Reports & Analytics'],
      securityPolicies: ['2FA Enabled']
    },
    auditTrail: [
      { id: 'aud-301', date: '2026-06-12 11:00', action: 'Placement Update', performedBy: 'Diana Prince', details: 'Added MIT placement credentials for Batch 2026' }
    ],
    performanceMetrics: { productivity: 88, communication: 95, leadership: 85, technical: 60, attendance: 92, learningProgress: 82 },
    performanceTrend: [
      { month: 'Jan', rating: 4.2 },
      { month: 'Feb', rating: 4.3 },
      { month: 'Mar', rating: 4.4 },
      { month: 'Apr', rating: 4.2 },
      { month: 'May', rating: 4.3 },
      { month: 'Jun', rating: 4.5 }
    ],
    performanceReviews: [
      { reviewerName: 'Charlie Davis', role: 'Manager', score: 4.3, comment: 'Diana has established excellent relationships with tier-1 colleges.', date: '2025-12-12' }
    ],
    projects: [
      { name: 'Tier-1 University Outreach', role: 'Lead Director', startDate: '2024-08-01', endDate: '2025-05-31', status: 'Completed', score: 94 }
    ],
    timeline: [
      { date: '2023-06-20', title: 'Joined Organization', description: 'Diana Prince joined as College Coordinator.', type: 'onboarding' },
      { date: '2024-06-20', title: 'Completed Year 1', description: 'Achieved 100% placement rate for standard university cohorts.', type: 'review' }
    ]
  },
  {
    id: 'emp-4',
    userId: '1',
    organizationId: 'org-1',
    name: 'Alice Freeman',
    email: 'alice@example.com',
    avatar: 'AF',
    roleName: 'Student',
    designation: 'Junior Developer',
    joinDate: '2023-10-24',
    status: 'On Leave',
    managerId: 'emp-2',
    mentorId: 'emp-2',
    phone: '+1 (555) 010-3847',
    dob: '2001-08-14',
    gender: 'Female',
    address: '112 College dorms, Stanford, CA',
    emergencyContact: {
      name: 'Robert Freeman',
      relation: 'Father',
      phone: '+1 (555) 010-3848'
    },
    location: 'Stanford, CA',
    experienceLevel: 'Intern',
    employmentType: 'Internship',
    documents: [
      { type: 'Resume', name: 'resume_alice_freeman.pdf', uploadDate: '2023-10-10', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'Offer Letter', name: 'intern_offer_alice.pdf', uploadDate: '2023-10-15', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'Aadhaar', name: 'aadhaar_card_alice.pdf', uploadDate: '2023-10-24', status: 'Pending', version: 'v1.0' }
    ],
    salaryGrade: 'Grade 1',
    band: 'Band I1',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 140, absentDays: 8, lateArrivals: 4, totalHours: 1120 },
    leave: { available: 10, used: 8, pending: 1, approved: 7 },
    accessControl: {
      role: 'Intern',
      permissions: ['Read Repository', 'Write Sandbox Branches', 'Submit Weekly Status Report'],
      moduleAccess: ['Employee Profile', 'Projects'],
      securityPolicies: ['MFA Verification Required']
    },
    auditTrail: [
      { id: 'aud-401', date: '2026-06-22 09:12', action: 'Document Upload', performedBy: 'Alice Freeman', details: 'Uploaded Aadhaar card verification scan' },
      { id: 'aud-402', date: '2026-06-15 17:00', action: 'Leave Request', performedBy: 'Alice Freeman', details: 'Requested 3 days personal leave for exams' }
    ],
    performanceMetrics: { productivity: 92, communication: 88, leadership: 70, technical: 95, attendance: 94, learningProgress: 96 },
    performanceTrend: [
      { month: 'Jan', rating: 4.0 },
      { month: 'Feb', rating: 4.2 },
      { month: 'Mar', rating: 4.3 },
      { month: 'Apr', rating: 4.5 },
      { month: 'May', rating: 4.6 },
      { month: 'Jun', rating: 4.6 }
    ],
    performanceReviews: [
      { reviewerName: 'Bob Johnson', role: 'Mentor', score: 4.6, comment: 'Alice has picked up React framework extremely quickly and has delivered high-quality frontends.', date: '2026-05-15' },
      { reviewerName: 'Charlie Davis', role: 'HR', score: 4.3, comment: 'Polite and professional, shows great communication in standups.', date: '2026-04-10' }
    ],
    projects: [
      { name: 'Simp ERP Interface', role: 'Frontend Engineer', startDate: '2023-11-01', endDate: '2024-03-31', status: 'Completed', score: 94 },
      { name: 'Admin Pipelines V2', role: 'UI Developer', startDate: '2026-04-01', endDate: '2026-08-31', status: 'Active', score: 92 }
    ],
    timeline: [
      { date: '2023-10-24', title: 'Joined Organization', description: 'Alice Freeman joined as Junior Developer (Intern).', type: 'onboarding' },
      { date: '2023-10-25', title: 'Assigned Mentor', description: 'Bob Johnson assigned as engineering mentor.', type: 'mentor' },
      { date: '2023-11-01', title: 'Project Kickoff', description: 'Assigned to Simp ERP Interface development team.', type: 'transfer' },
      { date: '2026-06-15', title: 'Leave Status Change', description: 'Status changed to On Leave for final university exams.', type: 'status' }
    ]
  },
  {
    id: 'emp-5',
    userId: '5',
    organizationId: 'org-2',
    name: 'Evan Wright',
    email: 'evan@example.com',
    avatar: 'EW',
    roleName: 'Student',
    designation: 'Intern Engineer',
    joinDate: '2024-02-01',
    status: 'Probation',
    managerId: 'emp-2',
    mentorId: 'emp-2',
    phone: '+1 (555) 015-8833',
    dob: '2002-01-20',
    gender: 'Male',
    address: '67 Maple St, Cupertino, CA',
    emergencyContact: {
      name: 'Helen Wright',
      relation: 'Mother',
      phone: '+1 (555) 015-8834'
    },
    location: 'Cupertino, CA',
    experienceLevel: 'Intern',
    employmentType: 'Internship',
    documents: [
      { type: 'Resume', name: 'evan_resume_2024.pdf', uploadDate: '2024-01-10', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' },
      { type: 'Offer Letter', name: 'offer_letter_evan.pdf', uploadDate: '2024-01-15', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' }
    ],
    salaryGrade: 'Grade 1',
    band: 'Band I1',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 95, absentDays: 5, lateArrivals: 12, totalHours: 760 },
    leave: { available: 10, used: 4, pending: 0, approved: 4 },
    accessControl: {
      role: 'Intern',
      permissions: ['Read Repository', 'Write Sandbox Branches'],
      moduleAccess: ['Employee Profile', 'Projects'],
      securityPolicies: ['MFA Verification Required']
    },
    auditTrail: [
      { id: 'aud-501', date: '2024-02-01 09:00', action: 'Onboarding Start', performedBy: 'Charlie Davis', details: 'Initialized onboarding checklist for Evan Wright' }
    ],
    performanceMetrics: { productivity: 85, communication: 82, leadership: 60, technical: 88, attendance: 95, learningProgress: 90 },
    performanceTrend: [
      { month: 'Mar', rating: 3.8 },
      { month: 'Apr', rating: 4.0 },
      { month: 'May', rating: 4.1 },
      { month: 'Jun', rating: 4.2 }
    ],
    performanceReviews: [
      { reviewerName: 'Bob Johnson', role: 'Mentor', score: 4.2, comment: 'Evan works hard and is steadily improving his code styling and design patterns.', date: '2026-05-20' }
    ],
    projects: [
      { name: 'Widget Library Extension', role: 'Junior Engineer', startDate: '2024-02-15', endDate: '2024-06-30', status: 'Completed', score: 86 }
    ],
    timeline: [
      { date: '2024-02-01', title: 'Joined Organization', description: 'Evan Wright joined as Intern Engineer.', type: 'onboarding' },
      { date: '2024-02-01', title: 'Assigned Mentor', description: 'Bob Johnson assigned as engineering mentor.', type: 'mentor' }
    ]
  },
  {
    id: 'emp-6',
    userId: '0',
    organizationId: 'org-1',
    name: 'System Admin',
    email: 'admin@pinesphere.com',
    avatar: 'SA',
    roleName: 'Super Admin',
    designation: 'VP of Technology',
    joinDate: '2020-05-10',
    status: 'Active',
    phone: '+1 (555) 011-2233',
    dob: '1984-09-18',
    gender: 'Female',
    address: '1 VP Circle, San Jose, CA',
    emergencyContact: {
      name: 'Alan Wright',
      relation: 'Spouse',
      phone: '+1 (555) 011-2234'
    },
    location: 'San Jose, CA',
    experienceLevel: 'Director',
    employmentType: 'Full-time',
    documents: [
      { type: 'Offer Letter', name: 'offer_vp_admin.pdf', uploadDate: '2020-04-20', status: 'Verified', verifiedBy: 'Board of Directors', version: 'v1.0' },
      { type: 'Employment Agreement', name: 'agreement_vp_admin.pdf', uploadDate: '2020-05-10', status: 'Verified', verifiedBy: 'Board of Directors', version: 'v2.0' }
    ],
    salaryGrade: 'Grade 12',
    band: 'Band E5',
    shift: 'Flexible',
    attendance: { presentDays: 245, absentDays: 0, lateArrivals: 0, totalHours: 1960 },
    leave: { available: 25, used: 5, pending: 0, approved: 5 },
    accessControl: {
      role: 'Super Administrator',
      permissions: ['*'],
      moduleAccess: ['*'],
      securityPolicies: ['2FA Mandatory', 'YubiKey Authentication Required']
    },
    auditTrail: [
      { id: 'aud-601', date: '2026-06-24 08:30', action: 'System Backup', performedBy: 'System Admin', details: 'Triggered database state snapshot' }
    ],
    performanceMetrics: { productivity: 98, communication: 98, leadership: 99, technical: 99, attendance: 100, learningProgress: 97 },
    performanceTrend: [
      { month: 'Jan', rating: 5.0 },
      { month: 'Feb', rating: 5.0 },
      { month: 'Mar', rating: 5.0 },
      { month: 'Apr', rating: 5.0 },
      { month: 'May', rating: 5.0 },
      { month: 'Jun', rating: 5.0 }
    ],
    performanceReviews: [
      { reviewerName: 'Board of Directors', role: 'Manager', score: 5.0, comment: 'Outstanding technological foresight and leadership of the ERP project.', date: '2025-12-20' }
    ],
    projects: [
      { name: 'ERP Suite Launch', role: 'Sponsor & VP', startDate: '2020-06-01', endDate: '2022-12-31', status: 'Completed', score: 100 }
    ],
    timeline: [
      { date: '2020-05-10', title: 'Joined Organization', description: 'System Admin joined as VP of Technology.', type: 'onboarding' }
    ]
  },
  {
    id: 'emp-7',
    userId: '99',
    organizationId: 'org-2',
    name: 'George Green',
    email: 'george@example.com',
    avatar: 'GG',
    roleName: 'Employee',
    designation: 'Senior Backend Engineer',
    joinDate: '2024-05-01',
    status: 'Notice Period',
    managerId: 'emp-2',
    phone: '+1 (555) 012-7711',
    dob: '1989-12-05',
    gender: 'Male',
    address: '94 Sunset Ave, Austin, TX',
    emergencyContact: {
      name: 'Eliza Green',
      relation: 'Spouse',
      phone: '+1 (555) 012-7712'
    },
    location: 'Austin, TX',
    experienceLevel: 'Senior',
    employmentType: 'Full-time',
    documents: [
      { type: 'NDA', name: 'nda_george.pdf', uploadDate: '2024-05-01', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' }
    ],
    salaryGrade: 'Grade 7',
    band: 'Band T3',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 230, absentDays: 12, lateArrivals: 14, totalHours: 1840 },
    leave: { available: 12, used: 12, pending: 0, approved: 12 },
    accessControl: {
      role: 'Staff Engineer',
      permissions: ['Read Repository', 'Write Production Branches'],
      moduleAccess: ['Employee Profile', 'Projects'],
      securityPolicies: ['2FA Enabled']
    },
    auditTrail: [
      { id: 'aud-701', date: '2026-06-01 10:00', action: 'Resignation Submission', performedBy: 'George Green', details: 'Submitted formal resignation. Notice period initiated.' }
    ],
    performanceMetrics: { productivity: 78, communication: 80, leadership: 75, technical: 92, attendance: 88, learningProgress: 70 },
    performanceTrend: [
      { month: 'Jan', rating: 4.5 },
      { month: 'Feb', rating: 4.4 },
      { month: 'Mar', rating: 4.2 },
      { month: 'Apr', rating: 3.9 },
      { month: 'May', rating: 3.7 },
      { month: 'Jun', rating: 3.5 }
    ],
    performanceReviews: [
      { reviewerName: 'Bob Johnson', role: 'Manager', score: 3.8, comment: 'Productivity dropped significantly after submitting notice. Technical skills remain excellent.', date: '2026-06-15' }
    ],
    projects: [
      { name: 'API Gateway Redesign', role: 'Technical Owner', startDate: '2025-02-01', endDate: '2025-11-30', status: 'Completed', score: 94 }
    ],
    timeline: [
      { date: '2024-05-01', title: 'Joined Organization', description: 'George Green joined as Senior Backend Engineer.', type: 'onboarding' },
      { date: '2026-06-01', title: 'Notice Period Initiated', description: 'Formal notice period started due to personal career shift.', type: 'status' }
    ]
  },
  {
    id: 'emp-8',
    userId: '98',
    organizationId: 'org-3',
    name: 'Hannah White',
    email: 'hannah@example.com',
    avatar: 'HW',
    roleName: 'Employee',
    designation: 'UX Research Intern',
    joinDate: '2025-12-01',
    status: 'Training',
    managerId: 'emp-3',
    phone: '+1 (555) 016-5544',
    dob: '2003-03-27',
    gender: 'Female',
    address: '14 University Blvd, Seattle, WA',
    emergencyContact: {
      name: 'James White',
      relation: 'Father',
      phone: '+1 (555) 016-5545'
    },
    location: 'Seattle, WA',
    experienceLevel: 'Intern',
    employmentType: 'Training',
    documents: [
      { type: 'Resume', name: 'hannah_ux_resume.pdf', uploadDate: '2025-11-15', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0' }
    ],
    salaryGrade: 'Grade 1',
    band: 'Band I1',
    shift: 'General (09:00 - 18:00)',
    attendance: { presentDays: 120, absentDays: 10, lateArrivals: 3, totalHours: 960 },
    leave: { available: 8, used: 2, pending: 1, approved: 2 },
    accessControl: {
      role: 'Trainee',
      permissions: ['Read Sandbox Documentation'],
      moduleAccess: ['Employee Profile'],
      securityPolicies: ['Standard Passcode']
    },
    auditTrail: [
      { id: 'aud-801', date: '2025-12-01 09:00', action: 'Onboarding Checklist', performedBy: 'Diana Prince', details: 'Configured training modules for Hannah White' }
    ],
    performanceMetrics: { productivity: 80, communication: 90, leadership: 65, technical: 75, attendance: 90, learningProgress: 94 },
    performanceTrend: [
      { month: 'Jan', rating: 3.5 },
      { month: 'Feb', rating: 3.8 },
      { month: 'Mar', rating: 4.0 },
      { month: 'Apr', rating: 4.1 },
      { month: 'May', rating: 4.2 },
      { month: 'Jun', rating: 4.3 }
    ],
    performanceReviews: [
      { reviewerName: 'Diana Prince', role: 'Mentor', score: 4.2, comment: 'Hannah displays an eager learning attitude and understands client needs quickly.', date: '2026-05-18' }
    ],
    projects: [
      { name: 'SaaS Client Discovery', role: 'UX Assistant', startDate: '2025-12-15', endDate: '2026-03-31', status: 'Completed', score: 88 }
    ],
    timeline: [
      { date: '2025-12-01', title: 'Joined Organization', description: 'Hannah White joined as UX Research Intern.', type: 'onboarding' },
      { date: '2025-12-01', title: 'Assigned Coordinator', description: 'Diana Prince assigned as coordinator.', type: 'mentor' }
    ]
  }
];
