import { apiClient } from '../api/api.client';
import { OpeningMentor } from '../types/opening-mentors.types';

class OpeningMentorsService {
  async getMentorsForOpportunity(opportunityId: string): Promise<OpeningMentor[]> {
    try {
      const res = await apiClient.get('/api/v1/opening-mentors');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async assignMentor(data: Omit<OpeningMentor, 'id' | 'assignedDate'>): Promise<OpeningMentor> {
    try {
      const res = await apiClient.get('/api/v1/opening-mentors');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
}

export const openingMentorsService = new OpeningMentorsService();
