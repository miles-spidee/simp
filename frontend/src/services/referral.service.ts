import { ReferralAPI } from '../api/referral.api';
import { Referral, ReferralCampaign } from '../types/referral.types';

export class ReferralService {
  static async getReferrals(): Promise<Referral[]> {
    const refs = await ReferralAPI.getReferrals();
    return refs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getMyReferrals(userId: string): Promise<Referral[]> {
    const refs = await ReferralAPI.getReferrals();
    return refs.filter(r => r.referrerId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getMyTotalRewards(userId: string): Promise<number> {
    const refs = await this.getMyReferrals(userId);
    return refs.filter(r => r.status === 'Rewarded').reduce((sum, r) => sum + r.rewardPoints, 0);
  }

  static async getActiveCampaigns(): Promise<ReferralCampaign[]> {
    const campaigns = await ReferralAPI.getCampaigns();
    return campaigns.filter(c => new Date(c.endDate) > new Date());
  }
}
