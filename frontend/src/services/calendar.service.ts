import { calendarApi } from '../api/calendar.api';
import { CalendarEvent } from '../types/calendar.types';

export class CalendarService {
  static async getEvents(): Promise<CalendarEvent[]> {
    return calendarApi.getEvents();
  }

  static async getTodaysEvents(): Promise<CalendarEvent[]> {
    const events = await calendarApi.getEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return events.filter(e => {
      const eventTime = new Date(e.startTime).getTime();
      return eventTime >= today.getTime() && eventTime < tomorrow.getTime();
    });
  }

  static async getUpcomingInterviews(): Promise<CalendarEvent[]> {
    const events = await calendarApi.getEvents();
    const now = new Date().getTime();
    return events.filter(e => e.type === 'Interview' && new Date(e.startTime).getTime() > now);
  }

  static async createEvent(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return calendarApi.createEvent(data);
  }
}
