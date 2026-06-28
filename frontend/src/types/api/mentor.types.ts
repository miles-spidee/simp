export interface MentorProfile {
  mentor_profile_id: string;
  employee_id: string;
  employeeName: string;
  mentor_bio: string;
  mentor_expertise: string[];
  years_of_experience: number;
  max_student_capacity: number;
  current_student_count: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorAssignment {
  id: string;
  mentorProfileId: string;
  mentorName: string;
  employeeId: string;
  studentId: string;
  studentName: string;
  internId: string;
  batchId: string;
  batchName: string;
  assignedDate: string;
  status: 'Active' | 'Completed' | 'Transferred';
  assignedBy: string;
}

export interface MentorBatchMapping {
  id: string;
  mentorProfileId: string;
  mentorName: string;
  employeeId: string;
  batchId: string;
  batchName: string;
  batchCode: string;
  programName: string;
  studentCount: number;
  batchCapacity: number;
  mappedDate: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  mappedBy: string;
}

export type MentorCreate = Omit<MentorProfile, 'mentor_profile_id' | 'created_at' | 'updated_at'>;
export type MentorUpdate = Partial<Pick<MentorProfile, 'mentor_bio' | 'mentor_expertise' | 'years_of_experience' | 'max_student_capacity' | 'is_available'>>;
export type MentorAssignmentCreate = Omit<MentorAssignment, 'id'>;
export type MentorBatchMappingCreate = Omit<MentorBatchMapping, 'id'>;
