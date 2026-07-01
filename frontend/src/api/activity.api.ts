import { apiClient } from './api.client';
import { ActivityLog } from '../types/activity.types';
import {} from '../types/activities.types';

export const activityApi = {
  getAllActivities: async (): Promise<ActivityLog[]> => {
    try {
      const res = await apiClient.get('/api/v1/activity');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getActivityById: async (id: string): Promise<ActivityLog | undefined> => {
    try {
      const res = await apiClient.get('/api/v1/activity');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  getActivitiesByUser: async (userId: string): Promise<ActivityLog[]> => {
    try {
      const res = await apiClient.get('/api/v1/activity');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
