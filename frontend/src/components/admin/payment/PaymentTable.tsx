'use client';
import { useEffect, useState } from 'react';
import { paymentService } from '../../../services/payment.service';
import { PaymentTransaction } from '../../../types/payment.types';
import { CreditCard, Download, Search, Filter } from 'lucide-react';

export default function PaymentTable() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.getPayments().then(data => {
      setPayments(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-indigo-500">Loading Payments...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Payment Transactions</h2>
            <p className="text-sm text-gray-500">Manage and verify student payments</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search TXN ID..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-shadow"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.slice(0, 10).map((txn) => (
              <tr key={txn.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-indigo-600">{txn.transactionId}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{txn.studentName}</p>
                  <p className="text-xs text-gray-400">{txn.studentId}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">₹{txn.netAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                    {txn.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    txn.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(txn.createdDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
