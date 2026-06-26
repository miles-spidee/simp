export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  module: 'Login' | 'Attendance' | 'Task' | 'Assessment' | 'Assignment' | 'Leave' | 'Profile' | 'Certificate' | 'Payment';
  action: string;
  description: string;
  timestamp: string;
  device: string;
  browser: string;
  ip: string;
  status: 'Success' | 'Failed' | 'Warning';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
}
