import { apiClient } from './api.client';
import { Coordinator, CollegeReport } from '../types/api/coordinator.types';

export const coordinatorApi = {
  getCoordinators: async (): Promise<Coordinator[]> => {
    const res = await apiClient.get<Coordinator[]>('/api/v1/coordinators');
    return res.data;
  },

  getCoordinator: async (id: string): Promise<Coordinator> => {
    const res = await apiClient.get<Coordinator>(`/api/v1/coordinators/${id}`);
    return res.data;
  },

  getReports: async (coordinatorId: string): Promise<CollegeReport[]> => {
    const res = await apiClient.get<CollegeReport[]>(`/api/v1/coordinators/${coordinatorId}/reports`);
    return res.data;
  }
};
