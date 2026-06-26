import { Referral, ReferralCampaign } from '../types/referral.types';
import { MOCK_REFERRALS, MOCK_REFERRAL_CAMPAIGNS } from '../data/mock-referrals';

const DELAY = 500;

export const ReferralAPI = {
  getReferrals: async (): Promise<Referral[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_REFERRALS]), DELAY);
    });
  },

  getCampaigns: async (): Promise<ReferralCampaign[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_REFERRAL_CAMPAIGNS]), DELAY);
    });
  }
};
