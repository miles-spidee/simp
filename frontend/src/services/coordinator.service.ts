
import { Coordinator, CollegeReport } from '../types/api/coordinator.types';
import { MOCK_COORDINATORS, MOCK_COLLEGE_REPORTS } from '../data/mock-coordinators';
import { coordinatorApi } from '../api/coordinator.api';

class CoordinatorService {
  async getCoordinators(): Promise<Coordinator[]> {
    try {
      const data = await coordinatorApi.getCoordinators();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch coordinators via API, returning mock:', e);
    }
    return [...MOCK_COORDINATORS];
  }

  async getCoordinator(id: string): Promise<Coordinator | undefined> {
    try {
      const data = await coordinatorApi.getCoordinator(id);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch coordinator ${id} via API, returning mock:`, e);
    }
    return MOCK_COORDINATORS.find(c => c.id === id);
  }

  async getReports(coordinatorId: string): Promise<CollegeReport[]> {
    try {
      const data = await coordinatorApi.getReports(coordinatorId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch reports for coordinator ${coordinatorId} via API, returning mock:`, e);
    }
    return MOCK_COLLEGE_REPORTS.filter(r => r.coordinatorId === coordinatorId);
  }
}

export const coordinatorService = new CoordinatorService();
