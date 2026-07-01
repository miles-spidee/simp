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