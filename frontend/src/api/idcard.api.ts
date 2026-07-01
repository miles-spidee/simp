import { apiClient } from './api.client';
import { DigitalIDCard } from '../types/idcard.types';
import {} from '../types/idcards.types';

const DELAY = 500;

export const IDCardAPI = {
  getIDCards: async (): Promise<DigitalIDCard[]> => {
    try {
      const res = await apiClient.get('/api/v1/idcard');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  getMyIDCard: async (studentId: string): Promise<DigitalIDCard | null> => {
    try {
      const res = await apiClient.get('/api/v1/idcard');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
