"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, IndianRupee, Activity, 
  CreditCard, Wallet, AlertCircle, Calendar, RefreshCcw, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { financeService } from '@/src/services/finance.service';
import { FinanceMetrics } from '@/src/types/finance.types';
import { Card } from '@/components/feature/ui/Card';

export default function FinanceDashboardPage() {
  const [metrics, setMetrics] = useState<FinanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await financeService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load finance metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finance Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time overview of revenue, collections, and outstanding dues.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
            <Calendar className="h-4 w-4" />
            <span>This Month</span>
          </div>
          <button 
            onClick={loadData}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IndianRupee className="h-24 w-24 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </div>
              Today's Collection
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{metrics.todaysCollection.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-emerald-600 font-medium">
              <ArrowUpRight className="h-4 w-4" />
              <span>12.5% vs yesterday</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="h-24 w-24 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              Monthly Revenue
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{metrics.monthlyRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-blue-600 font-medium">
              {metrics.revenueGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
              <span className={metrics.revenueGrowth >= 0 ? "text-emerald-600" : "text-red-500"}>
                {Math.abs(metrics.revenueGrowth)}% vs last month
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="h-24 w-24 text-amber-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-4">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              Pending Dues
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{metrics.pendingPayments.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-slate-500 font-medium">
              <span>Across 45 invoices</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="h-24 w-24 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-purple-600" />
              </div>
              Total Wallet Balance
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{metrics.walletBalance.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-slate-500 font-medium">
              <span>System-wide balance</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity Highlights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Total Transactions</div>
                  <div className="text-sm text-slate-500">Volume processed this month</div>
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900">{metrics.totalTransactions}</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Refund Requests</div>
                  <div className="text-sm text-slate-500">Pending review</div>
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900">{metrics.refundRequests}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
          
          <div className="relative z-10">
            <BarChart3 className="h-12 w-12 text-white/80 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
            <p className="text-blue-100 mb-6 max-w-sm mx-auto">
              Dive deeper into revenue trends, fee collection analysis, and year-over-year financial comparisons.
            </p>
            <a 
              href="/feature/finance-analytics" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              View Analytics Report
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}