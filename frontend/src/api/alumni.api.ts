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
      const res = await apiClient.post('/api/v1/alumni', alumni);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  deleteAlumni: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/alumni/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
};
