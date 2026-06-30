"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Activity, ChevronRight, IndianRupee, PieChart, CreditCard, ArrowUpRight 
} from 'lucide-react';
import { financeAnalyticsService } from '@/src/services/finance-analytics.service';
import { FinanceAnalytics } from '@/src/types/finance-analytics.types';
import { Card } from '@/components/feature/ui/Card';

export default function FinanceAnalyticsPage() {
  const [analytics, setAnalytics] = useState<FinanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await financeAnalyticsService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load finance analytics', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const { totalRealizedRevenue, paymentMethodDistribution, transactionSuccessRate } = analytics;
  const sortedMethods = paymentMethodDistribution.sort((a, b) => b.amount - a.amount);
  const totalTransactions = transactionSuccessRate.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Finance</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">Revenue Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Detailed breakdown of collection trends and payment methods.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="h-32 w-32 text-white" />
          </div>
          <div className="relative z-10">
            <div className="text-slate-300 font-medium text-sm mb-4">Total Realized Revenue</div>
            <div className="text-4xl font-black text-white">
              ₹{totalRealizedRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-emerald-400 font-medium bg-emerald-400/10 w-fit px-2 py-1 rounded-full">
              <ArrowUpRight className="h-4 w-4" />
              <span>Stable Collection</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <PieChart className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Payment Method Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {sortedMethods.map((item) => {
              const { method, amount } = item;
              const percentage = totalRealizedRevenue > 0 ? (amount / totalRealizedRevenue) * 100 : 0;
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{method}</span>
                    <span className="text-slate-500 font-medium">₹{amount.toLocaleString('en-IN')} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {sortedMethods.length === 0 && (
              <div className="text-center py-4 text-slate-500 text-sm">No successful payments to analyze.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Transaction Success Rate</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {transactionSuccessRate.map((item) => {
              const { status, count } = item;
              const percentage = totalTransactions > 0 ? (count / totalTransactions) * 100 : 0;
              let color = 'bg-slate-500';
              if (status === 'Success') color = 'bg-emerald-500';
              if (status === 'Failed') color = 'bg-red-500';
              if (status === 'Pending') color = 'bg-amber-500';

              return (
                <div key={status} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="font-medium text-slate-700">{status}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{count}</div>
                    <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center">
          <div className="text-center">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IndianRupee className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Collection Targets</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              You are currently on track for the monthly revenue goals. Keep monitoring pending dues to maintain cash flow.
            </p>
            <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden">
              <div className="bg-emerald-500 h-4 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>0</span>
              <span>75% to Goal</span>
              <span>Target</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

