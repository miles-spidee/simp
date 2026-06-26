'use client';
import { useEffect, useState } from 'react';
import { financeService } from '../../../services/finance.service';
import { FinanceMetrics } from '../../../types/finance.types';
import { PieChart, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';

export default function FinanceDashboard() {
  const [metrics, setMetrics] = useState<FinanceMetrics | null>(null);

  useEffect(() => {
    financeService.getDashboardMetrics().then(setMetrics);
  }, []);

  if (!metrics) return <div className="p-8 text-center animate-pulse text-indigo-500">Loading Dashboard...</div>;

  const cards = [
    { title: "Monthly Revenue", value: `₹${metrics.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Today's Collection", value: `₹${metrics.todaysCollection.toLocaleString()}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pending Payments", value: `₹${metrics.pendingPayments.toLocaleString()}`, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Total Transactions", value: metrics.totalTransactions.toString(), icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
          <PieChart size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>
          <p className="text-gray-500">High level overview of revenue and collections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.color} group-hover:scale-110 transition-transform`}>
                <c.icon size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">{c.title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{c.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl min-h-[300px] flex items-center justify-center text-gray-400 border-dashed">
          Revenue Chart Placeholder (Chart.js / Recharts)
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl min-h-[300px] flex items-center justify-center text-gray-400 border-dashed">
          Collection by Program Placeholder
        </div>
      </div>
    </div>
  );
}
