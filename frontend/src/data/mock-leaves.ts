import { LeaveRequest } from '../types/leave.types';

export const MOCK_LEAVES: LeaveRequest[] = Array.from({ length: 50 }).map((_, i) => {
  const leaveTypes = ['Medical', 'Casual', 'Emergency', 'OD', 'WFH'];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  return {
    id: `leave-${i + 1}`,
    userId: `user-${100 + i}`,
    userName: `User ${100 + i}`,
    role: ['Student', 'Mentor', 'Employee'][i % 3] as 'Student' | 'Mentor' | 'Employee',
    leaveType: leaveTypes[i % leaveTypes.length] as 'Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH',
    startDate: new Date(Date.now() + Math.floor(Math.random() * 5000000000)).toISOString(),
    endDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString(),
    reason: 'Personal reasons and unavoidable circumstances.',
    status: statuses[i % statuses.length] as 'Pending' | 'Approved' | 'Rejected',
    appliedOn: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
    approvedBy: i % 3 !== 0 ? `admin-1` : undefined,
  };
});
