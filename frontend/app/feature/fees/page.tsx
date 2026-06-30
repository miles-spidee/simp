"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, ChevronRight, GraduationCap, LayoutDashboard, List
} from 'lucide-react';
import { feeService } from '@/src/services/fee.service';
import { FeeStructure } from '@/src/types/fee.types';
import { EnhancedTable } from '@/components/feature/ui/EnhancedTable';
import { CreateFeeWizard } from '@/components/feature/fees/CreateFeeWizard';

export default function FeesPage() {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await feeService.getFees();
      setFees(data);
    } catch (err) {
      console.error('Failed to load fees data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>;
      case 'Inactive': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">Inactive</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-text-primary">{status}</span>;
    }
  };

  const columns = [
    {
      key: 'program',
      label: 'Program & Batch',
      render: (f: FeeStructure) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{f.feeName}</div>
            <div className="text-xs text-text-secondary">{f.program} • {f.department} • {f.applicableBatch}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'feeType',
      label: 'Type',
      render: (f: FeeStructure) => (
        <div className="font-medium text-text-secondary">
          {f.feeType}
        </div>
      )
    },
    {
      key: 'totalFee',
      label: 'Amount',
      render: (f: FeeStructure) => {
        return (
          <div className="font-bold text-emerald-600">
            ₹{f.amount.toLocaleString('en-IN')}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (f: FeeStructure) => getStatusBadge(f.status),
    },
    {
      key: 'actions',
      label: '',
      render: (f: FeeStructure) => (
        <button 
          onClick={async () => {
            if (confirm('Are you sure you want to delete this fee structure?')) {
              await feeService.deleteFee(f.id);
              loadData();
            }
          }}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Delete
        </button>
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
              <span className="text-blue-600 font-extrabold">Fee Structures</span>
            </div>
            <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Fee Management</h2>
            <p className="text-xs text-helper mt-1">
              Configure and manage fee structures across programs and batches.
            </p>
          </div>
          
          <button 
            onClick={() => setIsCreateWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Fee Structure</span>
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EnhancedTable
              data={fees}
              columns={columns}
              searchPlaceholder="Search by program, department or batch..."
              itemsPerPage={10}
              emptyMessage="No fee structures found."
              searchFields={['program', 'applicableBatch', 'department', 'feeName']}
            />
          </div>
        )}
      </div>

      <CreateFeeWizard 
        isOpen={isCreateWizardOpen} 
        onClose={() => setIsCreateWizardOpen(false)} 
        onFeeCreated={loadData} 
      />
    </>
  );
}