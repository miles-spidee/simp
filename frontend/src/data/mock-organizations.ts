export interface OrganizationDepartment {
  name: string;
  hod: string;
  studentsCount: number;
  facultyCount: number;
  internshipsCount: number;
  placementRate: number; // percentage
  status: 'Active' | 'Inactive';
}

export interface OrganizationCoordinator {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  studentsManaged: number;
  programsManaged: number;
  status: 'Active' | 'Inactive';
  kpis: {
    applicationsProcessed: number;
    attendanceApprovals: number;
    internshipCompletions: number;
    placementSuccess: number; // percentage
  };
}

export interface OrganizationStudent {
  id: string;
  name: string;
  department: string;
  year: number;
  program: string;
  status: 'Active' | 'Completed' | 'Placed' | 'Placement Ready';
  coordinatorName: string;
}

export interface OrganizationProgram {
  name: string;
  duration: string; // e.g. 6 Months
  enrolledCount: number;
  status: 'Active' | 'Completed' | 'Upcoming';
  coordinatorName: string;
  analytics: {
    completionRate: number; // percentage
    attendanceRate: number; // percentage
    placementRate: number; // percentage
    satisfactionScore: number; // out of 5
    performanceScore: number; // out of 100
  };
}

export interface PlacementCompanyStats {
  companyName: string;
  hiredCount: number;
  avgPackage: string; // e.g. 12 LPA
}

export interface PlacementAnalytics {
  placementPercentage: number;
  studentsPlaced: number;
  companiesParticipated: number;
  avgPackage: string;
  placementTrend: { year: string; rate: number }[];
  deptPlacementRate: { dept: string; rate: number }[];
  companyHiring: PlacementCompanyStats[];
  salaryDistribution: { range: string; count: number }[];
  yoyGrowth: { year: string; growth: number }[];
}

export interface OrganizationDocument {
  type: 'MoU' | 'Partnership Agreement' | 'Approval Letter' | 'College Brochure' | 'Accreditation Certificates';
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  version: string;
  previewContent?: string;
}

