'use client';
import { useState } from 'react';
import { Certificate } from '@/src/types/certificate.types';
import { CertificateService } from '@/src/services/certificate.service';
import { Award, CheckCircle, Clock, XCircle, Search, Eye, Loader2, QrCode, FileText } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

interface CertificateTableProps {
  certificates: Certificate[];
  loading: boolean;
  onUpdate: () => void;
}

export default function CertificateTable({ certificates, loading, onUpdate }: CertificateTableProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Issued' | 'Pending Approval' | 'Revoked'>('All');

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      await CertificateService.updateCertificateStatus(id, 'Issued', 'System Administrator');
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    setActingId(id);
    try {
      await CertificateService.updateCertificateStatus(id, 'Revoked');
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  const filteredCertificates = certificates.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Draft': 'bg-slate-100 text-slate-700 border-slate-205',
      'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-150',
      'Approved': 'bg-blue-50 text-blue-700 border-blue-150',
      'Issued': 'bg-emerald-50 text-emerald-700 border-emerald-150',
      'Revoked': 'bg-rose-50 text-rose-700 border-rose-150'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${map[status] || map.Draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mt-6 font-sans">
      
      {/* Table filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-650 animate-pulse" /> Certificate Repository
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-4 w-4 text-slate-450 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search by ID or student..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-550 font-medium text-slate-700"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Issued">Issued (Active)</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Revoked">Revoked</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-slate-650 text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-5 py-4 font-bold">Certificate Info</th>
              <th className="px-5 py-4 font-bold">Student Details</th>
              <th className="px-5 py-4 font-bold">Status & Signature</th>
              <th className="px-5 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-semibold">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading certificates...
                </td>
              </tr>
            ) : filteredCertificates.slice(0, 20).map(cert => (
              <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{cert.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{cert.certificateNumber}</span>
                    <span className="text-[9px] text-slate-405 font-mono mt-0.5">Created: {new Date(cert.createdTime).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-850">{cert.studentName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cert.program}</span>
                    <span className="text-[9px] text-indigo-650 font-bold mt-0.5">{cert.batch}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col items-start gap-1">
                    {getStatusBadge(cert.status)}
                    {cert.approvedBy && (
                      <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" /> Appr: {cert.approvedBy}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 text-slate-400">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      title="Verify Details"
                      className="p-1.5 hover:text-slate-900 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {cert.status === 'Pending Approval' && (
                      <button
                        onClick={() => handleApprove(cert.id)}
                        disabled={actingId === cert.id}
                        title="Approve & Issue"
                        className="p-1.5 hover:text-emerald-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {actingId === cert.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    {cert.status === 'Issued' && (
                      <button
                        onClick={() => handleRevoke(cert.id)}
                        disabled={actingId === cert.id}
                        title="Revoke Certificate"
                        className="p-1.5 hover:text-rose-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {actingId === cert.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredCertificates.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400 font-medium">
                  No matching certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- DRAWERS --- */}

      {/* View Certificate Details Drawer */}
      <Drawer
        isOpen={selectedCert !== null}
        onClose={() => setSelectedCert(null)}
        title="Verifiable Credentials Verification"
      >
        {selectedCert && (
          <div className="p-6 space-y-6 overflow-y-auto font-sans flex flex-col items-stretch">
            
            {/* Verification status header */}
            <div className="flex flex-col items-center justify-center text-center p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
              <QrCode className="w-20 h-20 text-slate-800" />
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Verifiable Hash Number</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{selectedCert.certificateNumber}</span>
              </div>
              <div className="pt-1">{getStatusBadge(selectedCert.status)}</div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Academic Credentials
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Candidate</span>
                  <span className="text-slate-800 font-bold">{selectedCert.studentName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Training Program</span>
                  <span className="text-slate-800 font-bold">{selectedCert.program}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Batch Designation</span>
                  <span className="text-slate-800 font-bold">{selectedCert.batch}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificate Type</span>
                  <span className="text-slate-800 font-bold">{selectedCert.type}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Verification Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Signatory</span>
                  <span className="text-slate-850 font-bold">{selectedCert.approvedBy || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Digital Signature Hash</span>
                  <span className="text-slate-800 font-mono text-[10px] truncate block max-w-[150px]">{selectedCert.digitalSignatureId || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue Date</span>
                  <span className="text-slate-850 font-bold">{selectedCert.issueDate ? new Date(selectedCert.issueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issuer Authority</span>
                  <span className="text-slate-800 font-bold">{selectedCert.generatedBy}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Details
              </button>
              <a
                href={selectedCert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10 text-center"
              >
                Verify Online ✓
              </a>
            </div>

          </div>
        )}
      </Drawer>

    </div>
  );
}
