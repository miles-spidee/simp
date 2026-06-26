'use client';
import { useState, useEffect } from 'react';
import PlacementPipeline from './PlacementPipeline';
import { PlacementService } from '@/src/services/placement.service';
import { TrendingUp, Users, Building2, Briefcase } from 'lucide-react';

export default function PlacementDashboard() {
  const [hiredCount, setHiredCount] = useState(0);
  const [topCompanies, setTopCompanies] = useState<[string, number][]>([]);

  useEffect(() => {
    async function loadStats() {
      const hired = await PlacementService.getStudentsHiredCount();
      const top = await PlacementService.getTopCompanies();
      setHiredCount(hired);
      setTopCompanies(top);
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Placement & Hiring</h1>
          <p className="text-sm text-gray-500 mt-1">Track student interviews, offers, and hiring pipelines.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm">
            <Building2 className="h-4 w-4" /> Add Company
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Students Hired</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{hiredCount}</p>
          </div>
          <Users className="h-10 w-10 text-emerald-200" />
        </div>

        <div className="md:col-span-3 bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Top Hiring Companies
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topCompanies.length === 0 ? (
              <p className="text-sm text-gray-400">Loading top companies...</p>
            ) : (
              topCompanies.map(([name, count]) => (
                <div key={name} className="flex flex-col bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg shrink-0 min-w-[150px]">
                  <span className="text-xs font-bold text-gray-900 truncate" title={name}>{name}</span>
                  <span className="text-xs text-gray-500">{count} Hires</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <PlacementPipeline />
    </div>
  );
}
