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

export const MOCK_MENTOR_PROFILES: MentorProfile[] = [];

export const MOCK_MENTORS: Mentor[] = MOCK_MENTOR_PROFILES.map(toLegacy);
