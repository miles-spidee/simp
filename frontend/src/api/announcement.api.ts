import { apiClient } from './api.client';
import { Announcement } from '../types/announcement.types';
import {} from '../types/announcements.types';


export const announcementApi = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const res = await apiClient.get('/api/v1/announcement');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  createAnnouncement: async (data: Partial<Announcement>): Promise<Announcement> => {
    try {
      const res = await apiClient.post('/api/v1/announcement', data);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
