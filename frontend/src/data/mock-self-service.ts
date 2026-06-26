import { SelfServiceDashboard } from '../types/selfservice.types';

export const MOCK_SELF_SERVICE: SelfServiceDashboard = {
  profile: {
    id: 'USR-101',
    name: 'Current User',
    email: 'user@pinesphere.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Lane, Silicon Valley, CA',
    role: 'Student',
    joinDate: new Date(Date.now() - 31536000000).toISOString()
  },
  recentRequests: [
    {
      id: 'REQ-101',
      type: 'Bonafide Certificate',
      status: 'Ready',
      requestDate: new Date(Date.now() - 604800000).toISOString(),
      completionDate: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'REQ-102',
      type: 'Address Change Update',
      status: 'Pending',
      requestDate: new Date().toISOString()
    }
  ],
  pendingActions: 3
};
