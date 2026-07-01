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
  },
  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    await delay(300);
    const newNotif: Notification = {
      id: `notif-${MOCK_NOTIFICATIONS.length + 1}`,
      title: data.title || '',
      message: data.message || '',
      recipient: data.recipient || 'all',
      role: data.role || 'All',
      module: data.module || 'Announcement',
      channel: data.channel || 'In-App Notification',
      priority: data.priority || 'Medium',
      status: data.status || 'Delivered',
      readStatus: false,
      retryCount: 0,
      createdTime: new Date().toISOString()
    };
    MOCK_NOTIFICATIONS.push(newNotif);
    return newNotif;
  }
};
