import { AttendanceSession, AttendanceRecord, AttendanceStatus, MOCK_ATTENDANCE_SESSIONS, MOCK_ATTENDANCE_RECORDS, MOCK_ATTENDANCE_STATUS } from '../data/mock-attendance';

class AttendanceService {
  async getSessions(): Promise<AttendanceSession[]> {
    return [...MOCK_ATTENDANCE_SESSIONS];
  }

  async getRecordsForSession(sessionId: string): Promise<AttendanceRecord[]> {
    return MOCK_ATTENDANCE_RECORDS.filter(r => r.sessionId === sessionId);
  }

  async getStudentStatus(studentId: string): Promise<AttendanceStatus> {
    return { ...MOCK_ATTENDANCE_STATUS, studentId };
  }

  async createSession(batchId: string, createdBy: string, date: string): Promise<AttendanceSession> {
    const newSession: AttendanceSession = {
      id: `sess-${Date.now()}`,
      batchId,
      date,
      createdBy,
      status: 'Open'
    };
    MOCK_ATTENDANCE_SESSIONS.push(newSession);
    return newSession;
  }

  async getAttendanceLogs(): Promise<import('../data/mock-attendance').AttendanceLog[]> {
    return (await import('../data/mock-attendance')).MOCK_ATTENDANCE_LOGS;
  }

  async getAttendanceStatus(): Promise<AttendanceStatus> {
    return MOCK_ATTENDANCE_STATUS;
  }
}

export const attendanceService = new AttendanceService();
