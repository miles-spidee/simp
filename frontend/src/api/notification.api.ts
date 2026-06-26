import { Notification } from '../types/notification.types';
import { MOCK_NOTIFICATIONS } from '../data/mock-notifications';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    await delay(600);
    return [...MOCK_NOTIFICATIONS].sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
  },
  getNotificationById: async (id: string): Promise<Notification | undefined> => {
    await delay(300);
    return MOCK_NOTIFICATIONS.find(n => n.id === id);
  },
  markAsRead: async (id: string): Promise<Notification> => {
    await delay(300);
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (!notif) throw new Error('Notification not found');
    notif.readStatus = true;
    return notif;
  }
};
