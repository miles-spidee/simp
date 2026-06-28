import { MentorProfile, MentorAssignment, MentorBatchMapping } from '../types/api/mentor.types';
import { MOCK_MENTOR_PROFILES } from '../data/mock-mentors';
import { MOCK_MENTOR_ASSIGNMENTS } from '../data/mock-mentor-assignments';
import { MOCK_MENTOR_BATCH_MAPPINGS } from '../data/mock-mentor-batch-mappings';
import { mentorApi } from '../api/mentor.api';

export const mentorService = {
  async getMentorProfiles(): Promise<MentorProfile[]> {
    try {
      const data = await mentorApi.getMentorProfiles();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return [...MOCK_MENTOR_PROFILES];
  },

  async getMentorProfile(id: string): Promise<MentorProfile | undefined> {
    try {
      const data = await mentorApi.getMentorProfile(id);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
    return MOCK_MENTOR_PROFILES.find(m => m.mentor_profile_id === id);
  },

  async createMentorProfile(
    profile: Omit<MentorProfile, 'mentor_profile_id' | 'created_at' | 'updated_at'>
  ): Promise<MentorProfile> {
    try {
      const data = await mentorApi.createMentorProfile(profile);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
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
    try {
      const data = await mentorApi.updateMentorProfile(id, updates);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
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
    try {
      const data = await mentorApi.getAssignments();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return [...MOCK_MENTOR_ASSIGNMENTS];
  },

  async createAssignment(
    assignment: Omit<MentorAssignment, 'id'>
  ): Promise<MentorAssignment> {
    try {
      const data = await mentorApi.createAssignment(assignment);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
    const newAssignment: MentorAssignment = {
      ...assignment,
      id: `ma-${MOCK_MENTOR_ASSIGNMENTS.length + 1}`,
    };
    MOCK_MENTOR_ASSIGNMENTS.push(newAssignment);
    return newAssignment;
  },

  async getBatchMappings(): Promise<MentorBatchMapping[]> {
    try {
      const data = await mentorApi.getBatchMappings();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return [...MOCK_MENTOR_BATCH_MAPPINGS];
  },

  async createBatchMapping(
    mapping: Omit<MentorBatchMapping, 'id'>
  ): Promise<MentorBatchMapping> {
    try {
      const data = await mentorApi.createBatchMapping(mapping);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
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
