import { activityApi } from '../api/activity.api';
import { ActivityLog } from '../types/activity.types';

export const activityService = {
  getActivityStats: async () => {
    const activities = await activityApi.getAllActivities();
    return {
      totalLogs: activities.length,
      successLogs: activities.filter(a => a.status === 'Success').length,
      failedLogs: activities.filter(a => a.status === 'Failed').length,
      criticalLogs: activities.filter(a => a.severity === 'Critical').length,
    };
  },

  getAllActivities: async (): Promise<ActivityLog[]> => {
    return await activityApi.getAllActivities();
  }
};
