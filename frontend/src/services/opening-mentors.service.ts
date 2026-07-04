import { apiClient } from '../api/api.client';
import { OpeningMentor } from '../types/opening-mentors.types';

class OpeningMentorsService {
  async getMentorsForOpportunity(opportunityId: string): Promise<OpeningMentor[]> {
    try {
      const res = await apiClient.get(`/api/v1/opportunity/${opportunityId}/mentors`);
      return (res.data || []).map((m: any) => ({
        id: m.id,
        opportunityId: m.opportunity_id,
        mentorId: m.mentor_profile_id,
        role: 'Lead Mentor', // Default role since backend doesn't store it
        workload: 10, // Default workload since backend doesn't store it
        assignedDate: m.created_at || new Date().toISOString()
      }));
    } catch (error) {
      return [];
    }
  }

  async assignMentor(data: any): Promise<OpeningMentor> {
    try {
      const res = await apiClient.post(`/api/v1/opportunity/${data.opportunityId}/mentors`, { 
        mentor_profile_id: data.mentorId,
        role: data.role,
        workload: data.workload
      });
      const m = res.data;
      return {
        id: m.id,
        opportunityId: m.opportunity_id,
        mentorId: m.mentor_profile_id,
        role: data.role || 'Lead Mentor',
        workload: data.workload || 10,
        assignedDate: m.created_at || new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Assign mentor error:', error?.response?.data || error);
      throw error;
    }
  }

  async removeMentor(opportunityId: string, mentorId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/opportunity/${opportunityId}/mentors/${mentorId}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export const openingMentorsService = new OpeningMentorsService();
