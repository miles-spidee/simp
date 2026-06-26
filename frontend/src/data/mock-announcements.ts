import { Announcement, AnnouncementCategory, AnnouncementStatus, AnnouncementPriority } from '../types/announcement.types';

export const MOCK_ANNOUNCEMENTS: Announcement[] = Array.from({ length: 100 }).map((_, i) => {
  const categories: AnnouncementCategory[] = ['General', 'Academic', 'Internship', 'Holiday', 'Emergency', 'Placement', 'Finance', 'System Update'];
  const priorities: AnnouncementPriority[] = ['Normal', 'High', 'Urgent'];
  const statuses: AnnouncementStatus[] = ['Draft', 'Published', 'Archived'];
  
  return {
    id: `ann-${i + 1}`,
    title: `Important Update: ${categories[i % categories.length]}`,
    description: `Please be advised about the recent changes and updates regarding our ${categories[i % categories.length]} policies. All concerned individuals should review the attached documents for more detailed information and ensure compliance by the end of the week.`,
    audience: i % 5 === 0 ? ['All'] : [['Student'], ['Mentor'], ['HR'], ['Student', 'Mentor']][i % 4],
    category: categories[i % categories.length],
    priority: priorities[i % priorities.length],
    attachments: i % 3 === 0 ? ['policy_update.pdf'] : [],
    publishDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
    expiryDate: i % 2 === 0 ? new Date(Date.now() + Math.floor(Math.random() * 5000000000)).toISOString() : undefined,
    status: statuses[i % statuses.length],
    pinned: i < 5,
    author: 'Admin Team',
  };
});
