'use client';
import { useEffect, useState } from 'react';
import { feeService } from '../../../services/fee.service';
import { FeeStructure } from '../../../types/fee.types';
import { FileText, Plus } from 'lucide-react';

export default function FeeTable() {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feeService.getFees().then(data => {
      setFees(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-indigo-500">Loading Fees...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Fee Structures</h2>
            <p className="text-sm text-gray-500">Define and manage fee slabs for programs</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
          <Plus size={18} />
          <span>New Fee Slab</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {fees.slice(0, 9).map((fee) => (
          <div key={fee.id} className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg border ${
                fee.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                {fee.status}
              </span>
            </div>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{fee.feeName}</h3>
            <p className="text-sm text-gray-500 mb-4">{fee.program} • {fee.applicableBatch}</p>
            <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-50">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Amount</p>
                <p className="text-xl font-bold text-blue-600">₹{fee.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Installments</p>
                <p className="text-sm font-semibold text-gray-700">{fee.installments}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
