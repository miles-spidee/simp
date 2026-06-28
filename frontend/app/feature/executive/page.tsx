"use client";

import React, { useEffect, useState } from 'react';
import { ExecutiveService } from '@/src/services/executive.service';
import { ExecutiveMetric, RiskIndicator } from '@/src/types/executive.types';
import { BarChart4, Loader2, ArrowUpRight, ArrowDownRight, ShieldAlert } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function ExecutiveDashboardPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ExecutiveMetric[]>([]);
  const [risks, setRisks] = useState<RiskIndicator[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ExecutiveService.getDashboardData();
      setMetrics(data.metrics);
      setRisks(data.risks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('executive.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-text-secondary">
        <p>You do not have permission to view the executive dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BarChart4 className="w-6 h-6 text-indigo-600" />
          Executive Dashboard
        </h1>
        <p className="text-text-secondary text-sm mt-1">Strategic overview and risk indicators for leadership.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-text-secondary font-medium text-sm mb-2">{metric.title}</h3>
            <div className="text-3xl font-bold mb-4">{metric.value}</div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              metric.changeType === 'increase' ? 'text-emerald-400' : 
              metric.changeType === 'decrease' ? 'text-rose-400' : 'text-text-secondary'
            }`}>
              {metric.changeType === 'increase' && <ArrowUpRight className="w-4 h-4" />}
              {metric.changeType === 'decrease' && <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(metric.change)}% {metric.timeframe}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2 bg-slate-50">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-text-primary">Active Risk Indicators</h2>
        </div>
        <div className="divide-y divide-border">
          {risks.map(risk => (
            <div key={risk.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    risk.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-700' :
                    risk.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                    risk.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {risk.riskLevel}
                  </span>
                  <span className="text-sm font-bold text-text-primary">{risk.department}</span>
                </div>
              </div>
              <p className="text-text-primary font-medium mb-1">{risk.description}</p>
              <p className="text-text-secondary text-sm">Mitigation: {risk.mitigation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
