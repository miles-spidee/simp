'use client';
import { useEffect, useState } from 'react';
import { walletService } from '../../../services/wallet.service';
import { WalletSummary, WalletTransaction } from '../../../types/wallet.types';
import { Wallet, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';

export default function WalletCard() {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      walletService.getWalletSummary(),
      walletService.getTransactions()
    ]).then(([sum, txns]) => {
      setSummary(sum);
      setTransactions(txns);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) return <div className="p-8 text-center animate-pulse text-indigo-500">Loading Wallet...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl overflow-hidden text-white p-8 relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-indigo-100 font-medium mb-1 uppercase tracking-wider text-sm">Total Wallet Balance</p>
          <h2 className="text-5xl font-bold mb-8">₹{summary.balance.toLocaleString()}</h2>
          <div className="flex space-x-8">
            <div>
              <p className="text-indigo-200 text-sm mb-1 flex items-center"><ArrowUpRight size={16} className="mr-1"/> Total Credits</p>
              <p className="text-xl font-semibold">₹{summary.totalCredits.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-indigo-200 text-sm mb-1 flex items-center"><ArrowDownRight size={16} className="mr-1"/> Total Debits</p>
              <p className="text-xl font-semibold">₹{summary.totalDebits.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
          <History className="text-gray-400" size={20} />
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {transactions.slice(0, 5).map(txn => (
              <div key={txn.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${txn.type === 'Credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {txn.type === 'Credit' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{txn.source}</p>
                    <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()} • {txn.studentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-gray-800'}`}>
                    {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{txn.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
