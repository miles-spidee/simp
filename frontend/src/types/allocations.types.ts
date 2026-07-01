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