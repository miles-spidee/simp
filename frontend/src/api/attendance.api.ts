import { apiClient } from './api.client';
import { AttendanceSession, AttendanceRecord, AttendanceStatus } from '../types/api/attendance.types';

export const attendanceApi = {
  getSessions: async (): Promise<AttendanceSession[]> => {
    const res = await apiClient.get<AttendanceSession[]>('/api/v1/attendance/sessions');
    return res.data;
  },

  getRecordsForSession: async (sessionId: string): Promise<AttendanceRecord[]> => {
    const res = await apiClient.get<AttendanceRecord[]>(`/api/v1/attendance/sessions/${sessionId}/records`);
    return res.data;
  },

  getStudentStatus: async (studentId: string): Promise<AttendanceStatus> => {
    const res = await apiClient.get<AttendanceStatus>(`/api/v1/attendance/students/${studentId}/status`);
    return res.data;
  },

  createSession: async (data: { batchId: string; createdBy: string; date: string }): Promise<AttendanceSession> => {
    const res = await apiClient.post<AttendanceSession>('/api/v1/attendance/sessions', data);
    return res.data;
  },

  markAttendance: async (sessionId: string, studentId: string, status: string): Promise<void> => {
    await apiClient.post(`/api/v1/attendance/sessions/${sessionId}/mark`, { studentId, status });
  }
};
