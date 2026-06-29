import { AttendanceSession, AttendanceRecord, AttendanceStatus } from '../types/api/attendance.types';
import { MOCK_ATTENDANCE_SESSIONS, MOCK_ATTENDANCE_RECORDS, MOCK_ATTENDANCE_STATUS } from '../data/mock-attendance';
import { attendanceApi } from '../api/attendance.api';

class AttendanceService {
  async getSessions(): Promise<AttendanceSession[]> {
    try {
      const data = await attendanceApi.getSessions();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch attendance sessions, using mock:', e);
    }
    return [...MOCK_ATTENDANCE_SESSIONS];
  }

  async getRecordsForSession(sessionId: string): Promise<AttendanceRecord[]> {
    try {
      const data = await attendanceApi.getRecordsForSession(sessionId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch records for session ${sessionId}, using mock:`, e);
    }
    return MOCK_ATTENDANCE_RECORDS.filter(r => r.sessionId === sessionId);
  }

  async getStudentStatus(studentId: string): Promise<AttendanceStatus> {
    try {
      const data = await attendanceApi.getStudentStatus(studentId);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch student status ${studentId}, using mock:`, e);
    }
    return { ...MOCK_ATTENDANCE_STATUS, studentId };
  }

  async createSession(batchId: string, createdBy: string, date: string): Promise<AttendanceSession> {
    try {
      const result = await attendanceApi.createSession({ batchId, createdBy, date });
      if (result) return result;
    } catch (e) {
      console.debug('Failed to create session via API, creating mock:', e);
    }
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

  async markAttendance(sessionId: string, studentId: string, status: string): Promise<void> {
    try {
      await attendanceApi.markAttendance(sessionId, studentId, status);
      return;
    } catch (e) {
      console.debug('Failed to mark attendance via API, marking mock:', e);
    }
    const record = MOCK_ATTENDANCE_RECORDS.find(r => r.sessionId === sessionId && r.studentId === studentId);
    if (record) {
      record.status = status as any;
    }
  }

  async getAttendanceLogs(): Promise<import('../data/mock-attendance').AttendanceLog[]> {
    return (await import('../data/mock-attendance')).MOCK_ATTENDANCE_LOGS;
  }

  async getAttendanceStatus(): Promise<AttendanceStatus> {
    return MOCK_ATTENDANCE_STATUS;
  }
}

export const attendanceService = new AttendanceService();
