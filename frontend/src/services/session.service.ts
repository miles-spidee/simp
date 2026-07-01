import { UserSession, MOCK_USER_SESSIONS } from '../data/mock-user-sessions';

class SessionService {
  async getSessions(): Promise<UserSession[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_USER_SESSIONS]);
      }, 300);
    });
  }

  async terminateSession(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const session = MOCK_USER_SESSIONS.find(s => s.id === id);
        if (session) {
          session.status = 'Terminated';
        }
        resolve();
      }, 300);
    });
  }
}

export const sessionService = new SessionService();
