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
    id: 'batch-1',
    name: 'Summer 2026 Engineering Cohort',
    code: 'SEC-2026-A',
    programId: 'prog-1',
    programName: 'Summer Software Engineering Internship',
    internshipType: 'Stipend Internship',
    startDate: '2026-05-01',
    endDate: '2026-08-01',
    capacity: 40,
    status: 'Active',
    completionRate: 85,
    students: [
      { id: 'stu-1', name: 'Alice Freeman', internId: 'INT-2026-001', college: 'Stanford University', department: 'IT', performanceScore: 91, status: 'Active' },
      { id: 'stu-4', name: 'Priya Patel', internId: 'INT-2026-004', college: 'IIT Madras', department: 'AI & DS', performanceScore: 85, status: 'Active' }
    ],
    mentor: {
      id: 'emp-2',
      name: 'Bob Johnson',
      department: 'Technical Engineering',
      expertise: 'Full Stack Development',
      rating: 4.8,
      sessionsConducted: 8,
      studentSatisfaction: 4.7,
      successRate: 94,
      completionContribution: 90
    },
    projects: [
      { name: 'Task Board API Build', submissionRate: 95, evaluationStatus: 'Completed' },
      { name: 'Glassmorphism Portal Design', submissionRate: 88, evaluationStatus: 'Ongoing' }
    ],
    performance: {
      attendanceRate: 93,
      assessmentAverage: 86,
      placementConversion: 75,
      satisfactionScore: 4.6,
      attendanceTrend: [
        { week: 'Wk 1', rate: 98 },
        { week: 'Wk 2', rate: 95 },
        { week: 'Wk 3', rate: 92 },
        { week: 'Wk 4', rate: 93 }
      ],
      assessmentTrend: [
        { test: 'HTML/CSS Quiz', average: 91 },
        { test: 'JS Fundamentals', average: 82 },
        { test: 'React State', average: 85 }
      ],
      performanceTrend: [
        { month: 'May', score: 82 },
        { month: 'Jun', score: 86 }
      ],
      completionTrend: [
        { cohort: 'SEC-2025-A', rate: 82 },
        { cohort: 'SEC-2026-A', rate: 85 }
      ]
    },
    metadata: {
      type: 'Core Internship',
      category: 'Software Engineering',
      domain: 'Web Application Development',
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      tags: ['Frontend', 'Fullstack', 'Summer Cohort'],
      priority: 'High',
      academicYear: '2026-2027'
    },
    timeline: [
      { date: '2026-04-15', title: 'Batch Created', description: 'Cohort batch shell created in draft mode.', type: 'create' },
      { date: '2026-04-20', title: 'Mentor Remapped', description: 'Senior developer Bob Johnson assigned as lead facilitator.', type: 'mentor' },
      { date: '2026-04-25', title: 'Students Allocated', description: 'Assigned 25 verified university candidates to roster.', type: 'student' },
      { date: '2026-05-01', title: 'Cohort Activated', description: 'Program started. LMS access unlocked.', type: 'start' }
    ]
  },
  {
    id: 'batch-2',
    name: 'Winter 2026 AI Specialists',
    code: 'AIS-2026-W',
    programId: 'prog-2',
    programName: 'Data Science Boot Camp',
    internshipType: 'Corporate Internship',
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    capacity: 20,
    status: 'Completed',
    completionRate: 95,
    students: [
      { id: 'stu-2', name: 'Evan Wright', internId: 'INT-2026-002', college: 'MIT', department: 'CSE', performanceScore: 96, status: 'Completed' }
    ],
    mentor: {
      id: 'emp-3',
      name: 'Diana Prince',
      department: 'Data Operations',
      expertise: 'Machine Learning & AI',
      rating: 4.9,
      sessionsConducted: 12,
      studentSatisfaction: 4.9,
      successRate: 98,
      completionContribution: 95
    },
    projects: [
      { name: 'Predictive Sales Modeler', submissionRate: 100, evaluationStatus: 'Completed' },
      { name: 'Neural Pipeline Tuning', submissionRate: 95, evaluationStatus: 'Completed' }
    ],
    performance: {
      attendanceRate: 97,
      assessmentAverage: 94,
      placementConversion: 90,
      satisfactionScore: 4.9,
      attendanceTrend: [
        { week: 'Wk 1', rate: 100 },
        { week: 'Wk 2', rate: 98 },
        { week: 'Wk 3', rate: 96 },
        { week: 'Wk 4', rate: 97 }
      ],
      assessmentTrend: [
        { test: 'Python Core Math', average: 96 },
        { test: 'ML Estimators', average: 92 }
      ],
      performanceTrend: [
        { month: 'Feb', score: 91 },
        { month: 'Mar', score: 94 }
      ],
      completionTrend: [
        { cohort: 'AIS-2025-W', rate: 89 },
        { cohort: 'AIS-2026-W', rate: 95 }
      ]
    },
    metadata: {
      type: 'Specialist Cohort',
      category: 'Artificial Intelligence',
      domain: 'Deep Learning R&D',
      techStack: ['Python', 'PyTorch', 'NumPy', 'Docker'],
      tags: ['Data Science', 'AI', 'Winter Cohort'],
      priority: 'High',
      academicYear: '2025-2026'
    },
    timeline: [
      { date: '2026-02-01', title: 'Batch Initialized', description: 'Winter AI roster generated.', type: 'create' },
      { date: '2026-02-15', title: 'Program Launched', description: 'All-modules opened.', type: 'start' },
      { date: '2026-05-15', title: 'Batch Completed', description: 'Assessments completed, certifications issued.', type: 'complete' }
    ]
  },
  {
    id: 'batch-3',
    name: 'Spring 2026 Data Operations',
    code: 'DOC-2026-S',
    programId: 'prog-2',
    programName: 'Data Science Boot Camp',
    internshipType: 'Free Internship',
    startDate: '2026-03-15',
    endDate: '2026-06-15',
    capacity: 35,
    status: 'Active',
    completionRate: 80,
    students: [],
    mentor: {
      id: 'emp-3',
      name: 'Diana Prince',
      department: 'Data Operations',
      expertise: 'Data Analysis',
      rating: 4.6,
      sessionsConducted: 4,
      studentSatisfaction: 4.5,
      successRate: 88,
      completionContribution: 82
    },
    projects: [
      { name: 'SQL Query Analytics', submissionRate: 90, evaluationStatus: 'Ongoing' }
    ],
    performance: {
      attendanceRate: 91,
      assessmentAverage: 82,
      placementConversion: 50,
      satisfactionScore: 4.4,
      attendanceTrend: [
        { week: 'Wk 1', rate: 92 },
        { week: 'Wk 2', rate: 90 }
      ],
      assessmentTrend: [
        { test: 'Relational DBs', average: 82 }
      ],
      performanceTrend: [
        { month: 'Apr', score: 82 }
      ],
      completionTrend: []
    },
    metadata: {
      type: 'Core Internship',
      category: 'Data Analytics',
      domain: 'Business Intelligence',
      techStack: ['MySQL', 'Tableau', 'Excel'],
      tags: ['Data Operations', 'SQL', 'Spring Cohort'],
      priority: 'Medium',
      academicYear: '2025-2026'
    },
    timeline: [
      { date: '2026-03-01', title: 'Batch Created', description: 'Data operations batch created.', type: 'create' },
      { date: '2026-03-15', title: 'Cohort Launched', description: 'Active training status initiated.', type: 'start' }
    ]
  },
  {
    id: 'batch-4',
    name: 'Fall 2025 Sales Fellows',
    code: 'SFC-2025-F',
    programId: 'prog-3',
    programName: 'Sales Boot Camp',
    internshipType: 'Free Internship',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    capacity: 50,
    status: 'Completed',
    completionRate: 92,
    students: [
      { id: 'stu-3', name: 'Rahul Sharma', internId: 'INT-2026-003', college: 'IIT Madras', department: 'CSE', performanceScore: 90, status: 'Completed' }
    ],
    mentor: {
      id: 'emp-4',
      name: 'Charlie Davis',
      department: 'Marketing & Business',
      expertise: 'GTM Strategy',
      rating: 4.5,
      sessionsConducted: 10,
      studentSatisfaction: 4.4,
      successRate: 91,
      completionContribution: 90
    },
    projects: [
      { name: 'Lead Pipeline Architecture', submissionRate: 98, evaluationStatus: 'Completed' }
    ],
    performance: {
      attendanceRate: 94,
      assessmentAverage: 88,
      placementConversion: 80,
      satisfactionScore: 4.5,
      attendanceTrend: [
        { week: 'W1', rate: 95 },
        { week: 'W2', rate: 94 }
      ],
      assessmentTrend: [
        { test: 'Lead Scoring', average: 88 }
      ],
      performanceTrend: [],
      completionTrend: []
    },
    metadata: {
      type: 'Fellowship',
      category: 'Sales & GTM',
      domain: 'Customer Operations',
      techStack: ['HubSpot CRM', 'LinkedIn Sales Nav', 'Outreach'],
      tags: ['Sales', 'LeadGen', 'Business'],
      priority: 'Low',
      academicYear: '2025-2026'
    },
    timeline: [
      { date: '2025-08-20', title: 'Batch Created', description: 'Sales fellows draft created.', type: 'create' },
      { date: '2025-09-01', title: 'Program Launched', description: 'Program opened.', type: 'start' },
      { date: '2025-12-01', title: 'Batch Concluded', description: 'Certificates generated and issued.', type: 'complete' }
    ]
  },
  {
    id: 'batch-5',
    name: 'Quantum Hardware R&D',
    code: 'QHR-2026-X',
    programId: 'prog-6', // Mock program
    programName: 'Research Program (Quantum Theory)',
    internshipType: 'Research Internship',
    startDate: '2026-07-01',
    endDate: '2026-10-01',
    capacity: 15,
    status: 'On Hold',
    completionRate: 0,
    students: [
      { id: 'stu-5', name: 'John Doe', internId: 'INT-2026-005', college: 'UC Berkeley', department: 'ECE', performanceScore: 55, status: 'Active' },
      { id: 'stu-6', name: 'Jane Smith', internId: 'INT-2026-006', college: 'Stanford University', department: 'EEE', performanceScore: 100, status: 'Active' }
    ],
    mentor: {
      id: 'emp-2',
      name: 'Bob Johnson',
      department: 'Technical Engineering',
      expertise: 'Embedded Electronics',
      rating: 4.0,
      sessionsConducted: 0,
      studentSatisfaction: 4.0,
      successRate: 50,
      completionContribution: 0
    },
    projects: [],
    performance: {
      attendanceRate: 85,
      assessmentAverage: 78,
      placementConversion: 0,
      satisfactionScore: 4.0,
      attendanceTrend: [],
      assessmentTrend: [],
      performanceTrend: [],
      completionTrend: []
    },
    metadata: {
      type: 'Research Lab',
      category: 'Quantum Computing',
      domain: 'Superconducting Circuits',
      techStack: ['Qiskit', 'MATLAB', 'C++', 'LabVIEW'],
      tags: ['Quantum', 'Hardware', 'Research'],
      priority: 'High',
      academicYear: '2026-2027'
    },
    timeline: [
      { date: '2026-06-01', title: 'Draft Created', description: 'Quantum hardware setup registered.', type: 'create' },
      { date: '2026-06-15', title: 'Put On Hold', description: 'Enrollment suspended pending lab inventory validations.', type: 'info' }
    ]
  },
  {
    id: 'batch-6',
    name: 'Cybersecurity Boot Camp',
    code: 'CSB-2026-C',
    programId: 'prog-1',
    programName: 'Summer Software Engineering Internship',
    internshipType: 'Paid Internship',
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    capacity: 25,
    status: 'Upcoming',
    completionRate: 0,
    students: [],
    mentor: {
      id: '',
      name: '',
      department: '',
      expertise: '',
      rating: 0,
      sessionsConducted: 0,
      studentSatisfaction: 0,
      successRate: 0,
      completionContribution: 0
    },
    projects: [],
    performance: {
      attendanceRate: 100,
      assessmentAverage: 100,
      placementConversion: 0,
      satisfactionScore: 5.0,
      attendanceTrend: [],
      assessmentTrend: [],
      performanceTrend: [],
      completionTrend: []
    },
    metadata: {
      type: 'Boot Camp',
      category: 'Cybersecurity',
      domain: 'Penetration Testing',
      techStack: ['Kali Linux', 'Wireshark', 'Python', 'Metasploit'],
      tags: ['Security', 'Infosec', 'Bootcamp'],
      priority: 'Medium',
      academicYear: '2026-2027'
    },
    timeline: [
      { date: '2026-06-10', title: 'Draft Created', description: 'Cybersecurity cohort scheduled.', type: 'create' }
    ]
  }
];
