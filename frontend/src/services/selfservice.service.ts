import { SelfServiceAPI } from '../api/selfservice.api';
import { SelfServiceDashboard } from '../types/selfservice.types';

export class SelfServiceService {
  static async getDashboard(): Promise<SelfServiceDashboard> {
    const dashboard = await SelfServiceAPI.getDashboard();
    // In a real application, this would fetch for the specific authenticated user
    return dashboard;
  }
}
