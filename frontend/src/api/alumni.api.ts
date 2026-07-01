import { apiClient } from './api.client';
import { AlumniProfile } from '../types/alumni.types';
import {} from '../types/alumni.types';


export const AlumniApi = {
  getAlumni: async (): Promise<AlumniProfile[]> => {
    try {
      const res = await apiClient.get('/api/v1/alumni');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  createAlumni: async (alumni: Partial<AlumniProfile>): Promise<AlumniProfile> => {
    try {
      const res = await apiClient.post('/api/v1/alumni');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
