"use client";

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, Plus, ChevronRight, CheckCircle2, 
  XCircle, LayoutDashboard, List, Activity, 
  DollarSign, FileText, AlertCircle
} from 'lucide-react';
import { paymentService } from '@/src/services/payment.service';
import { PaymentTransaction } from '@/src/types/payment.types';
import { EnhancedTable } from '@/components/feature/ui/EnhancedTable';
import { CreatePaymentWizard } from '@/components/feature/payments/CreatePaymentWizard';

type TabType = 'dashboard' | 'directory';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [stats, setStats] = useState({ totalAmount: 0, successCount: 0, pendingCount: 0, refundedCount: 0 });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayments();
      setPayments(data);
      const paymentStats = await paymentService.getPaymentStatistics();
      setStats(paymentStats);
    } catch (err) {
      console.error('Failed to load payments data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Success</span>;
      case 'Pending': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">Pending</span>;
      case 'Failed': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700">Failed</span>;
      case 'Refunded': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">Refunded</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-text-primary">{status}</span>;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collection', value: `₹${stats.totalAmount.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Successful', value: stats.successCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: stats.pendingCount, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Refunded', value: stats.refundedCount, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-text-primary">{kpi.value}</div>
                <div className="text-sm font-medium text-text-secondary mt-1">{kpi.label}</div>
              </div>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const columns = [
    {
      key: 'transactionId',
      label: 'Transaction',
      render: (p: PaymentTransaction) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{p.transactionId}</div>
            <div className="text-xs text-text-secondary">Inv: {p.invoiceNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'student',
      label: 'Student',
      render: (p: PaymentTransaction) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-text-primary">{p.studentName}</span>
          <span className="text-xs text-text-secondary">{p.studentId} • {p.program}</span>
        </div>
      ),
    },
    {
      key: 'netAmount',
      label: 'Amount',
      render: (p: PaymentTransaction) => (
        <div className="font-medium text-text-primary">
          ₹{p.netAmount.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (p: PaymentTransaction) => (
        <span className="text-sm text-text-secondary">{p.paymentMethod}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (p: PaymentTransaction) => getStatusBadge(p.status),
    },
    {
      key: 'createdDate',
      label: 'Date',
      render: (p: PaymentTransaction) => (
        <span className="text-sm text-text-secondary">
          {new Date(p.createdDate).toLocaleDateString()}
        </span>
      )
    },
  ];

  const renderDirectory = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <EnhancedTable
        data={payments}
        columns={columns}
        searchPlaceholder="Search by transaction ID, invoice, or student name..."
        itemsPerPage={10}
        emptyMessage="No payments found."
        searchFields={['transactionId', 'invoiceNumber', 'studentName', 'studentId']}
      />
    </div>
  );

  return (
    <>
      <div className="space-y-6 animate-slide-in p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <span>Finance</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-blue-600 font-extrabold">Payments</span>
            </div>
            <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Payment Collections</h2>
            <p className="text-xs text-helper mt-1">
              Manage student payments, refunds, and transaction history.
            </p>
          </div>
          
          <button 
            onClick={() => setIsCreateWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Record Payment</span>
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'directory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'}`}
          >
            <List className="h-4 w-4" />
            History
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'directory' && renderDirectory()}
          </>
        )}
      </div>

      <CreatePaymentWizard 
        isOpen={isCreateWizardOpen} 
        onClose={() => setIsCreateWizardOpen(false)} 
        onPaymentCreated={loadData} 
      />
    </>
  );
}