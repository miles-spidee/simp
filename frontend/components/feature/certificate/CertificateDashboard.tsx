'use client';
import { useState, useEffect } from 'react';
import CertificateTable from './CertificateTable';
import { CertificateService } from '@/src/services/certificate.service';
import { Certificate, CertificateType } from '@/src/types/certificate.types';
import { Award, Clock, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export default function CertificateDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuedCount, setIssuedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Issue Certificate Form State
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('Full Stack Web Development');
  const [batch, setBatch] = useState('FSD-2026-A');
  const [mentorName, setMentorName] = useState('Chief Mentor');
  const [certType, setCertType] = useState<CertificateType>('Completion Certificate');
  const [status, setStatus] = useState<'Pending Approval' | 'Issued'>('Pending Approval');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await CertificateService.getCertificates();
      setCertificates(data);
      setIssuedCount(data.filter(c => c.status === 'Issued').length);
      setPendingCount(data.filter(c => c.status === 'Pending Approval').length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    setIsSubmitting(true);
    try {
      await CertificateService.createCertificate({
        studentName,
        program,
        batch,
        mentorName,
        type: certType,
        status
      });

      setStudentName('');
      setProgram('Full Stack Web Development');
      setBatch('FSD-2026-A');
      setMentorName('Chief Mentor');
      setCertType('Completion Certificate');
      setStatus('Pending Approval');
      setIsIssueOpen(false);

      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-650" />
            Certificate Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Generate, approve, issue, and track verifiable certificates.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsIssueOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-slate-900/10 cursor-pointer animate-fade-in"
          >
            <Plus className="h-4 w-4" /> Issue Certificate
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issued Certificates</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">{issuedCount}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">{pendingCount}</p>
          </div>
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Integrity</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">100%</p>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Certificate Table */}
      <CertificateTable 
        certificates={certificates} 
        loading={loading} 
        onUpdate={loadData} 
      />

      {/* --- DRAWERS --- */}

      {/* Issue Certificate Drawer */}
      <Drawer
        isOpen={isIssueOpen}
        onClose={() => setIsIssueOpen(false)}
        title="Issue Verifiable Certificate"
      >
        <form onSubmit={handleIssueCertificate} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g., Harin Nair"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificate Type</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="Completion Certificate">Completion Certificate</option>
                <option value="Internship Letter">Internship Letter</option>
                <option value="Experience Certificate">Experience Certificate</option>
                <option value="Participation Certificate">Participation Certificate</option>
                <option value="Award of Excellence">Award of Excellence</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="Pending Approval">Pending Approval (Awaiting Signoff)</option>
                <option value="Issued">Directly Issue (Active)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Training Program</label>
              <input
                type="text"
                required
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g., Full Stack Web Development"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batch Code</label>
              <input
                type="text"
                required
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="e.g., FSD-2026-A"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mentor / Signatory</label>
            <input
              type="text"
              required
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              placeholder="e.g., Chief Mentor"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button
              type="button"
              onClick={() => setIsIssueOpen(false)}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Issuing...
                </>
              ) : (
                'Issue Certificate'
              )}
            </button>
          </div>
        </form>
      </Drawer>

    </div>
  );
}
