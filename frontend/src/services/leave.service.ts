import { leaveApi } from '../api/leave.api';
import { LeaveRequest } from '../types/leave.types';

export const leaveService = {
  getLeaveDashboardStats: async () => {
    const leaves = await leaveApi.getAllLeaves();
    return {
      totalRequests: leaves.length,
      pendingRequests: leaves.filter(l => l.status === 'Pending').length,
      approvedRequests: leaves.filter(l => l.status === 'Approved').length,
      rejectedRequests: leaves.filter(l => l.status === 'Rejected').length,
    };
  },

  getPendingLeaves: async (): Promise<LeaveRequest[]> => {
    const leaves = await leaveApi.getAllLeaves();
    return leaves.filter(l => l.status === 'Pending');
  },

  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    return await leaveApi.getAllLeaves();
  },

  applyLeave: async (leaveData: Omit<LeaveRequest, 'id'>) => {
    return await leaveApi.createLeave(leaveData);
  }
};
