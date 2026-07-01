import { apiClient } from './api.client';
import { MentorProfile, MentorCreate, MentorUpdate, MentorAssignment, MentorAssignmentCreate, MentorBatchMapping, MentorBatchMappingCreate } from '../types/api/mentor.types';

export const mentorApi = {
  getMentorProfiles: async (): Promise<MentorProfile[]> => {
    const res = await apiClient.get<MentorProfile[]>('/mentors/profiles');
    return res.data;
  },

  getMentorProfile: async (id: string): Promise<MentorProfile> => {
    const res = await apiClient.get<MentorProfile>(`/mentors/profiles/${id}`);
    return res.data;
  },

  createMentorProfile: async (data: MentorCreate): Promise<MentorProfile> => {
    const res = await apiClient.post<MentorProfile>('/mentors/profiles', data);
    return res.data;
  },

  updateMentorProfile: async (id: string, updates: MentorUpdate): Promise<MentorProfile> => {
    const res = await apiClient.patch<MentorProfile>(`/mentors/profiles/${id}`, updates);
    return res.data;
  },

  getAssignments: async (): Promise<MentorAssignment[]> => {
    const res = await apiClient.get<MentorAssignment[]>('/mentors/assignments');
    return res.data;
  },

  createAssignment: async (data: MentorAssignmentCreate): Promise<MentorAssignment> => {
    const res = await apiClient.post<MentorAssignment>('/mentors/assignments', data);
    return res.data;
  },

  getBatchMappings: async (): Promise<MentorBatchMapping[]> => {
    const res = await apiClient.get<MentorBatchMapping[]>('/mentors/batch-mappings');
    return res.data;
  },

  createBatchMapping: async (data: MentorBatchMappingCreate): Promise<MentorBatchMapping> => {
    const res = await apiClient.post<MentorBatchMapping>('/mentors/batch-mappings', data);
    return res.data;
  },
};
