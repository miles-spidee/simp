export type EventType = 'Interview' | 'Meeting' | 'Assessment' | 'Assignment' | 'Training' | 'Holiday' | 'Leave' | 'Reminder' | 'Payment Due' | 'Certificate';
export type EventStatus = 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startTime: string;
  endTime: string;
  participants: string[];
  location?: string;
  meetingLink?: string;
  reminderMinutes?: number;
  repeatRule?: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  status: EventStatus;
}
