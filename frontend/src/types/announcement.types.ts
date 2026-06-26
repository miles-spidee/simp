export type AnnouncementCategory = 'General' | 'Academic' | 'Internship' | 'Holiday' | 'Emergency' | 'Placement' | 'Finance' | 'System Update';
export type AnnouncementStatus = 'Draft' | 'Published' | 'Archived';
export type AnnouncementPriority = 'Normal' | 'High' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  audience: string[]; // e.g., ['All', 'Student', 'HR']
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  attachments: string[];
  publishDate: string;
  expiryDate?: string;
  status: AnnouncementStatus;
  pinned: boolean;
  author: string;
}
