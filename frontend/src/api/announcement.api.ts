import { Announcement } from '../types/announcement.types';
import { MOCK_ANNOUNCEMENTS } from '../data/mock-announcements';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const announcementApi = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    await delay(600);
    return [...MOCK_ANNOUNCEMENTS].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
  },
  createAnnouncement: async (data: Partial<Announcement>): Promise<Announcement> => {
    await delay(500);
    const newAnnouncement: Announcement = {
      id: `ann-${MOCK_ANNOUNCEMENTS.length + 1}`,
      title: data.title || '',
      description: data.description || '',
      audience: data.audience || ['All'],
      category: data.category || 'General',
      priority: data.priority || 'Normal',
      attachments: data.attachments || [],
      publishDate: data.publishDate || new Date().toISOString(),
      status: data.status || 'Draft',
      pinned: data.pinned || false,
      author: data.author || 'Current User'
    };
    MOCK_ANNOUNCEMENTS.push(newAnnouncement);
    return newAnnouncement;
  }
};
