export interface Mentor {
  id: string;
  employeeId: string;
  batchIds: string[];
  mentor_bio: string;
  mentor_expertise: string[];
  years_of_experience: number;
  max_student_capacity: number;
  current_student_count: number;
  is_available: boolean;
}

export const MOCK_MENTORS: Mentor[] = [
  { id: 'men-1', employeeId: 'emp-2', batchIds: ['batch-1', 'batch-2'], mentor_bio: 'Senior Software Engineer specializing in frontend architectures.', mentor_expertise: ['React', 'Node.js', 'System Design'], years_of_experience: 8, max_student_capacity: 10, current_student_count: 5, is_available: true },
  { id: 'men-2', employeeId: 'emp-1', batchIds: ['batch-3'], mentor_bio: 'Engineering Manager with a passion for building agile teams.', mentor_expertise: ['Leadership', 'Agile', 'HR'], years_of_experience: 12, max_student_capacity: 5, current_student_count: 5, is_available: false },
];
