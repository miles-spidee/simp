'use client';
import { useState, useEffect } from 'react';
import CertificateTable from './CertificateTable';
import { CertificateService } from '@/src/services/certificate.service';
import { Award, CheckCircle, Clock, Plus, ShieldCheck } from 'lucide-react';

export default function CertificateDashboard() {
  const [issuedCount, setIssuedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const issued = await CertificateService.getIssuedCertificatesCount();
      const pending = await CertificateService.getPendingApprovals();
      setIssuedCount(issued);
      setPendingCount(pending.length);
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Certificate Management</h1>
          <p className="text-sm text-gray-500 mt-1">Generate, issue, and track verifiable certificates.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm">
            <Plus className="h-4 w-4" /> Issue Certificate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Issued Certificates</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{issuedCount}</p>
          </div>
          <Award className="h-10 w-10 text-emerald-200" />
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-600">Pending Approvals</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
          </div>
          <Clock className="h-10 w-10 text-amber-200" />
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Verification Integrity</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">100%</p>
          </div>
          <ShieldCheck className="h-10 w-10 text-blue-200" />
        </div>
      </div>

      <CertificateTable />
    </div>
  );
}
