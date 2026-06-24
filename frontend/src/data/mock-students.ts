export interface StudentDocument {
  type: string;
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  url: string;
  previewText?: string;
}

export interface StudentCredentials {
  username: string;
  portalAccess: boolean;
  lmsAccess: boolean;
  assessmentAccess: boolean;
}

export interface StudentBatch {
  name: string;
  program: string;
  startDate: string;
  endDate: string;
  mentor: string;
  status: 'Upcoming' | 'Active' | 'Completed';
}

export interface StudentMentor {
  name: string;
  department: string;
  expertise: string;
  sessionsConducted: number;
  rating: number; // out of 5
  feedbackGiven: { date: string; content: string; reviewer: string }[];
}

export interface StudentPerformance {
  attendanceScore: number; // percentage
  assessmentScore: number; // out of 100
  projectScore: number; // out of 100
  mentorRating: number; // out of 5
  overallPerformance: number; // out of 100
  attendanceTrend: { date: string; score: number }[];
  assessmentTrend: { test: string; score: number }[];
  skills: { name: string; value: number }[];
}

export interface StudentPlacement {
  status: 'Not Eligible' | 'Eligible' | 'Placement Ready' | 'Interview Scheduled' | 'Offer Received' | 'Placed';
  company?: string;
  package?: string;
  interviewStatus?: string;
  offerStatus?: string;
}

export interface StudentTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'registration' | 'approval' | 'id_card' | 'batch' | 'mentor' | 'assessment' | 'cert' | 'placement' | 'info';
}

export interface Student {
  id: string;
  userId: string;
  internId: string;
  applicationId?: string;
  enrollmentDate: string;
  status: 'Applied' | 'Approved' | 'Enrolled' | 'Active' | 'On Hold' | 'Completed' | 'Certified' | 'Placed' | 'Dropped' | 'Suspended';
  
