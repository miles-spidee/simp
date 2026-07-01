import { apiClient } from '../api/api.client';
import { AttendanceSession, AttendanceRecord, AttendanceStatus } from '../types/api/attendance.types';
import { attendanceApi } from '../api/attendance.api';

class AttendanceService {
  async getSessions(): Promise<AttendanceSession[]> {
    try {
      const res = await apiClient.get('/api/v1/attendance');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getRecordsForSession(sessionId: string): Promise<AttendanceRecord[]> {
    try {
      const res = await apiClient.get('/api/v1/attendance');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getStudentStatus(studentId: string): Promise<AttendanceStatus> {
    try {
      const res = await apiClient.get('/api/v1/attendance');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }

  async createSession(batchId: string, createdBy: string, date: string): Promise<AttendanceSession> {
    try {
      const res = await apiClient.post('/api/v1/attendance');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }

  async markAttendance(sessionId: string, studentId: string, status: string): Promise<void> {
    try {
      const res = await apiClient.get('/api/v1/attendance');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }

  async getAttendanceLogs(): Promise<import('../data/mock-attendance').AttendanceLog[]> {
    try {
      const res = await apiClient.get('/api/v1/attendance');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getAttendanceStatus(): Promise<AttendanceStatus> {
    try {
      const res = await apiClient.get('/api/v1/attendance');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
}

export const attendanceService = new AttendanceService();
