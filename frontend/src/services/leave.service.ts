import { leaveApi } from '../api/leave.api';
import { LeaveRequest } from '../types/leave.types';
import { MOCK_LEAVES } from '../data/mock-leaves';

export const leaveService = {
  getLeaveDashboardStats: async () => {
    const leaves = await leaveService.getAllLeaves();
    return {
      totalRequests: leaves.length,
      pendingRequests: leaves.filter(l => l.status === 'Pending').length,
      approvedRequests: leaves.filter(l => l.status === 'Approved').length,
      rejectedRequests: leaves.filter(l => l.status === 'Rejected').length,
    };
  },

  getPendingLeaves: async (): Promise<LeaveRequest[]> => {
    const leaves = await leaveService.getAllLeaves();
    return leaves.filter(l => l.status === 'Pending');
  },

  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    try {
      const data = await leaveApi.getAllLeaves();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return MOCK_LEAVES;
  },

  applyLeave: async (leaveData: Omit<LeaveRequest, 'id'>) => {
    try {
      const data = await leaveApi.createLeave(leaveData);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `leave-${Date.now()}`,
    };
    MOCK_LEAVES.push(newLeave);
    return newLeave;
  }
};
