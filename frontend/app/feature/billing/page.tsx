"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, ChevronRight, FileText, LayoutDashboard, Receipt
} from 'lucide-react';
import { billingService } from '@/src/services/billing.service';
import { Invoice, Receipt as ReceiptType } from '@/src/types/billing.types';
import { EnhancedTable } from '@/components/feature/ui/EnhancedTable';
import { GenerateInvoiceWizard } from '@/components/feature/billing/GenerateInvoiceWizard';

type TabType = 'invoices' | 'receipts';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerateWizardOpen, setIsGenerateWizardOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'invoices') {
        const data = await billingService.getInvoices();
        setInvoices(data);
      } else {
        const data = await billingService.getReceipts();
        setReceipts(data);
      }
    } catch (err) {
      console.error('Failed to load billing data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Paid</span>;
      case 'Unpaid': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">Unpaid</span>;
      case 'Overdue': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700">Overdue</span>;
      case 'Cancelled': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">Cancelled</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-text-primary">{status}</span>;
    }
  };

  const invoiceColumns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice',
      render: (inv: Invoice) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{inv.invoiceNumber}</div>
            <div className="text-xs text-text-secondary">{new Date(inv.issueDate).toLocaleDateString()}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'student',
      label: 'Student',
      render: (inv: Invoice) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-text-primary">{inv.customerName}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (inv: Invoice) => (
        <div className="font-medium text-text-primary">
          ₹{inv.grandTotal.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (inv: Invoice) => (
        <span className="text-sm text-text-secondary">{new Date(inv.dueDate).toLocaleDateString()}</span>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (inv: Invoice) => getInvoiceStatusBadge(inv.paymentStatus),
    },
  ];

  const receiptColumns = [
    {
      key: 'receiptNumber',
      label: 'Receipt',
      render: (r: ReceiptType) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Receipt className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{r.receiptNumber}</div>
            <div className="text-xs text-text-secondary">Inv: {r.invoiceNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'student',
      label: 'Student',
      render: (r: ReceiptType) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-text-primary">{r.customerName}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (r: ReceiptType) => (
        <div className="font-medium text-emerald-600">
          ₹{r.amountPaid.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (r: ReceiptType) => (
        <span className="text-sm text-text-secondary">{r.paymentMethod}</span>
      )
    },
    {
      key: 'paymentDate',
      label: 'Date',
      render: (r: ReceiptType) => (
        <span className="text-sm text-text-secondary">{new Date(r.paymentDate).toLocaleDateString()}</span>
      )
    },
  ];

  return (
    <>
      <div className="space-y-6 animate-slide-in p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <span>Finance</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-blue-600 font-extrabold">Billing</span>
            </div>
            <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Billing & Invoices</h2>
            <p className="text-xs text-helper mt-1">
              Manage student invoices and track receipts.
            </p>
          </div>
          
          <button 
            onClick={() => setIsGenerateWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Invoice</span>
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'}`}
          >
            <FileText className="h-4 w-4" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'receipts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'}`}
          >
            <Receipt className="h-4 w-4" />
            Receipts
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'invoices' ? (
              <EnhancedTable
                data={invoices}
                columns={invoiceColumns}
                searchPlaceholder="Search invoices..."
                itemsPerPage={10}
                emptyMessage="No invoices found."
                searchFields={['invoiceNumber', 'customerName']}
              />
            ) : (
              <EnhancedTable
                data={receipts}
                columns={receiptColumns}
                searchPlaceholder="Search receipts..."
                itemsPerPage={10}
                emptyMessage="No receipts found."
                searchFields={['receiptNumber', 'invoiceNumber', 'customerName']}
              />
            )}
          </div>
        )}
      </div>

      <GenerateInvoiceWizard 
        isOpen={isGenerateWizardOpen} 
        onClose={() => setIsGenerateWizardOpen(false)} 
        onInvoiceCreated={loadData} 
      />
    </>
  );
}