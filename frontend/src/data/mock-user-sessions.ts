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

export const MOCK_USER_SESSIONS: UserSession[] = [
  {
    id: "sess-1",
    userId: "usr-1", // Alice Freeman
    device: "MacBook Pro",
    os: "macOS 14.1",
    browser: "Chrome 120",
    ipAddress: "192.168.1.45",
    location: "San Francisco, CA",
    lastActivity: "2024-02-15T10:23:00Z",
    status: 'Active'
  },
  {
    id: "sess-2",
    userId: "usr-5", // Super Admin
    device: "ThinkPad T14",
    os: "Windows 11",
    browser: "Edge 120",
    ipAddress: "10.0.0.5",
    location: "New York, NY",
    lastActivity: "2024-02-15T14:45:00Z",
    status: 'Active'
  },
  {
    id: "sess-3",
    userId: "usr-2", // Bob Smith
    device: "iPhone 13",
    os: "iOS 17.2",
    browser: "Safari",
    ipAddress: "172.16.0.12",
    location: "Austin, TX",
    lastActivity: "2024-02-14T09:12:00Z",
    status: 'Expired'
  }
];
