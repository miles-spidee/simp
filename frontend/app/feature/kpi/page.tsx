"use client";

import React, { useEffect, useState } from 'react';
import { KPIService } from '@/src/services/kpi.service';
import { KPIMetric } from '@/src/types/kpi.types';
import { Target, Loader2, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function KPIManagementPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIMetric[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await KPIService.getKPIs();
      setKpis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('kpi.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view KPIs.</p>
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
            <Target className="w-6 h-6 text-amber-600" />
            KPI Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage key performance indicators across departments.</p>
        </div>
        {hasPermission('kpi.manage') && (
          <button className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer">
            Create KPI
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map(kpi => {
          const progress = (kpi.currentValue / kpi.targetValue) * 100;
          return (
            <div key={kpi.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.category}</span>
                  <h3 className="font-bold text-slate-800 mt-1">{kpi.name}</h3>
                </div>
                {kpi.status === 'on_track' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {kpi.status === 'at_risk' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                {kpi.status === 'behind' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold text-slate-900">
                  {kpi.currentValue}{kpi.unit}
                </span>
                <span className="text-sm font-medium text-slate-500 pb-1">
                  / {kpi.targetValue}{kpi.unit} target
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full ${kpi.status === 'on_track' ? 'bg-emerald-500' : kpi.status === 'at_risk' ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className={`flex items-center gap-1 font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                  {kpi.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                  {kpi.trend === 'flat' && <Minus className="w-4 h-4" />}
                  {Math.abs(kpi.trendPercentage)}%
                </div>
                <span className="text-slate-400 text-xs">
                  Updated {new Date(kpi.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
