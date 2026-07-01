import { AttendanceStatusType, AttendanceSession, AttendanceRecord, AttendanceStatus } from '../types/api/attendance.types';

export interface AttendanceLog {
  id: string;
  studentId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  status: string;
}

export const MOCK_ATTENDANCE_SESSIONS: AttendanceSession[] = [];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [];

export const MOCK_ATTENDANCE_STATUS: AttendanceStatus = {
  studentId: 'stu-1',
  presentDays: 15,
  absentDays: 2,
  lateDays: 1,
  leaveDays: 0,
  averageAttendance: 88,
  isCheckedIn: false,
  clockInTime: null
};

export const MOCK_ATTENDANCE_LOGS: AttendanceLog[] = [];
