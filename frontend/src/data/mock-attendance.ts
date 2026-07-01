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

export const MOCK_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  { id: 'sess-1', batchId: 'batch-1', date: '2026-06-14', createdBy: 'emp-1', status: 'Closed' },
  { id: 'sess-2', batchId: 'batch-2', date: '2026-06-14', createdBy: 'emp-2', status: 'Open' },
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: 'rec-1', sessionId: 'sess-1', studentId: 'stu-1', status: 'PRESENT', clockIn: '08:55 AM', clockOut: '05:05 PM' },
  { id: 'rec-2', sessionId: 'sess-1', studentId: 'stu-2', status: 'LATE', clockIn: '09:30 AM', clockOut: '05:05 PM' },
  { id: 'rec-3', sessionId: 'sess-1', studentId: 'stu-3', status: 'ABSENT' },
];

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

export const MOCK_ATTENDANCE_LOGS: AttendanceLog[] = [
  {
    id: 'att-1',
    studentId: 'stu-1',
    date: '2026-06-14',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    duration: '8h 10m',
    status: 'Present'
  }
];
