import { MentorProfile, MOCK_MENTOR_PROFILES } from '../data/mock-mentors';
import { MentorAssignment, MOCK_MENTOR_ASSIGNMENTS } from '../data/mock-mentor-assignments';
import { MentorBatchMapping, MOCK_MENTOR_BATCH_MAPPINGS } from '../data/mock-mentor-batch-mappings';

export const mentorService = {
  async getMentorProfiles(): Promise<MentorProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_MENTOR_PROFILES];
  },

  async getMentorProfile(id: string): Promise<MentorProfile | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_MENTOR_PROFILES.find(m => m.mentor_profile_id === id);
  },

  async createMentorProfile(
    profile: Omit<MentorProfile, 'mentor_profile_id' | 'created_at' | 'updated_at'>
  ): Promise<MentorProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProfile: MentorProfile = {
      ...profile,
      mentor_profile_id: `mp-${MOCK_MENTOR_PROFILES.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_MENTOR_PROFILES.push(newProfile);
    return newProfile;
  },

  async updateMentorProfile(
    id: string,
    updates: Partial<Pick<MentorProfile, 'mentor_bio' | 'mentor_expertise' | 'years_of_experience' | 'max_student_capacity' | 'is_available'>>
  ): Promise<MentorProfile | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_MENTOR_PROFILES.findIndex(m => m.mentor_profile_id === id);
    if (idx === -1) return undefined;
    MOCK_MENTOR_PROFILES[idx] = {
      ...MOCK_MENTOR_PROFILES[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return MOCK_MENTOR_PROFILES[idx];
  },

  async getAssignments(): Promise<MentorAssignment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_MENTOR_ASSIGNMENTS];
  },

  async createAssignment(
    assignment: Omit<MentorAssignment, 'id'>
  ): Promise<MentorAssignment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAssignment: MentorAssignment = {
      ...assignment,
      id: `ma-${MOCK_MENTOR_ASSIGNMENTS.length + 1}`,
    };
    MOCK_MENTOR_ASSIGNMENTS.push(newAssignment);
    return newAssignment;
  },

  async getBatchMappings(): Promise<MentorBatchMapping[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_MENTOR_BATCH_MAPPINGS];
  },

  async createBatchMapping(
    mapping: Omit<MentorBatchMapping, 'id'>
  ): Promise<MentorBatchMapping> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMapping: MentorBatchMapping = {
      ...mapping,
      id: `mbm-${MOCK_MENTOR_BATCH_MAPPINGS.length + 1}`,
    };
    MOCK_MENTOR_BATCH_MAPPINGS.push(newMapping);
    return newMapping;
  },

  /** @deprecated Use getMentorProfiles */
  async getMentors(): Promise<MentorProfile[]> {
    return this.getMentorProfiles();
  },

  /** @deprecated Use getMentorProfile */
  async getMentor(id: string): Promise<MentorProfile | undefined> {
    return this.getMentorProfile(id);
  },
};
