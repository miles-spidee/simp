import { MentorProfile } from '../types/api/mentor.types';

/** @deprecated Use MentorProfile — kept for backward compatibility */
export type Mentor = MentorProfile & { id: string; employeeId: string; batchIds: string[] };

function toLegacy(m: MentorProfile): Mentor {
  return {
    ...m,
    id: m.mentor_profile_id,
    employeeId: m.employee_id,
    batchIds: [],
  };
}

export const MOCK_MENTOR_PROFILES: MentorProfile[] = [
  {
    mentor_profile_id: 'men-1',
    employee_id: 'emp-2',
    employeeName: 'Bob Johnson',
    mentor_bio: 'Senior Software Engineer specializing in frontend architectures and scalable system design.',
    mentor_expertise: ['React', 'Node.js', 'System Design'],
    years_of_experience: 8,
    max_student_capacity: 10,
    current_student_count: 3,
    is_available: true,
    created_at: '2023-03-12T09:00:00Z',
    updated_at: '2026-06-20T14:30:00Z',
  },
  {
    mentor_profile_id: 'men-2',
    employee_id: 'emp-3',
    employeeName: 'Diana Prince',
    mentor_bio: 'Data operations specialist with expertise in machine learning mentorship and cohort facilitation.',
    mentor_expertise: ['Machine Learning', 'Data Science', 'Leadership'],
    years_of_experience: 10,
    max_student_capacity: 8,
    current_student_count: 1,
    is_available: true,
    created_at: '2023-06-25T10:00:00Z',
    updated_at: '2026-06-18T11:00:00Z',
  },
];

export const MOCK_MENTORS: Mentor[] = MOCK_MENTOR_PROFILES.map(toLegacy);
