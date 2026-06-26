export type ReferralStatus = 'Pending' | 'Joined' | 'Completed' | 'Rewarded' | 'Expired';

export interface Referral {
  id: string;
  referralCode: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  program: string;
  rewardPoints: number;
  status: ReferralStatus;
  createdAt: string;
  joinedDate?: string;
  rewardDate?: string;
}

export interface ReferralCampaign {
  id: string;
  title: string;
  description: string;
  rewardMultiplier: number;
  endDate: string;
}
