import { apiClient } from '../api/api.client';

import { Coordinator, CollegeReport } from '../types/api/coordinator.types';
import {} from '../types/coordinators.types';
import { coordinatorApi } from '../api/coordinator.api';

class CoordinatorService {
  async getCoordinators(): Promise<Coordinator[]> {
    try {
      const res = await apiClient.get('/api/v1/coordinator');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getCoordinator(id: string): Promise<Coordinator | undefined> {
    try {
      const res = await apiClient.get('/api/v1/coordinator');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }

  async getReports(coordinatorId: string): Promise<CollegeReport[]> {
    try {
      const res = await apiClient.get('/api/v1/coordinator');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
}

export const coordinatorService = new CoordinatorService();
