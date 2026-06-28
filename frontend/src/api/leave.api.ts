import { apiClient } from './api.client';
import { LeaveRequest } from '../types/leave.types';

export const leaveApi = {
  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    const res = await apiClient.get<LeaveRequest[]>('/leaves');
    return res.data;
  },
  
  getLeaveById: async (id: string): Promise<LeaveRequest> => {
    const res = await apiClient.get<LeaveRequest>(`/leaves/${id}`);
    return res.data;
  },

  getLeavesByUser: async (userId: string): Promise<LeaveRequest[]> => {
    const res = await apiClient.get<LeaveRequest[]>(`/users/${userId}/leaves`);
    return res.data;
  },
  
  createLeave: async (leave: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> => {
    const res = await apiClient.post<LeaveRequest>('/leaves', leave);
    return res.data;
  }
};
