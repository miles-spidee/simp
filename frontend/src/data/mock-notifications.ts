import { Notification, NotificationChannel, NotificationType, NotificationPriority, NotificationStatus } from '../types/notification.types';

export const MOCK_NOTIFICATIONS: Notification[] = Array.from({ length: 500 }).map((_, i) => {
  const channels: NotificationChannel[] = ['Email', 'SMS', 'WhatsApp', 'Push Notification', 'In-App Notification'];
  const types: NotificationType[] = ['Registration', 'Application', 'Interview', 'Attendance', 'Assessment', 'Assignment', 'Payment', 'Certificate', 'Placement', 'Leave', 'Escalation', 'Reminder', 'Announcement'];
  const priorities: NotificationPriority[] = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: NotificationStatus[] = ['Draft', 'Scheduled', 'Sent', 'Failed', 'Delivered', 'Read'];
  
  const createdTime = new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString();
  const isSent = Math.random() > 0.2;
  const isRead = isSent && Math.random() > 0.5;

  return {
    id: `notif-${i + 1}`,
    title: `Notification regarding ${types[i % types.length]}`,
    message: `This is an auto-generated notification for your recent ${types[i % types.length]} update.`,
    recipient: `user${i % 100}@example.com`,
    role: ['Student', 'Mentor', 'HR', 'Coordinator'][i % 4],
    module: types[i % types.length],
    channel: channels[i % channels.length],
    priority: priorities[i % priorities.length],
    status: isRead ? 'Read' : (isSent ? 'Delivered' : statuses[i % statuses.length]),
    scheduledTime: !isSent ? new Date(Date.now() + Math.floor(Math.random() * 864000000)).toISOString() : undefined,
    deliveredTime: isSent ? new Date(new Date(createdTime).getTime() + Math.floor(Math.random() * 3600000)).toISOString() : undefined,
    readStatus: isRead,
    retryCount: isSent ? 0 : Math.floor(Math.random() * 3),
    createdTime,
  };
});
