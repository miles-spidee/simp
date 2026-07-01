import { ActivityLog } from '../types/activity.types';
import { MOCK_ACTIVITIES } from '../data/mock-activities';

export const activityApi = {
  getAllActivities: async (): Promise<ActivityLog[]> => {
    return Promise.resolve([...MOCK_ACTIVITIES]);
  },
  
  getActivityById: async (id: string): Promise<ActivityLog | undefined> => {
    return Promise.resolve(MOCK_ACTIVITIES.find(a => a.id === id));
  },

  getActivitiesByUser: async (userId: string): Promise<ActivityLog[]> => {
    return Promise.resolve(MOCK_ACTIVITIES.filter(a => a.userId === userId));
  }
};
