import { CalendarEvent, EventType, EventStatus } from '../types/calendar.types';

export const MOCK_EVENTS: CalendarEvent[] = Array.from({ length: 300 }).map((_, i) => {
  const types: EventType[] = ['Interview', 'Meeting', 'Assessment', 'Assignment', 'Training', 'Holiday', 'Leave', 'Reminder', 'Payment Due', 'Certificate'];
  const statuses: EventStatus[] = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'];
  
  // Distribute events around current date
  const now = new Date();
  const offsetDays = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
  const start = new Date(now.getTime() + offsetDays * 86400000);
  start.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // 9 AM to 5 PM
  
  const end = new Date(start.getTime() + (Math.floor(Math.random() * 3) + 1) * 3600000); // 1-3 hours duration

  return {
    id: `evt-${i + 1}`,
    title: `${types[i % types.length]} Session ${i + 1}`,
    description: `Detailed discussion and agenda for the upcoming ${types[i % types.length]}. Please be prepared.`,
    type: types[i % types.length],
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    participants: ['Current User', `Colleague ${i % 10}`],
    location: i % 4 === 0 ? 'Conference Room A' : undefined,
    meetingLink: i % 4 !== 0 ? `https://meet.google.com/abc-defg-hij` : undefined,
    reminderMinutes: 15,
    repeatRule: 'None',
    status: statuses[i % statuses.length],
  };
});