export interface OrganizationTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'added' | 'mou' | 'coordinator' | 'dept' | 'student_import' | 'program' | 'placement' | 'renewal';
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: string; // e.g. Engineering, Arts, Science, etc.
  headcount: number; // compatible with existing (total students)
  managerId: string; // compatible with existing (lead coordinator)
  status: 'Active' | 'Inactive'; // compatible with existing
  
  logo: string;
  university: string;
  location: string;
  partnershipStatus: 'Active' | 'Inactive' | 'Pending Verification' | 'Pending' | 'Partnership Expired' | 'Blacklisted' | 'Suspended';
  partnershipSince: string;
  
  // Tab 1: Overview Metadata
  website: string;
  email: string;
  phone: string;
  address: string;
  affiliation: string;
  accreditation: string;
  establishmentYear: number;
  
  // Tab 2: Departments
  departments: OrganizationDepartment[];
  
  // Tab 3: Coordinators
  coordinators: OrganizationCoordinator[];
  
  // Tab 4: Student Relationships
  students: OrganizationStudent[];
  
  // Tab 5: Internship Programs
  programs: OrganizationProgram[];
  
  // Tab 6: Placement Analytics
  placementAnalytics: PlacementAnalytics;
  
  // Tab 7: Metadata & MoU Documents
  naacGrade: string;
  nbaStatus: 'Accredited' | 'Not Accredited' | 'Applied';
  autonomousStatus: 'Autonomous' | 'Affiliated';
  nationalRanking: number;
  documents: OrganizationDocument[];
  
  // Tab 8: Partnership Timeline
  timeline: OrganizationTimelineEvent[];
}

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Stanford University',
    code: 'STAN',
    type: 'Engineering',
    headcount: 1450,
    managerId: 'emp-3',
    status: 'Active',
    logo: 'SU',
    university: 'Stanford Board of Trustees',
    location: 'Stanford, CA',
    partnershipStatus: 'Active',
    partnershipSince: '2021-09-01',
    website: 'https://stanford.edu',
    email: 'placements@stanford.edu',
    phone: '+1 (650) 723-2300',
    address: '450 Jane Stanford Way, Stanford, CA 94305',
    affiliation: 'Western Association of Schools and Colleges (WASC)',
    accreditation: 'ABET Accredited Engineering Programs',
    establishmentYear: 1885,
    departments: [
      { name: 'Computer Science (CSE)', hod: 'Dr. John Hennessy', studentsCount: 650, facultyCount: 45, internshipsCount: 320, placementRate: 98, status: 'Active' },
      { name: 'Information Technology (IT)', hod: 'Dr. Jennifer Widom', studentsCount: 400, facultyCount: 30, internshipsCount: 180, placementRate: 95, status: 'Active' },
      { name: 'Electrical Engineering (ECE)', hod: 'Dr. Stephen Boyd', studentsCount: 400, facultyCount: 35, internshipsCount: 150, placementRate: 90, status: 'Active' }
    ],
    coordinators: [
      {
        id: 'coord-1',
        name: 'Diana Prince',
        email: 'diana@stanford.edu',
        phone: '+1 (555) 018-4729',
        department: 'Computer Science',
        studentsManaged: 650,
        programsManaged: 4,
        status: 'Active',
        kpis: { applicationsProcessed: 420, attendanceApprovals: 920, internshipCompletions: 380, placementSuccess: 98 }
      },
      {
        id: 'coord-2',
        name: 'Jane Foster',
        email: 'jane@stanford.edu',
        phone: '+1 (555) 018-2234',
        department: 'Electrical Engineering',
        studentsManaged: 400,
        programsManaged: 2,
        status: 'Active',
        kpis: { applicationsProcessed: 200, attendanceApprovals: 450, internshipCompletions: 170, placementSuccess: 90 }
      }
    ],
    students: [
      { id: 'STU-1001', name: 'Alice Freeman', department: 'Computer Science (CSE)', year: 4, program: 'Silicon Valley Internship Program', status: 'Active', coordinatorName: 'Diana Prince' },
      { id: 'STU-1002', name: 'Bob Johnson', department: 'Computer Science (CSE)', year: 3, program: 'Silicon Valley Internship Program', status: 'Placement Ready', coordinatorName: 'Diana Prince' },
      { id: 'STU-1003', name: 'Charlie Miller', department: 'Electrical Engineering (ECE)', year: 4, program: 'Embedded Systems Accelerator', status: 'Placed', coordinatorName: 'Jane Foster' }
    ],
    programs: [
      {
        name: 'Silicon Valley Internship Program',
        duration: '6 Months',
        enrolledCount: 650,
        status: 'Active',
        coordinatorName: 'Diana Prince',
        analytics: { completionRate: 96, attendanceRate: 98, placementRate: 98, satisfactionScore: 4.8, performanceScore: 94 }
      },
      {
        name: 'Embedded Systems Accelerator',
        duration: '3 Months',
        enrolledCount: 400,
        status: 'Active',
        coordinatorName: 'Jane Foster',
        analytics: { completionRate: 92, attendanceRate: 95, placementRate: 90, satisfactionScore: 4.5, performanceScore: 88 }
      }
    ],
    placementAnalytics: {
      placementPercentage: 96,
      studentsPlaced: 620,
      companiesParticipated: 45,
      avgPackage: '18 LPA',
      placementTrend: [
        { year: '2023', rate: 94 },
        { year: '2024', rate: 95 },
        { year: '2025', rate: 96 }
      ],
      deptPlacementRate: [
        { dept: 'CSE', rate: 98 },
        { dept: 'IT', rate: 95 },
        { dept: 'ECE', rate: 90 }
      ],
      companyHiring: [
        { companyName: 'Google', hiredCount: 45, avgPackage: '22 LPA' },
        { companyName: 'Apple', hiredCount: 30, avgPackage: '20 LPA' },
        { companyName: 'Meta', hiredCount: 25, avgPackage: '24 LPA' }
      ],
      salaryDistribution: [
        { range: '6-10 LPA', count: 40 },
        { range: '10-15 LPA', count: 180 },
        { range: '15-25 LPA', count: 400 }
      ],
      yoyGrowth: [
        { year: '2024', growth: 5 },
        { year: '2025', growth: 3 }
      ]
    },
    naacGrade: 'A++',
    nbaStatus: 'Accredited',
    autonomousStatus: 'Autonomous',
    nationalRanking: 3,
    documents: [
      { type: 'MoU', name: 'stanford_mou_2025_2030.pdf', uploadDate: '2025-01-10', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0', previewContent: 'Memorandum of Understanding between Stanford School of Engineering and PineSphere ERP Systems. Valid for 5 years.' },
      { type: 'Partnership Agreement', name: 'partnership_stanford_final.pdf', uploadDate: '2025-01-12', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.1', previewContent: 'Institutional agreement outlining credits transfer rules and active coordinator access logs.' }
    ],
    timeline: [
      { date: '2021-09-01', title: 'College Added', description: 'Stanford University registered as partner institution.', type: 'added' },
      { date: '2021-09-05', title: 'MoU Signed', description: '5-year institutional MoU signed by Dean of Engineering.', type: 'mou' },
      { date: '2021-09-10', title: 'Coordinator Assigned', description: 'Diana Prince mapped as primary coordinator for Stanford.', type: 'coordinator' }
    ]
  },
  {
    id: 'org-2',
    name: 'Massachusetts Institute of Technology',
    code: 'MIT',
    type: 'Engineering',
    headcount: 1200,
    managerId: 'emp-2',
    status: 'Active',
    logo: 'MIT',
    university: 'MIT Corporation',
    location: 'Cambridge, MA',
    partnershipStatus: 'Active',
    partnershipSince: '2022-03-10',
    website: 'https://mit.edu',
    email: 'careers@mit.edu',
    phone: '+1 (617) 253-1000',
    address: '77 Massachusetts Ave, Cambridge, MA 02139',
    affiliation: 'New England Commission of Higher Education (NECHE)',
    accreditation: 'ABET Accredited',
    establishmentYear: 1861,
    departments: [
      { name: 'Computer Science (CSE)', hod: 'Dr. Hal Abelson', studentsCount: 700, facultyCount: 50, internshipsCount: 350, placementRate: 99, status: 'Active' },
      { name: 'Artificial Intelligence & DS', hod: 'Dr. Daniela Rus', studentsCount: 500, facultyCount: 40, internshipsCount: 220, placementRate: 98, status: 'Active' }
    ],
    coordinators: [
      {
        id: 'coord-3',
        name: 'Gerry Sussman',
        email: 'sussman@mit.edu',
        phone: '+1 (555) 012-3456',
        department: 'Computer Science',
        studentsManaged: 700,
        programsManaged: 3,
        status: 'Active',
        kpis: { applicationsProcessed: 450, attendanceApprovals: 880, internshipCompletions: 390, placementSuccess: 99 }
      }
    ],
    students: [
      { id: 'STU-2001', name: 'Evan Wright', department: 'Computer Science (CSE)', year: 3, program: 'MIT Frontier Internships', status: 'Active', coordinatorName: 'Gerry Sussman' }
    ],
    programs: [
      {
        name: 'MIT Frontier Internships',
        duration: '6 Months',
        enrolledCount: 700,
        status: 'Active',
        coordinatorName: 'Gerry Sussman',
        analytics: { completionRate: 98, attendanceRate: 99, placementRate: 99, satisfactionScore: 4.9, performanceScore: 97 }
      }
    ],
    placementAnalytics: {
      placementPercentage: 99,
      studentsPlaced: 690,
      companiesParticipated: 50,
      avgPackage: '20 LPA',
      placementTrend: [
        { year: '2023', rate: 98 },
        { year: '2024', rate: 98 },
        { year: '2025', rate: 99 }
      ],
      deptPlacementRate: [
        { dept: 'CSE', rate: 99 },
        { dept: 'AI & DS', rate: 98 }
      ],
      companyHiring: [
        { companyName: 'NVIDIA', hiredCount: 40, avgPackage: '25 LPA' },
        { companyName: 'Microsoft', hiredCount: 35, avgPackage: '21 LPA' }
      ],
      salaryDistribution: [
        { range: '10-15 LPA', count: 50 },
        { range: '15-25 LPA', count: 350 },
        { range: '25+ LPA', count: 290 }
      ],
      yoyGrowth: [
        { year: '2024', growth: 8 },
        { year: '2025', growth: 4 }
      ]
    },
    naacGrade: 'A++',
    nbaStatus: 'Accredited',
    autonomousStatus: 'Autonomous',
    nationalRanking: 1,
    documents: [
      { type: 'MoU', name: 'mit_pinesphere_mou.pdf', uploadDate: '2022-03-01', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0', previewContent: 'PineSphere Academic Alliance with MIT EECS Department. Valid till 2027.' }
    ],
    timeline: [
      { date: '2022-03-10', title: 'College Added', description: 'Massachusetts Institute of Technology mapped in system.', type: 'added' },
      { date: '2022-03-12', title: 'Partnership Signed', description: 'All-department partnership signed at Cambridge.', type: 'mou' }
    ]
  },
  {
    id: 'org-3',
    name: 'University of California, Berkeley',
    code: 'UCB',
    type: 'Science',
    headcount: 900,
    managerId: 'emp-3',
    status: 'Active',
    logo: 'UCB',
    university: 'University of California Regents',
    location: 'Berkeley, CA',
    partnershipStatus: 'Active',
    partnershipSince: '2023-06-20',
    website: 'https://berkeley.edu',
    email: 'recruit@berkeley.edu',
    phone: '+1 (510) 642-6000',
    address: '101 Sproul Hall, Berkeley, CA 94720',
    affiliation: 'WASC Senior College and University Commission',
    accreditation: 'ABET, AACSB Accredited',
    establishmentYear: 1868,
    departments: [
      { name: 'Computer Science (CSE)', hod: 'Dr. Michael Jordan', studentsCount: 500, facultyCount: 30, internshipsCount: 210, placementRate: 94, status: 'Active' },
      { name: 'Management Studies (MBA)', hod: 'Dr. David Aaker', studentsCount: 400, facultyCount: 25, internshipsCount: 150, placementRate: 92, status: 'Active' }
    ],
    coordinators: [
      {
        id: 'coord-4',
        name: 'Richard Karp',
        email: 'karp@berkeley.edu',
        phone: '+1 (555) 013-8899',
        department: 'Computer Science',
        studentsManaged: 500,
        programsManaged: 2,
        status: 'Active',
        kpis: { applicationsProcessed: 310, attendanceApprovals: 540, internshipCompletions: 290, placementSuccess: 94 }
      }
    ],
    students: [
      { id: 'STU-3001', name: 'George Green', department: 'Computer Science (CSE)', year: 4, program: 'Berkeley Tech Term', status: 'Completed', coordinatorName: 'Richard Karp' }
    ],
    programs: [
      {
        name: 'Berkeley Tech Term',
        duration: '6 Months',
        enrolledCount: 500,
        status: 'Active',
        coordinatorName: 'Richard Karp',
        analytics: { completionRate: 94, attendanceRate: 96, placementRate: 94, satisfactionScore: 4.6, performanceScore: 91 }
      }
    ],
    placementAnalytics: {
      placementPercentage: 93,
      studentsPlaced: 465,
      companiesParticipated: 38,
      avgPackage: '15 LPA',
      placementTrend: [
        { year: '2023', rate: 91 },
        { year: '2024', rate: 92 },
        { year: '2025', rate: 93 }
      ],
      deptPlacementRate: [
        { dept: 'CSE', rate: 94 },
        { dept: 'MBA', rate: 92 }
      ],
      companyHiring: [
        { companyName: 'Salesforce', hiredCount: 25, avgPackage: '16 LPA' },
        { companyName: 'Uber', hiredCount: 18, avgPackage: '18 LPA' }
      ],
      salaryDistribution: [
        { range: '6-10 LPA', count: 65 },
        { range: '10-15 LPA', count: 150 },
        { range: '15-25 LPA', count: 250 }
      ],
      yoyGrowth: [
        { year: '2024', growth: 4 },
        { year: '2025', growth: 2 }
      ]
    },
    naacGrade: 'A+',
    nbaStatus: 'Accredited',
    autonomousStatus: 'Autonomous',
    nationalRanking: 5,
    documents: [
      { type: 'MoU', name: 'ucb_pinesphere_mou_23.pdf', uploadDate: '2023-06-15', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0', previewContent: 'UC Berkeley CS Department educational MoU.' }
    ],
    timeline: [
      { date: '2023-06-20', title: 'College Added', description: 'UC Berkeley registered in the system.', type: 'added' }
    ]
  },
  {
    id: 'org-4',
    name: 'California Institute of Technology',
    code: 'CALTECH',
    type: 'Science',
    headcount: 500,
    managerId: 'emp-2',
    status: 'Active',
    logo: 'CIT',
    university: 'Caltech Board of Trustees',
    location: 'Pasadena, CA',
    partnershipStatus: 'Pending Verification',
    partnershipSince: '2025-10-24',
    website: 'https://caltech.edu',
    email: 'career@caltech.edu',
    phone: '+1 (626) 395-6811',
    address: '1200 E California Blvd, Pasadena, CA 91125',
    affiliation: 'WASC ACCJC',
    accreditation: 'ABET, Western Association',
    establishmentYear: 1891,
    departments: [
      { name: 'Physics & Computing', hod: 'Dr. Kip Thorne', studentsCount: 300, facultyCount: 25, internshipsCount: 120, placementRate: 97, status: 'Active' },
      { name: 'Applied Mathematics', hod: 'Dr. Eric Temple Bell', studentsCount: 200, facultyCount: 15, internshipsCount: 80, placementRate: 95, status: 'Active' }
    ],
    coordinators: [
      {
        id: 'coord-5',
        name: 'Richard Feynman',
        email: 'feynman@caltech.edu',
        phone: '+1 (555) 011-5847',
        department: 'Physics & Computing',
        studentsManaged: 300,
        programsManaged: 1,
        status: 'Active',
        kpis: { applicationsProcessed: 140, attendanceApprovals: 220, internshipCompletions: 110, placementSuccess: 97 }
      }
    ],
    students: [
      { id: 'STU-4001', name: 'Hannah White', department: 'Physics & Computing', year: 2, program: 'Quantum Internship Initiative', status: 'Active', coordinatorName: 'Richard Feynman' }
    ],
    programs: [
      {
        name: 'Quantum Internship Initiative',
        duration: '6 Months',
        enrolledCount: 300,
        status: 'Active',
        coordinatorName: 'Richard Feynman',
        analytics: { completionRate: 97, attendanceRate: 97, placementRate: 97, satisfactionScore: 4.8, performanceScore: 95 }
      }
    ],
    placementAnalytics: {
      placementPercentage: 96,
      studentsPlaced: 288,
      companiesParticipated: 20,
      avgPackage: '22 LPA',
      placementTrend: [
        { year: '2025', rate: 96 }
      ],
      deptPlacementRate: [
        { dept: 'Physics & Computing', rate: 97 },
        { dept: 'Applied Mathematics', rate: 95 }
      ],
      companyHiring: [
        { companyName: 'SpaceX', hiredCount: 15, avgPackage: '24 LPA' },
        { companyName: 'Intel', hiredCount: 12, avgPackage: '20 LPA' }
      ],
      salaryDistribution: [
        { range: '15-25 LPA', count: 180 },
        { range: '25+ LPA', count: 108 }
      ],
      yoyGrowth: []
    },
    naacGrade: 'A++',
    nbaStatus: 'Applied',
    autonomousStatus: 'Autonomous',
    nationalRanking: 2,
    documents: [
      { type: 'MoU', name: 'caltech_draft_mou_2025.pdf', uploadDate: '2025-10-20', status: 'Pending', version: 'v1.0', previewContent: 'Draft MoU for Caltech Physics Placement Drive.' }
    ],
    timeline: [
      { date: '2025-10-24', title: 'College Added', description: 'Caltech registered for quantum internship drives.', type: 'added' }
    ]
  },
  {
    id: 'org-5',
    name: 'Harvard University',
    code: 'HARV',
    type: 'Management',
    headcount: 850,
    managerId: 'emp-3',
    status: 'Inactive',
    logo: 'HU',
    university: 'Harvard Board of Overseers',
    location: 'Cambridge, MA',
    partnershipStatus: 'Partnership Expired',
    partnershipSince: '2020-05-10',
    website: 'https://harvard.edu',
    email: 'recruit@harvard.edu',
    phone: '+1 (617) 495-1000',
    address: 'Massachusetts Hall, Cambridge, MA 02138',
    affiliation: 'NECHE',
    accreditation: 'AACSB, AMBA Accredited',
    establishmentYear: 1636,
    departments: [
      { name: 'Business Administration (MBA)', hod: 'Dr. Nitin Nohria', studentsCount: 500, facultyCount: 40, internshipsCount: 300, placementRate: 98, status: 'Active' },
      { name: 'Public Policy', hod: 'Dr. Douglas Elmendorf', studentsCount: 350, facultyCount: 20, internshipsCount: 150, placementRate: 92, status: 'Inactive' }
    ],
    coordinators: [
      {
        id: 'coord-6',
        name: 'Michael Porter',
        email: 'porter@harvard.edu',
        phone: '+1 (555) 016-1122',
        department: 'Business Administration',
        studentsManaged: 500,
        programsManaged: 2,
        status: 'Inactive',
        kpis: { applicationsProcessed: 400, attendanceApprovals: 650, internshipCompletions: 380, placementSuccess: 98 }
      }
    ],
    students: [],
    programs: [
      {
        name: 'Harvard Global Leadership Program',
        duration: '3 Months',
        enrolledCount: 500,
        status: 'Completed',
        coordinatorName: 'Michael Porter',
        analytics: { completionRate: 98, attendanceRate: 96, placementRate: 98, satisfactionScore: 4.7, performanceScore: 93 }
      }
    ],
    placementAnalytics: {
      placementPercentage: 95,
      studentsPlaced: 475,
      companiesParticipated: 40,
      avgPackage: '18 LPA',
      placementTrend: [
        { year: '2023', rate: 96 },
        { year: '2024', rate: 95 }
      ],
      deptPlacementRate: [
        { dept: 'MBA', rate: 98 },
        { dept: 'Public Policy', rate: 92 }
      ],
      companyHiring: [
        { companyName: 'McKinsey & Co', hiredCount: 20, avgPackage: '25 LPA' },
        { companyName: 'Goldman Sachs', hiredCount: 18, avgPackage: '22 LPA' }
      ],
      salaryDistribution: [
        { range: '10-15 LPA', count: 50 },
        { range: '15-25 LPA', count: 325 },
        { range: '25+ LPA', count: 100 }
      ],
      yoyGrowth: [
        { year: '2024', growth: -1 }
      ]
    },
    naacGrade: 'A++',
    nbaStatus: 'Accredited',
    autonomousStatus: 'Autonomous',
    nationalRanking: 4,
    documents: [
      { type: 'MoU', name: 'harvard_expired_mou.pdf', uploadDate: '2020-05-01', status: 'Rejected', verifiedBy: 'Charlie Davis', version: 'v1.0', previewContent: 'MoU expired on 2025-05-01. Needs renewal review.' }
    ],
    timeline: [
      { date: '2020-05-10', title: 'College Added', description: 'Harvard Business School registered in ERP.', type: 'added' },
      { date: '2025-05-01', title: 'Partnership Expired', description: 'MoU term expired without automated renewal trigger.', type: 'renewal' }
    ]
  },
  {
    id: 'org-6',
    name: 'Indian Institute of Technology Madras',
    code: 'IITM',
    type: 'Engineering',
    headcount: 1100,
    managerId: 'emp-2',
    status: 'Active',
    logo: 'IITM',
    university: 'IIT Council',
    location: 'Chennai, India',
    partnershipStatus: 'Active',
    partnershipSince: '2024-05-01',
    website: 'https://iitm.ac.in',
    email: 'placement@iitm.ac.in',
    phone: '+91 (44) 2257-8000',
    address: 'IIT Madras, Chennai, Tamil Nadu 600036',
    affiliation: 'Ministry of Education, Government of India',
    accreditation: 'NIRF Ranked 1 Engineering College',
    establishmentYear: 1959,
    departments: [
      { name: 'Computer Science (CSE)', hod: 'Dr. C. Pandu Rangan', studentsCount: 600, facultyCount: 40, internshipsCount: 310, placementRate: 97, status: 'Active' },
      { name: 'Artificial Intelligence & DS', hod: 'Dr. B. Ravindran', studentsCount: 500, facultyCount: 30, internshipsCount: 260, placementRate: 98, status: 'Active' }
    ],
    coordinators: [
      {
        id: 'coord-7',
        name: 'Kamalesh Kumar',
        email: 'kamalesh@iitm.ac.in',
        phone: '+91 9444012345',
        department: 'Computer Science',
        studentsManaged: 600,
        programsManaged: 2,
        status: 'Active',
        kpis: { applicationsProcessed: 410, attendanceApprovals: 750, internshipCompletions: 340, placementSuccess: 97 }
      }
    ],
    students: [],
    programs: [
      {
        name: 'IIT Madras AI & ML Cohort',
        duration: '6 Months',
        enrolledCount: 600,
        status: 'Active',
        coordinatorName: 'Kamalesh Kumar',
        analytics: { completionRate: 96, attendanceRate: 98, placementRate: 97, satisfactionScore: 4.8, performanceScore: 92 }
      }
    ],
    placementAnalytics: {
      placementPercentage: 97,
      studentsPlaced: 582,
      companiesParticipated: 42,
      avgPackage: '16 LPA',
      placementTrend: [
        { year: '2024', rate: 96 },
        { year: '2025', rate: 97 }
      ],
      deptPlacementRate: [
        { dept: 'CSE', rate: 97 },
        { dept: 'AI & DS', rate: 98 }
      ],
      companyHiring: [
        { companyName: 'Microsoft India', hiredCount: 30, avgPackage: '20 LPA' },
        { companyName: 'Qualcomm', hiredCount: 22, avgPackage: '18 LPA' }
      ],
      salaryDistribution: [
        { range: '6-10 LPA', count: 42 },
        { range: '10-15 LPA', count: 180 },
        { range: '15-25 LPA', count: 360 }
      ],
      yoyGrowth: [
        { year: '2025', growth: 6 }
      ]
    },
    naacGrade: 'A++',
    nbaStatus: 'Accredited',
    autonomousStatus: 'Autonomous',
    nationalRanking: 1,
    documents: [
      { type: 'MoU', name: 'iitm_pinesphere_mou_2024.pdf', uploadDate: '2024-04-20', status: 'Verified', verifiedBy: 'Charlie Davis', version: 'v1.0', previewContent: 'IIT Madras Institutional Placement MoU for 3 Years.' }
    ],
    timeline: [
      { date: '2024-05-01', title: 'College Added', description: 'IIT Madras mapped into ERP roster.', type: 'added' }
    ]
  }
];
