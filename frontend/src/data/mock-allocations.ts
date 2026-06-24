export interface AllocationTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'create' | 'mentor' | 'batch' | 'program' | 'college' | 'conflict' | 'resolve' | 'info';
}

export interface Allocation {
  id: string;
  studentId: string;
  studentName: string;
  internId: string;
  programId: string;
  programName: string;
  batchId: string;
  batchName: string;
  mentorId: string;
  mentorName: string;
  collegeId: string;
  collegeName: string;
  department: string;
  allocationDate: string;
  status: 'Allocated' | 'Pending' | 'Waitlisted' | 'Reassigned' | 'Dropped';
  timeline: AllocationTimelineEvent[];
}

export const MOCK_ALLOCATIONS: Allocation[] = [
  {
    id: 'alloc-1',
    studentId: 'stu-1',
    studentName: 'Alice Freeman',
    internId: 'INT-2026-001',
    programId: 'prog-1',
    programName: 'Summer Software Engineering Internship',
    batchId: 'batch-1',
    batchName: 'Alpha Cohort 2026',
    mentorId: 'emp-2',
    mentorName: 'Bob Johnson',
    collegeId: 'org-1',
    collegeName: 'Stanford University',
    department: 'IT',
    allocationDate: '2026-01-15',
    status: 'Allocated',
    timeline: [
      { date: '2026-01-15', title: 'Allocation Record Initialized', description: 'Student registered in PLMS database.', type: 'create' },
      { date: '2026-05-01', title: 'Program & Batch Assigned', description: 'Assigned to Alpha Cohort 2026 batch.', type: 'batch' },
      { date: '2026-05-02', title: 'Lead Coach Mapped', description: 'Mapped to senior mentor Bob Johnson.', type: 'mentor' }
    ]
  },
  {
    id: 'alloc-2',
    studentId: 'stu-2',
    studentName: 'Evan Wright',
    internId: 'INT-2026-002',
    programId: 'prog-2',
    programName: 'Data Science Boot Camp',
    batchId: 'batch-2',
    batchName: 'Sigma Cohort 2026',
    mentorId: 'emp-3',
    mentorName: 'Diana Prince',
    collegeId: 'org-2',
    collegeName: 'MIT',
    department: 'CSE',
    allocationDate: '2026-02-10',
    status: 'Allocated',
    timeline: [
      { date: '2026-02-10', title: 'Allocation Created', description: 'Student registered.', type: 'create' },
      { date: '2026-02-15', title: 'Batch Assigned', description: 'Assigned to Sigma Cohort 2026.', type: 'batch' },
      { date: '2026-02-16', title: 'Coach Mapped', description: 'Mapped to Diana Prince.', type: 'mentor' }
    ]
  },
  {
    id: 'alloc-3',
    studentId: 'stu-3',
    studentName: 'Rahul Sharma',
    internId: 'INT-2026-003',
    programId: 'prog-1',
    programName: 'Industrial Training Academy',
    batchId: 'batch-4',
    batchName: 'Delta Cohort 2026',
    mentorId: 'emp-2',
    mentorName: 'Bob Johnson',
    collegeId: 'org-3',
    collegeName: 'IIT Madras',
    department: 'CSE',
    allocationDate: '2026-01-20',
    status: 'Allocated',
    timeline: [
      { date: '2026-01-19', title: 'Roster Configured', description: 'Student registered in system.', type: 'create' },
      { date: '2026-02-01', title: 'Batch Allocation Mapped', description: 'Assigned to Delta Cohort 2026.', type: 'batch' },
      { date: '2026-02-02', title: 'Mentor Remapped', description: 'Mapped to Bob Johnson.', type: 'mentor' }
    ]
  },
  {
    id: 'alloc-4',
    studentId: 'stu-4',
    studentName: 'Priya Patel',
    internId: 'INT-2026-004',
    programId: 'prog-1',
    programName: 'Industrial Training Academy',
    batchId: 'batch-1',
    batchName: 'Delta Cohort 2026',
    mentorId: 'emp-3',
    mentorName: 'Diana Prince',
    collegeId: 'org-3',
    collegeName: 'IIT Madras',
    department: 'AI & DS',
    allocationDate: '2026-03-10',
    status: 'Allocated',
    timeline: [
      { date: '2026-03-08', title: 'Roster Configured', description: 'Roster profile created.', type: 'create' },
      { date: '2026-03-15', title: 'Batch Assigned', description: 'Mapped to Delta Cohort.', type: 'batch' },
      { date: '2026-03-16', title: 'Lead Coach Assigned', description: 'Diana Prince assigned as mentor.', type: 'mentor' }
    ]
  },
  {
    id: 'alloc-5',
    studentId: 'stu-5',
    studentName: 'John Doe',
    internId: 'INT-2026-005',
    programId: 'prog-1',
    programName: 'Industrial Training Academy',
    batchId: '',
    batchName: 'TBA',
    mentorId: 'emp-2',
    mentorName: 'Bob Johnson',
    collegeId: 'org-3',
    collegeName: 'UC Berkeley',
    department: 'ECE',
    allocationDate: '2026-04-05',
    status: 'Pending',
    timeline: [
      { date: '2026-04-02', title: 'Allocation Shell Created', description: 'Allocation record created.', type: 'create' },
      { date: '2026-04-05', title: 'Allocation Halted', description: 'Roster suspended. Awaiting batch allocation.', type: 'conflict' }
    ]
  },
  {
    id: 'alloc-6',
    studentId: 'stu-6',
    studentName: 'Jane Smith',
    internId: 'INT-2026-006',
    programId: 'prog-6',
    programName: 'Research Program (Quantum Theory)',
    batchId: 'batch-5',
    batchName: 'Quantum Cohort 1',
    mentorId: 'emp-3',
    mentorName: 'Diana Prince',
    collegeId: 'org-1',
    collegeName: 'Stanford University',
    department: 'EEE',
    allocationDate: '2026-06-01',
    status: 'Waitlisted',
    timeline: [
      { date: '2026-05-30', title: 'Roster Configured', description: 'Roster details registered.', type: 'create' },
      { date: '2026-06-01', title: 'Put on Waitlist', description: 'Waitlisted due to program capacity restraints.', type: 'conflict' }
    ]
  }
];
