export interface DocumentRequest {
  id: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Ready';
  requestDate: string;
  completionDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  joinDate: string;
}

export interface SelfServiceDashboard {
  profile: UserProfile;
  recentRequests: DocumentRequest[];
  pendingActions: number;
}