  // Personal Info
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    avatar: string;
  };

  // Academic Info
  academicInfo: {
    college: string;
    department: 'CSE' | 'IT' | 'AI & DS' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil' | 'MBA';
    degree: string;
    year: number;
    cgpa: number;
    graduationYear: number;
  };

  // Internship Info
  internshipInfo: {
    program: string;
    internshipType: 'Free Internship' | 'Paid Internship' | 'Stipend Internship' | 'Industrial Internship' | 'Research Internship' | 'Corporate Internship';
    batchName: string;
    mentorId: string;
    mentorName: string;
    joiningDate: string;
    expectedCompletion: string;
  };

  documents: StudentDocument[];
  credentials: StudentCredentials;
  batch: StudentBatch;
  mentor: StudentMentor;
  performance: StudentPerformance;
  placement: StudentPlacement;
  timeline: StudentTimelineEvent[];
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    userId: '1', // Alice Freeman
    internId: 'INT-2026-001',
    applicationId: 'app-3',
    enrollmentDate: '2026-01-15',
    status: 'Active',
    personalInfo: {
      name: 'Alice Freeman',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      dob: '2004-05-12',
      gender: 'Female',
      address: '221B Baker St, London',
      avatar: 'AF'
    },
    academicInfo: {
      college: 'Stanford University',
      department: 'IT',
      degree: 'B.Tech',
      year: 3,
      cgpa: 9.2,
      graduationYear: 2027
    },
    internshipInfo: {
      program: 'Summer Software Engineering Internship',
      internshipType: 'Stipend Internship',
      batchName: 'Alpha Cohort 2026',
      mentorId: 'emp-2',
      mentorName: 'Bob Johnson',
      joiningDate: '2026-05-01',
      expectedCompletion: '2026-08-01'
    },
    documents: [
      { type: 'Resume', name: 'Alice_Freeman_CV.pdf', uploadDate: '2026-01-14', status: 'Verified', verifiedBy: 'System Admin', url: '#', previewText: 'Experience: Frontend Engineering, React, Tailwind CSS' },
      { type: 'College ID', name: 'Stanford_ID_Card.png', uploadDate: '2026-01-14', status: 'Verified', verifiedBy: 'System Admin', url: '#', previewText: 'Student ID: 948274-A, Expiry: 2027' },
      { type: 'Government ID', name: 'Driver_License.pdf', uploadDate: '2026-01-14', status: 'Pending', url: '#', previewText: 'ID No: DL-839201-UK, DOB: 2004' }
    ],
    credentials: {
      username: 'alice_f',
      portalAccess: true,
      lmsAccess: true,
      assessmentAccess: true
    },
    batch: {
      name: 'Alpha Cohort 2026',
      program: 'Summer Software Engineering Internship',
      startDate: '2026-05-01',
      endDate: '2026-08-01',
      mentor: 'Bob Johnson',
      status: 'Active'
    },
    mentor: {
      name: 'Bob Johnson',
      department: 'Technical Engineering',
      expertise: 'Full Stack Development',
      sessionsConducted: 8,
      rating: 4.8,
      feedbackGiven: [
        { date: '2026-05-20', content: 'Alice has adapted quickly. Her JavaScript logic is clean and fast.', reviewer: 'Bob Johnson' },
        { date: '2026-06-10', content: 'She completed the layout system ahead of schedule. Excellent progress.', reviewer: 'Bob Johnson' }
      ]
    },
    performance: {
      attendanceScore: 95,
      assessmentScore: 88,
      projectScore: 92,
      mentorRating: 4.8,
      overallPerformance: 91,
      attendanceTrend: [
        { date: 'Week 1', score: 100 },
        { date: 'Week 2', score: 100 },
        { date: 'Week 3', score: 90 },
        { date: 'Week 4', score: 95 },
        { date: 'Week 5', score: 92 }
      ],
      assessmentTrend: [
        { test: 'HTML/CSS Basics', score: 95 },
        { test: 'JS Fundamentals', score: 85 },
        { test: 'React Architecture', score: 90 },
        { test: 'State Mgmt', score: 82 }
      ],
      skills: [
        { name: 'JavaScript', value: 85 },
        { name: 'React', value: 90 },
        { name: 'CSS/UI Layouts', value: 95 },
        { name: 'APIs/Endpoints', value: 80 }
      ]
    },
    placement: {
      status: 'Placement Ready',
      company: 'TechCorp Solutions',
      package: '12 LPA',
      interviewStatus: 'Final Round Scheduled',
      offerStatus: 'Pending Interview'
    },
    timeline: [
      { date: '2026-01-14', title: 'Student Registered', description: 'Application registered through system.', type: 'registration' },
      { date: '2026-01-15', title: 'Application Approved', description: 'Selected for Summer Software Cohort.', type: 'approval' },
      { date: '2026-01-15', title: 'Intern ID Generated', description: 'Generated unique credential ID INT-2026-001.', type: 'id_card' },
      { date: '2026-05-01', title: 'Batch Assigned', description: 'Assigned to Alpha Cohort 2026.', type: 'batch' },
      { date: '2026-05-02', title: 'Mentor Assigned', description: 'Mapped to senior mentor Bob Johnson.', type: 'mentor' }
    ]
  },
  {
    id: 'stu-2',
    userId: '5', // Evan Wright
    internId: 'INT-2026-002',
    enrollmentDate: '2026-02-10',
    status: 'Completed',
    personalInfo: {
      name: 'Evan Wright',
      email: 'evan@example.com',
      phone: '+1 (555) 765-4321',
      dob: '2003-11-20',
      gender: 'Male',
      address: '742 Evergreen Terrace, Springfield',
      avatar: 'EW'
    },
    academicInfo: {
      college: 'MIT',
      department: 'CSE',
      degree: 'B.E.',
      year: 4,
      cgpa: 9.6,
      graduationYear: 2026
    },
    internshipInfo: {
      program: 'Data Science Boot Camp',
      internshipType: 'Free Internship',
      batchName: 'Sigma Cohort 2026',
      mentorId: 'emp-3',
      mentorName: 'Diana Prince',
      joiningDate: '2026-02-15',
      expectedCompletion: '2026-05-15'
    },
    documents: [
      { type: 'Resume', name: 'Evan_Wright_DS.pdf', uploadDate: '2026-02-09', status: 'Verified', verifiedBy: 'System Admin', url: '#', previewText: 'Python, Pandas, ML pipelines, NumPy' },
      { type: 'College ID', name: 'MIT_ID.png', uploadDate: '2026-02-09', status: 'Verified', verifiedBy: 'System Admin', url: '#', previewText: 'ID: 84938-DS' },
      { type: 'Completion Certificate', name: 'Completion_Cert_Evan.pdf', uploadDate: '2026-05-15', status: 'Verified', verifiedBy: 'System Admin', url: '#', previewText: 'PineSphere Certified Data Science Intern' }
    ],
    credentials: {
      username: 'evan_w',
      portalAccess: true,
      lmsAccess: true,
      assessmentAccess: true
    },
    batch: {
      name: 'Sigma Cohort 2026',
      program: 'Data Science Boot Camp',
      startDate: '2026-02-15',
      endDate: '2026-05-15',
      mentor: 'Diana Prince',
      status: 'Completed'
    },
    mentor: {
      name: 'Diana Prince',
      department: 'Data Operations',
      expertise: 'Machine Learning',
      sessionsConducted: 12,
      rating: 4.9,
      feedbackGiven: [
        { date: '2026-03-10', content: 'Evan has a solid grasp of statistics. Completed ETL module easily.', reviewer: 'Diana Prince' },
        { date: '2026-05-12', content: 'Outstanding ML Capstone. Ready for production roles.', reviewer: 'Diana Prince' }
      ]
    },
    performance: {
      attendanceScore: 98,
      assessmentScore: 96,
      projectScore: 95,
      mentorRating: 4.9,
      overallPerformance: 96,
      attendanceTrend: [
        { date: 'Week 1', score: 100 },
        { date: 'Week 2', score: 100 },
        { date: 'Week 3', score: 98 },
        { date: 'Week 4', score: 100 }
      ],
      assessmentTrend: [
        { test: 'Python Core', score: 100 },
        { test: 'SQL queries', score: 92 },
        { test: 'Data Cleaning', score: 95 },
        { test: 'ML Model Fitting', score: 97 }
      ],
      skills: [
        { name: 'Python', value: 98 },
        { name: 'SQL', value: 90 },
        { name: 'Machine Learning', value: 92 },
        { name: 'Pandas', value: 96 }
      ]
    },
    placement: {
      status: 'Placed',
      company: 'Neural Networks Corp',
      package: '18 LPA',
      interviewStatus: 'Hired',
      offerStatus: 'Accepted'
    },
    timeline: [
      { date: '2026-02-09', title: 'Student Registered', description: 'Application registered.', type: 'registration' },
      { date: '2026-02-10', title: 'Application Approved', description: 'Admitted to Data Science track.', type: 'approval' },
      { date: '2026-02-10', title: 'Intern ID Generated', description: 'Generated unique credential ID INT-2026-002.', type: 'id_card' },
      { date: '2026-02-15', title: 'Batch Assigned', description: 'Assigned to Sigma Cohort 2026.', type: 'batch' },
      { date: '2026-02-16', title: 'Mentor Assigned', description: 'Diana Prince mapped as primary mentor.', type: 'mentor' },
      { date: '2026-05-15', title: 'Program Completed', description: 'Successfully finished ML Capstone project.', type: 'cert' }
    ]
  },
  {
    id: 'stu-3',
    userId: 'stu-user-3',
    internId: 'INT-2026-003',
    enrollmentDate: '2026-01-20',
    status: 'Placed',
    personalInfo: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      dob: '2003-08-14',
      gender: 'Male',
      address: 'Flat 405, Orchid Residency, Mumbai',
      avatar: 'RS'
    },
    academicInfo: {
      college: 'IIT Madras',
      department: 'CSE',
      degree: 'B.Tech',
      year: 4,
      cgpa: 9.1,
      graduationYear: 2026
    },
    internshipInfo: {
      program: 'Industrial Training Academy',
      internshipType: 'Industrial Internship',
      batchName: 'Delta Cohort 2026',
      mentorId: 'emp-2',
      mentorName: 'Bob Johnson',
      joiningDate: '2026-02-01',
      expectedCompletion: '2026-05-01'
    },
    documents: [
      { type: 'Resume', name: 'Rahul_Sharma_Resume.pdf', uploadDate: '2026-01-19', status: 'Verified', verifiedBy: 'System Admin', url: '#' },
      { type: 'Offer Letter', name: 'Offer_Letter_PineSphere.pdf', uploadDate: '2026-01-25', status: 'Verified', verifiedBy: 'System Admin', url: '#' }
    ],
    credentials: {
      username: 'rahul_s',
      portalAccess: true,
      lmsAccess: true,
      assessmentAccess: false
    },
    batch: {
      name: 'Delta Cohort 2026',
      program: 'Industrial Training Academy',
      startDate: '2026-02-01',
      endDate: '2026-05-01',
      mentor: 'Bob Johnson',
      status: 'Completed'
    },
    mentor: {
      name: 'Bob Johnson',
      department: 'Technical Engineering',
      expertise: 'Full Stack Development',
      sessionsConducted: 10,
      rating: 4.7,
      feedbackGiven: [
        { date: '2026-03-01', content: 'Rahul is highly skilled in Docker and backend configuration.', reviewer: 'Bob Johnson' }
      ]
    },
    performance: {
      attendanceScore: 92,
      assessmentScore: 85,
      projectScore: 94,
      mentorRating: 4.7,
      overallPerformance: 90,
      attendanceTrend: [
        { date: 'W1', score: 95 },
        { date: 'W2', score: 90 },
        { date: 'W3', score: 92 }
      ],
      assessmentTrend: [
        { test: 'Docker/DevOps', score: 96 },
        { test: 'Node.js API', score: 80 }
      ],
      skills: [
        { name: 'Node.js', value: 88 },
        { name: 'Docker', value: 92 },
        { name: 'MongoDB', value: 85 }
      ]
    },
    placement: {
      status: 'Placed',
      company: 'Amazon India',
      package: '22 LPA',
      interviewStatus: 'Selected',
      offerStatus: 'Accepted'
    },
    timeline: [
      { date: '2026-01-19', title: 'Student Registered', description: 'Registration profile complete.', type: 'registration' },
      { date: '2026-01-20', title: 'Application Approved', description: 'Transferred to Delta cohort.', type: 'approval' },
      { date: '2026-02-01', title: 'Batch Assigned', description: 'Mapped to Delta Cohort.', type: 'batch' },
      { date: '2026-05-10', title: 'Placement Achieved', description: 'Acquired offer letter from Amazon.', type: 'placement' }
    ]
  },
  {
    id: 'stu-4',
    userId: 'stu-user-4',
    internId: 'INT-2026-004',
    enrollmentDate: '2026-03-10',
    status: 'Active',
    personalInfo: {
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 91234 56789',
      dob: '2004-09-22',
      gender: 'Female',
      address: 'A-22, Green Woods, Ahmedabad',
      avatar: 'PP'
    },
    academicInfo: {
      college: 'IIT Madras',
      department: 'AI & DS',
      degree: 'B.Tech',
      year: 3,
      cgpa: 8.9,
      graduationYear: 2027
    },
    internshipInfo: {
      program: 'Industrial Training Academy',
      internshipType: 'Paid Internship',
      batchName: 'Delta Cohort 2026',
      mentorId: 'emp-3',
      mentorName: 'Diana Prince',
      joiningDate: '2026-03-15',
      expectedCompletion: '2026-06-15'
    },
    documents: [
      { type: 'Resume', name: 'Priya_Patel_CV.pdf', uploadDate: '2026-03-08', status: 'Verified', verifiedBy: 'Diana Prince', url: '#' },
      { type: 'College ID', name: 'IIT_ID.jpg', uploadDate: '2026-03-08', status: 'Pending', url: '#' }
    ],
    credentials: {
      username: 'priya_p',
      portalAccess: true,
      lmsAccess: true,
      assessmentAccess: true
    },
    batch: {
      name: 'Delta Cohort 2026',
      program: 'Industrial Training Academy',
      startDate: '2026-03-15',
      endDate: '2026-06-15',
      mentor: 'Diana Prince',
      status: 'Active'
    },
    mentor: {
      name: 'Diana Prince',
      department: 'Data Operations',
      expertise: 'Machine Learning',
      sessionsConducted: 6,
      rating: 4.5,
      feedbackGiven: [
        { date: '2026-04-10', content: 'Good understanding of matrix math and neural configurations.', reviewer: 'Diana Prince' }
      ]
    },
    performance: {
      attendanceScore: 88,
      assessmentScore: 82,
      projectScore: 85,
      mentorRating: 4.5,
      overallPerformance: 85,
      attendanceTrend: [
        { date: 'W1', score: 90 },
        { date: 'W2', score: 85 }
      ],
      assessmentTrend: [
        { test: 'Linear Algebra', score: 85 },
        { test: 'PyTorch Basics', score: 80 }
      ],
      skills: [
        { name: 'PyTorch', value: 80 },
        { name: 'Math', value: 85 },
        { name: 'Pandas', value: 88 }
      ]
    },
    placement: {
      status: 'Eligible'
    },
    timeline: [
      { date: '2026-03-08', title: 'Student Registered', description: 'Self enrolled.', type: 'registration' },
      { date: '2026-03-10', title: 'Application Approved', description: 'Assigned to AI specialization.', type: 'approval' }
    ]
  },
  {
    id: 'stu-5',
    userId: 'stu-user-5',
    internId: 'INT-2026-005',
    enrollmentDate: '2026-04-05',
    status: 'On Hold',
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 987-6543',
      dob: '2005-01-30',
      gender: 'Male',
      address: '100 Main Street, Boston',
      avatar: 'JD'
    },
    academicInfo: {
      college: 'UC Berkeley',
      department: 'ECE',
      degree: 'B.S.',
      year: 2,
      cgpa: 7.2,
      graduationYear: 2028
    },
    internshipInfo: {
      program: 'Industrial Training Academy',
      internshipType: 'Corporate Internship',
      batchName: 'TBA',
      mentorId: 'emp-2',
      mentorName: 'Bob Johnson',
      joiningDate: '2026-05-15',
      expectedCompletion: '2026-08-15'
    },
    documents: [
      { type: 'Resume', name: 'John_Doe_Hardware.pdf', uploadDate: '2026-04-02', status: 'Rejected', url: '#' },
      { type: 'Government ID', name: 'Passport.pdf', uploadDate: '2026-04-02', status: 'Pending', url: '#' }
    ],
    credentials: {
      username: 'john_doe_99',
      portalAccess: false,
      lmsAccess: false,
      assessmentAccess: false
    },
    batch: {
      name: 'TBA',
      program: 'Industrial Training Academy',
      startDate: '2026-05-15',
      endDate: '2026-08-15',
      mentor: 'Bob Johnson',
      status: 'Upcoming'
    },
    mentor: {
      name: 'Bob Johnson',
      department: 'Technical Engineering',
      expertise: 'Embedded Systems',
      sessionsConducted: 0,
      rating: 3.5,
      feedbackGiven: []
    },
    performance: {
      attendanceScore: 70,
      assessmentScore: 62,
      projectScore: 0,
      mentorRating: 3.5,
      overallPerformance: 55,
      attendanceTrend: [],
      assessmentTrend: [],
      skills: [
        { name: 'C++', value: 70 },
        { name: 'Microcontrollers', value: 65 }
      ]
    },
    placement: {
      status: 'Not Eligible'
    },
    timeline: [
      { date: '2026-04-02', title: 'Student Registered', description: 'Profile configured.', type: 'registration' },
      { date: '2026-04-05', title: 'Put On Hold', description: 'Awaiting updated college bonafide document.', type: 'info' }
    ]
  },
  {
    id: 'stu-6',
    userId: 'stu-user-6',
    internId: 'INT-2026-006',
    enrollmentDate: '2026-06-01',
    status: 'Applied',
    personalInfo: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 456-7890',
      dob: '2004-03-15',
      gender: 'Female',
      address: '456 Oak Lane, Seattle',
      avatar: 'JS'
    },
    academicInfo: {
      college: 'Stanford University',
      department: 'EEE',
      degree: 'B.Tech',
      year: 3,
      cgpa: 8.5,
      graduationYear: 2027
    },
    internshipInfo: {
      program: 'Research Program (Quantum Theory)',
      internshipType: 'Research Internship',
      batchName: 'Quantum Cohort 1',
      mentorId: 'emp-3',
      mentorName: 'Diana Prince',
      joiningDate: '2026-07-01',
      expectedCompletion: '2026-10-01'
    },
    documents: [
      { type: 'Resume', name: 'Jane_Smith_Academic.pdf', uploadDate: '2026-05-30', status: 'Pending', url: '#' }
    ],
    credentials: {
      username: 'jane_smith',
      portalAccess: false,
      lmsAccess: false,
      assessmentAccess: false
    },
    batch: {
      name: 'Quantum Cohort 1',
      program: 'Research Program (Quantum Theory)',
      startDate: '2026-07-01',
      endDate: '2026-10-01',
      mentor: 'Diana Prince',
      status: 'Upcoming'
    },
    mentor: {
      name: 'Diana Prince',
      department: 'Data Operations',
      expertise: 'Quantum Computing Theory',
      sessionsConducted: 0,
      rating: 5.0,
      feedbackGiven: []
    },
    performance: {
      attendanceScore: 100,
      assessmentScore: 100,
      projectScore: 100,
      mentorRating: 5.0,
      overallPerformance: 100,
      attendanceTrend: [],
      assessmentTrend: [],
      skills: [
        { name: 'Quantum Mechanics', value: 90 },
        { name: 'Linear Algebra', value: 92 }
      ]
    },
    placement: {
      status: 'Not Eligible'
    },
    timeline: [
      { date: '2026-05-30', title: 'Student Registered', description: 'Application registration submitted.', type: 'registration' }
    ]
  }
];
