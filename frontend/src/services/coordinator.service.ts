import { Coordinator, CollegeReport, MOCK_COORDINATORS, MOCK_COLLEGE_REPORTS } from '../data/mock-coordinators';

class CoordinatorService {
  async getCoordinators(): Promise<Coordinator[]> {
    return [...MOCK_COORDINATORS];
  }

  async getCoordinator(id: string): Promise<Coordinator | undefined> {
    return MOCK_COORDINATORS.find(c => c.id === id);
  }

  async getReports(coordinatorId: string): Promise<CollegeReport[]> {
    return MOCK_COLLEGE_REPORTS.filter(r => r.coordinatorId === coordinatorId);
  }
}

export const coordinatorService = new CoordinatorService();
