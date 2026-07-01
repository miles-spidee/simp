export interface UserSession {
  id: string;
  userId: string;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActivity: string;
  status: 'Active' | 'Expired' | 'Terminated';
}