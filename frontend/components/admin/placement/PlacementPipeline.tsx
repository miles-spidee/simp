'use client';
import { useState, useEffect } from 'react';
import { PlacementRecord } from '@/src/types/placement.types';
import { PlacementService } from '@/src/services/placement.service';
import { TrendingUp, Briefcase, Building, FileText, CheckCircle, Clock } from 'lucide-react';

export default function PlacementPipeline() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlacements() {
      setLoading(true);
      try {
        const data = await PlacementService.getPlacements();
        setPlacements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPlacements();
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Selected':
      case 'Joined':
      case 'Offer Released': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Technical Round':
      case 'HR Round': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-600" /> Active Hiring Pipeline
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Candidate</th>
              <th className="px-6 py-4 font-medium">Company & Role</th>
              <th className="px-6 py-4 font-medium">Package</th>
              <th className="px-6 py-4 font-medium">Stage</th>
              <th className="px-6 py-4 font-medium">Action Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading pipeline data...</td>
              </tr>
            ) : (
              placements.slice(0, 20).map(pl => (
                <tr key={pl.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{pl.studentName}</span>
                      <span className="text-xs text-gray-500">{pl.program}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{pl.companyName}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{pl.role} • {pl.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {pl.package}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStageColor(pl.stage)}`}>
                      {pl.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {pl.interviewDate ? (
                      <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <Clock className="h-3.5 w-3.5" /> Interview: {new Date(pl.interviewDate).toLocaleDateString()}
                      </div>
                    ) : pl.joiningDate ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Joined: {new Date(pl.joiningDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">Up to date</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
