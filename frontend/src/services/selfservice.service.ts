import { SelfServiceAPI } from '../api/selfservice.api';
import { SelfServiceDashboard, UserProfile } from '../types/selfservice.types';

export class SelfServiceService {
  static async getDashboard(): Promise<SelfServiceDashboard> {
    const dashboard = await SelfServiceAPI.getDashboard();
    // In a real application, this would fetch for the specific authenticated user
    return dashboard;
  }

  static async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return await SelfServiceAPI.updateProfile(profile);
  }
}
