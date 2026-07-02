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

  async createCoordinator(data: Partial<Coordinator>): Promise<Coordinator> {
    try {
      const payload = {
        assignedStudentsCount: 0,
        activeBatchesCount: 0,
        placementsCount: 0,
        status: "Active",
        ...data
      };
      const res = await apiClient.post('/api/v1/coordinator', payload);
      return res.data?.data || res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCoordinator(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/coordinator/${id}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async getReports(coordinatorId: string): Promise<CollegeReport[]> {
    try {
      const res = await apiClient.get(`/api/v1/coordinator/${coordinatorId}/reports`);
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async uploadReport(coordinatorId: string, data: any): Promise<any> {
    try {
      const res = await apiClient.post(`/api/v1/coordinator/${coordinatorId}/reports`, data);
      return res.data?.data || res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const coordinatorService = new CoordinatorService();
