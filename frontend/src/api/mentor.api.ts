import { apiClient } from './api.client';
import { MentorProfile, MentorCreate, MentorUpdate, MentorAssignment, MentorAssignmentCreate, MentorBatchMapping, MentorBatchMappingCreate } from '../types/api/mentor.types';

const mapToFrontend = (b: any): MentorProfile => ({
  mentor_profile_id: b.mentor_profile_id || b.id,
  user_id: b.user_id,
  employee_id: b.employee_profile_id || '',
  employeeName: b.employeeName || '',
  mentor_bio: b.expertise || '',
  mentor_expertise: b.expertise ? b.expertise.split(',').map((s: string) => s.trim()) : [],
  years_of_experience: b.years_of_experience || 0,
  max_student_capacity: b.max_capacity || 0,
  current_student_count: b.current_student_count || 0,
  is_available: b.is_available ?? true,
  created_at: b.created_at || '',
  updated_at: b.updated_at || '',
});

export const mentorApi = {
  getMentorProfiles: async (): Promise<MentorProfile[]> => {
    const res = await apiClient.get('/api/v1/mentor/');
    const data = res.data?.data || [];
    return data.map(mapToFrontend);
  },

  getMentorProfile: async (id: string): Promise<MentorProfile> => {
    const res = await apiClient.get(`/api/v1/mentor/${id}`);
    const data = res.data?.data || res.data;
    return mapToFrontend(data);
  },

  createMentorProfile: async (data: MentorCreate): Promise<MentorProfile> => {
    const payload = {
      user_id: data.user_id,
      employee_profile_id: data.employee_id || undefined,
      expertise: data.mentor_expertise?.join(', ') || data.mentor_bio || '',
      years_of_experience: data.years_of_experience,
      max_capacity: data.max_student_capacity,
      is_available: data.is_available,
    };
    const res = await apiClient.post('/api/v1/mentor/', payload);
    const result = res.data?.data || res.data;
    return mapToFrontend(result);
  },

  updateMentorProfile: async (id: string, updates: MentorUpdate): Promise<MentorProfile> => {
    const payload: any = {};
    if (updates.mentor_expertise || updates.mentor_bio) {
      payload.expertise = updates.mentor_expertise?.join(', ') || updates.mentor_bio || '';
    }
    if (updates.years_of_experience !== undefined) payload.years_of_experience = updates.years_of_experience;
    if (updates.max_student_capacity !== undefined) payload.max_capacity = updates.max_student_capacity;
    if (updates.is_available !== undefined) payload.is_available = updates.is_available;
    
    const res = await apiClient.put(`/api/v1/mentor/${id}`, payload);
    const result = res.data?.data || res.data;
    return mapToFrontend(result);
  },

  deleteMentorProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/mentor/${id}`);
  },

  getAssignments: async (): Promise<MentorAssignment[]> => {
    const res = await apiClient.get<MentorAssignment[]>('/api/v1/mentor/assignments/');
    return res.data;
  },

  createAssignment: async (data: MentorAssignmentCreate): Promise<MentorAssignment> => {
    const res = await apiClient.post<MentorAssignment>('/api/v1/mentor/assignments/', data);
    return res.data;
  },

  getBatchMappings: async (): Promise<MentorBatchMapping[]> => {
    const res = await apiClient.get<MentorBatchMapping[]>('/api/v1/mentor/batch-mappings/');
    return res.data;
  },

  createBatchMapping: async (data: MentorBatchMappingCreate): Promise<MentorBatchMapping> => {
    const res = await apiClient.post<MentorBatchMapping>('/api/v1/mentor/batch-mappings/', data);
    return res.data;
  },
};
