import { LeaveRequest } from '../types/leave.types';
import { MOCK_LEAVES } from '../data/mock-leaves';

export const leaveApi = {
  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    return Promise.resolve([...MOCK_LEAVES]);
  },
  
  getLeaveById: async (id: string): Promise<LeaveRequest | undefined> => {
    return Promise.resolve(MOCK_LEAVES.find(l => l.id === id));
  },

  getLeavesByUser: async (userId: string): Promise<LeaveRequest[]> => {
    return Promise.resolve(MOCK_LEAVES.filter(l => l.userId === userId));
  },
  
  createLeave: async (leave: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> => {
    const newLeave: LeaveRequest = {
      ...leave,
      id: `leave-${Date.now()}`,
    };
    MOCK_LEAVES.push(newLeave);
    return Promise.resolve(newLeave);
  }
};
