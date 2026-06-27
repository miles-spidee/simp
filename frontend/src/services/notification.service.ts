import { notificationApi } from '../api/notification.api';
import { Notification } from '../types/notification.types';

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    return notificationApi.getNotifications();
  }

  static async getUnreadCount(): Promise<number> {
    const notifications = await notificationApi.getNotifications();
    return notifications.filter(n => !n.readStatus).length;
  }

  static async markAsRead(id: string): Promise<Notification> {
    return notificationApi.markAsRead(id);
  }

  static async getScheduledNotifications(): Promise<Notification[]> {
    const notifications = await notificationApi.getNotifications();
    return notifications.filter(n => n.status === 'Scheduled');
  }

  static async getDeliveryStats(): Promise<{ delivered: number, failed: number, read: number }> {
    const notifications = await notificationApi.getNotifications();
    return {
      delivered: notifications.filter(n => n.status === 'Delivered' || n.status === 'Read').length,
      failed: notifications.filter(n => n.status === 'Failed').length,
      read: notifications.filter(n => n.readStatus).length,
    };
  }

  static async createNotification(data: Partial<Notification>): Promise<Notification> {
    return notificationApi.createNotification(data);
  }
}
