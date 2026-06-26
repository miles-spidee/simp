export type NotificationChannel = 'Email' | 'SMS' | 'WhatsApp' | 'Push Notification' | 'In-App Notification';
export type NotificationType = 'Registration' | 'Application' | 'Interview' | 'Attendance' | 'Assessment' | 'Assignment' | 'Payment' | 'Certificate' | 'Placement' | 'Leave' | 'Escalation' | 'Reminder' | 'Announcement';
export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type NotificationStatus = 'Draft' | 'Scheduled' | 'Sent' | 'Failed' | 'Delivered' | 'Read';

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipient: string;
  role: string;
  module: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  status: NotificationStatus;
  scheduledTime?: string;
  deliveredTime?: string;
  readStatus: boolean;
  retryCount: number;
  createdTime: string;
}
