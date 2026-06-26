import { Referral, ReferralCampaign } from '../types/referral.types';

export const MOCK_REFERRALS: Referral[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `REF-${8000 + i}`,
  referralCode: `PINES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  referrerId: `STU-${100 + (i % 5)}`,
  referrerName: `Student ${i % 5}`,
  candidateName: `Candidate ${i}`,
  candidateEmail: `candidate${i}@example.com`,
  program: ['Full Stack Development', 'Data Science', 'UI/UX Design'][i % 3],
  rewardPoints: [500, 1000, 1500][i % 3],
  status: ['Pending', 'Joined', 'Completed', 'Rewarded', 'Expired'][i % 5] as any,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  joinedDate: i % 5 > 0 ? new Date().toISOString() : undefined,
  rewardDate: i % 5 === 3 ? new Date().toISOString() : undefined,
}));

export const MOCK_REFERRAL_CAMPAIGNS: ReferralCampaign[] = [
  {
    id: 'CMP-1',
    title: 'Summer Tech Drive',
    description: 'Earn 2x reward points for every successful engineering referral.',
    rewardMultiplier: 2.0,
    endDate: new Date(Date.now() + 2592000000).toISOString()
  }
];
