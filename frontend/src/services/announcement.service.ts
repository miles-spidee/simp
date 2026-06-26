import { announcementApi } from '../api/announcement.api';
import { Announcement } from '../types/announcement.types';

export class AnnouncementService {
  static async getAnnouncements(role?: string): Promise<Announcement[]> {
    const announcements = await announcementApi.getAnnouncements();
    if (role) {
      return announcements.filter(a => a.audience.includes('All') || a.audience.includes(role));
    }
    return announcements;
  }

  static async getPendingAnnouncements(): Promise<Announcement[]> {
    const announcements = await announcementApi.getAnnouncements();
    return announcements.filter(a => a.status === 'Draft');
  }

  static async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    return announcementApi.createAnnouncement(data);
  }
}
