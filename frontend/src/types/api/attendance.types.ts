export type AttendanceStatusType = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceSession {
  id: string;
  batchId: string;
  date: string;
  createdBy: string;
  status: 'Open' | 'Closed';
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatusType;
  clockIn?: string;
  clockOut?: string;
}

export interface AttendanceStatus {
  studentId: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  averageAttendance: number;
  isCheckedIn: boolean;
  clockInTime: string | null;
}
