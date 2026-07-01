import { apiClient } from './api.client';
import { SelfServiceDashboard, UserProfile } from '../types/selfservice.types';
import {} from '../types/self-service.types';

const DELAY = 500;

export const SelfServiceAPI = {
  getDashboard: async (): Promise<SelfServiceDashboard> => {
    try {
      const res = await apiClient.get('/api/v1/selfservice');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const res = await apiClient.patch('/api/v1/selfservice');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
