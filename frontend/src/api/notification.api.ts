import { apiClient } from './api.client';
import { Notification } from '../types/notification.types';
import {} from '../types/notifications.types';


export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const res = await apiClient.get('/api/v1/notification');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getNotificationById: async (id: string): Promise<Notification | undefined> => {
    try {
      const res = await apiClient.get('/api/v1/notification');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const res = await apiClient.patch(`/api/v1/notification/${id}`, { status: 'Read', readStatus: true });
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    try {
      const res = await apiClient.post('/api/v1/notification', data);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
