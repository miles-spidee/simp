import { apiClient } from './api.client';
import { MentorProfile, MentorCreate, MentorUpdate, MentorAssignment, MentorAssignmentCreate, MentorBatchMapping, MentorBatchMappingCreate } from '../types/api/mentor.types';

export const mentorApi = {
  getMentorProfiles: async (): Promise<MentorProfile[]> => {
    const res = await apiClient.get('/api/v1/mentor');
    return res.data?.data || [];
  },

  getMentorProfile: async (id: string): Promise<MentorProfile> => {
    const res = await apiClient.get(`/api/v1/mentor/${id}`);
    return res.data?.data || res.data;
  },

  createMentorProfile: async (data: MentorCreate): Promise<MentorProfile> => {
    const res = await apiClient.post<MentorProfile>('/api/v1/mentor', data);
    return res.data;
  },

  updateMentorProfile: async (id: string, updates: MentorUpdate): Promise<MentorProfile> => {
    const res = await apiClient.patch<MentorProfile>(`/api/v1/mentor/${id}`, updates);
    return res.data;
  },

  getAssignments: async (): Promise<MentorAssignment[]> => {
    const res = await apiClient.get<MentorAssignment[]>('/api/v1/mentor/assignments');
    return res.data;
  },

  createAssignment: async (data: MentorAssignmentCreate): Promise<MentorAssignment> => {
    const res = await apiClient.post<MentorAssignment>('/api/v1/mentor/assignments', data);
    return res.data;
  },

  getBatchMappings: async (): Promise<MentorBatchMapping[]> => {
    const res = await apiClient.get<MentorBatchMapping[]>('/api/v1/mentor/batch-mappings');
    return res.data;
  },

  createBatchMapping: async (data: MentorBatchMappingCreate): Promise<MentorBatchMapping> => {
    const res = await apiClient.post<MentorBatchMapping>('/api/v1/mentor/batch-mappings', data);
    return res.data;
  },
};
