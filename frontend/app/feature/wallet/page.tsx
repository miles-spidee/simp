"use client";

import React, { useEffect, useState } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, Activity, ChevronRight
} from 'lucide-react';
import { walletService } from '@/src/services/wallet.service';
import { WalletTransaction, WalletSummary } from '@/src/types/wallet.types';
import { EnhancedTable } from '@/components/feature/ui/EnhancedTable';

export default function WalletPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [txns, sum] = await Promise.all([
        walletService.getTransactions(),
        walletService.getWalletSummary() // Summary across all or specific student
      ]);
      setTransactions(txns);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load wallet data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Completed</span>;
      case 'Pending': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">Pending</span>;
      case 'Failed': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700">Failed</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-text-primary">{status}</span>;
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      render: (t: WalletTransaction) => (
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            t.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {t.type === 'Credit' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-semibold text-text-primary">{t.id}</div>
            <div className="text-xs text-text-secondary">{t.source} • {t.reference}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'student',
      label: 'Student',
      render: (t: WalletTransaction) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-text-primary">{t.studentName}</span>
          <span className="text-xs text-text-secondary">{t.studentId}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (t: WalletTransaction) => (
        <div className={`font-medium ${t.type === 'Credit' ? 'text-emerald-600' : 'text-text-primary'}`}>
          {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (t: WalletTransaction) => (
        <span className="text-sm text-text-secondary">{new Date(t.date).toLocaleDateString()}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (t: WalletTransaction) => getStatusBadge(t.status),
    },
  ];

  return (
    <div className="space-y-6 animate-slide-in p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Finance</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Wallet</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Student Wallets</h2>
          <p className="text-xs text-helper mt-1">
            Monitor wallet balances and transaction history.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-text-primary">₹{summary.balance.toLocaleString('en-IN')}</div>
                    <div className="text-sm font-medium text-text-secondary mt-1">Total System Balance</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">₹{summary.totalCredits.toLocaleString('en-IN')}</div>
                    <div className="text-sm font-medium text-text-secondary mt-1">Total Credits</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-red-600">₹{summary.totalDebits.toLocaleString('en-IN')}</div>
                    <div className="text-sm font-medium text-text-secondary mt-1">Total Debits</div>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <EnhancedTable
            data={transactions}
            columns={columns}
            searchPlaceholder="Search by transaction ID, student..."
            itemsPerPage={10}
            emptyMessage="No wallet transactions found."
            searchFields={['id', 'studentName', 'studentId', 'source', 'reference']}
          />
        </div>
      )}
    </div>
  );
}