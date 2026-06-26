'use client';
import { useEffect, useState } from 'react';
import { billingService } from '../../../services/billing.service';
import { Invoice } from '../../../types/billing.types';
import { FileSignature, Download, Eye } from 'lucide-react';

export default function InvoiceViewer() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billingService.getInvoices().then(data => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-indigo-500">Loading Invoices...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
            <FileSignature size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Invoices & Receipts</h2>
            <p className="text-sm text-gray-500">Manage billing and generated invoices</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Invoice No</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Issue Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.slice(0, 10).map((inv) => (
              <tr key={inv.id} className="hover:bg-purple-50/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-purple-600">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{inv.customerName}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-semibold text-gray-700">₹{inv.grandTotal.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    inv.paymentStatus === 'Unpaid' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
