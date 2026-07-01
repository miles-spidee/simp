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