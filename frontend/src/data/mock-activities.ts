import { ActivityLog } from '../types/activity.types';

export const MOCK_ACTIVITIES: ActivityLog[] = Array.from({ length: 100 }).map((_, i) => {
  const modules = ['Login', 'Attendance', 'Task', 'Assessment', 'Assignment', 'Leave', 'Profile', 'Certificate', 'Payment'];
  const actions = ['Created', 'Updated', 'Deleted', 'Viewed', 'Approved', 'Rejected'];
  const statuses = ['Success', 'Failed', 'Warning'];
  const severities = ['Info', 'Low', 'Medium', 'High', 'Critical'];
  return {
    id: `act-${i + 1}`,
    userId: `user-${(i % 50) + 1}`,
    userName: `User ${(i % 50) + 1}`,
    role: ['Student', 'Mentor', 'Employee', 'Reporting Manager'][i % 4],
    module: modules[i % modules.length] as any,
    action: actions[i % actions.length],
    description: `Performed ${actions[i % actions.length]} operation on ${modules[i % modules.length]}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
    device: ['Desktop', 'Mobile', 'Tablet'][i % 3],
    browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][i % 4],
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    status: statuses[i % statuses.length] as any,
    severity: severities[i % severities.length] as any,
  };
});
