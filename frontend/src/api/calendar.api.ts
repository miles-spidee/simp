import { apiClient } from './api.client';
import { CalendarEvent } from '../types/calendar.types';
import {} from '../types/events.types';


export const calendarApi = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const res = await apiClient.get('/api/v1/calendar');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  createEvent: async (data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const res = await apiClient.post('/api/v1/calendar');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
