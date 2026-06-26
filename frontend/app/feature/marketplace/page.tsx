"use client";

import React, { useEffect, useState } from 'react';
import { MarketplaceService } from '@/src/services/marketplace.service';
import { MarketplaceOpportunity } from '@/src/types/marketplace.types';
import { Store, Loader2, MapPin, Clock, Briefcase, Zap } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function MarketplacePage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<MarketplaceOpportunity[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await MarketplaceService.getOpportunities();
      setOpportunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('marketplace.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view the marketplace.</p>
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-fuchsia-600" />
            Internship Marketplace
          </h1>
          <p className="text-slate-500 text-sm mt-1">Discover and apply for internship opportunities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <div key={opp.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{opp.title}</h3>
                <p className="text-indigo-600 font-medium text-sm">{opp.companyName}</p>
              </div>
              {opp.compensation === 'Paid' && (
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                  Paid
                </span>
              )}
            </div>

            <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
              {opp.description}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                {opp.location} ({opp.locationType})
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                {opp.durationMonths} Months • {opp.type}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {opp.department}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {opp.skills.map(skill => (
                <span key={skill} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {opp.applicantsCount} applicants
              </span>
              {hasPermission('marketplace.apply') && (
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
