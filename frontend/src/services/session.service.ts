import { apiClient } from '../api/api.client';
import { UserSession } from '../types/user-sessions.types';

class SessionService {
  async getSessions(): Promise<UserSession[]> {
    try {
      const res = await apiClient.get('/api/v1/session');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async terminateSession(id: string): Promise<void> {
    try {
      const res = await apiClient.get('/api/v1/session');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
}

export const sessionService = new SessionService();
