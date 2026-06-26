import { MarketplaceAPI } from '../api/marketplace.api';
import { MarketplaceOpportunity, MarketplaceApplication } from '../types/marketplace.types';

export class MarketplaceService {
  static async getOpportunities(): Promise<MarketplaceOpportunity[]> {
    const opps = await MarketplaceAPI.getOpportunities();
    return opps.filter(o => o.isActive).sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }

  static async getRecommendedOpportunities(): Promise<MarketplaceOpportunity[]> {
    const opps = await this.getOpportunities();
    return opps.slice(0, 6); // Mock recommendation
  }

  static async getMyApplications(studentId: string): Promise<MarketplaceApplication[]> {
    const apps = await MarketplaceAPI.getApplications();
    return apps.filter(a => a.studentId === studentId);
  }
}
