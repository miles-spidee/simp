"use client";

import React, { useEffect, useState } from 'react';
import { ReferralService } from '@/src/services/referral.service';
import { Referral, ReferralCampaign } from '@/src/types/referral.types';
import { Gift, Loader2, Users, Trophy, ChevronRight, Copy, Plus } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';

export default function ReferralsPage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [refs, camps, rewards] = await Promise.all([
        ReferralService.getMyReferrals(user.user_id),
        ReferralService.getActiveCampaigns(),
        ReferralService.getMyTotalRewards(user.user_id)
      ]);
      setReferrals(refs);
      setCampaigns(camps);
      setTotalRewards(rewards);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('referral.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view referrals.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-rose-500" />
            Referral Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Refer candidates and earn reward points.</p>
        </div>
        {hasPermission('referral.create') && (
          <button className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Refer a Friend
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                My Referrals
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {referrals.map(ref => (
                <div key={ref.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{ref.candidateName}</h3>
                    <p className="text-sm text-slate-500">{ref.program}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Code:</span>
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600 border border-slate-200">
                        {ref.referralCode}
                      </code>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      ref.status === 'Rewarded' ? 'bg-emerald-100 text-emerald-700' :
                      ref.status === 'Joined' || ref.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                      ref.status === 'Expired' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ref.status}
                    </span>
                    <div className="mt-2 font-bold text-slate-700 text-sm">
                      {ref.status === 'Rewarded' ? `+${ref.rewardPoints} pts` : `${ref.rewardPoints} pts pending`}
                    </div>
                  </div>
                </div>
              ))}
              {referrals.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  You haven't referred anyone yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Trophy className="w-24 h-24" />
            </div>
            <h2 className="text-rose-100 font-medium mb-1">Total Rewards Earned</h2>
            <div className="text-4xl font-bold mb-4">{totalRewards} <span className="text-lg font-medium text-rose-200">pts</span></div>
            <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium w-full flex items-center justify-between">
              Redeem Rewards
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 mb-4">Active Campaigns</h2>
            <div className="space-y-4">
              {campaigns.map(camp => (
                <div key={camp.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-sm">{camp.title}</h3>
                    <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">
                      {camp.rewardMultiplier}x Points
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{camp.description}</p>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Ends {new Date(camp.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
