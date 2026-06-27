'use client';
import { useState, useEffect } from 'react';
import { CertificateService } from '@/src/services/certificate.service';
import { batchService, ExtendedBatch } from '@/src/services/batch.service';
import { Certificate, CertificateType } from '@/src/types/certificate.types';
import { Award, Clock, Plus, ShieldCheck, Loader2, ChevronRight, Users, CheckCircle } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export default function CertificateDashboard() {
  const [batches, setBatches] = useState<ExtendedBatch[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<ExtendedBatch | null>(null);
  
  // Issue Certificate Form State
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [certType, setCertType] = useState<CertificateType>('Completion Certificate');
  const [status, setStatus] = useState<'Pending Approval' | 'Issued'>('Issued');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [certsData, batchesData] = await Promise.all([
        CertificateService.getCertificates(),
        batchService.getBatches()
      ]);
      setCertificates(certsData);
      setBatches(batchesData);
    } catch (e) {
      console.warn('Failed to load certificates data:', e);
    } finally {
      setLoading(false);
    }
  };

  const openIssueModal = (batch: ExtendedBatch, student: any) => {
    setStudentName(student.name);
    setStudentId(student.id);
    setProgram(batch.programName);
    setBatchCode(batch.name);
    setMentorName(batch.mentor.name || 'System Mentor');
    setCertType('Completion Certificate');
    setStatus('Issued');
    setIsIssueOpen(true);
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    setIsSubmitting(true);
    try {
      await CertificateService.createCertificate({
        studentName,
        studentId,
        program,
        batch: batchCode,
        mentorName,
        type: certType,
        status
      });

      setIsIssueOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const issuedCount = certificates.filter(c => c.status === 'Issued').length;
  const pendingCount = certificates.filter(c => c.status === 'Pending Approval').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-violet-600" />
            Certificate Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">Generate, approve, issue, and track verifiable certificates by batch.</p>
        </div>
        {selectedBatch && (
          <button 
            onClick={() => setSelectedBatch(null)}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200 font-bold text-sm cursor-pointer shadow-sm border border-slate-200"
          >
            ← Back to Batches
          </button>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issued Certificates</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{issuedCount}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{pendingCount}</p>
          </div>
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification Integrity</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">100%</p>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : !selectedBatch ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {batches.map(batch => (
            <div 
              key={batch.id} 
              onClick={() => setSelectedBatch(batch)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-colors duration-200 cursor-pointer flex justify-between items-center group"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-violet-600 transition-colors duration-200">{batch.name}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-mono">
                    {batch.code}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Users className="w-3.5 h-3.5 shrink-0" /> {batch.students?.length || 0} Students
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 bg-slate-50 group-hover:bg-violet-50 rounded-xl flex items-center justify-center transition-colors duration-200">
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors duration-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-extrabold text-slate-900">Students in {selectedBatch.name}</h2>
            <p className="text-xs font-medium text-slate-600 mt-1">Select a student to issue or view their certificate.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {selectedBatch.students?.length > 0 ? selectedBatch.students.map(student => {
              const studentCerts = certificates.filter(c => c.studentName === student.name);
              const hasIssued = studentCerts.some(c => c.status === 'Issued');
              
              return (
                <div key={student.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{student.internId}</span>
                      <span>{student.college}</span>
                    </div>
                  </div>
                  <div>
                    {hasIssued ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shadow-sm">
                        <CheckCircle className="w-4 h-4" /> Issued
                      </span>
                    ) : (
                      <button
                        onClick={() => openIssueModal(selectedBatch, student)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-xs cursor-pointer shadow-md shadow-slate-900/10"
                      >
                        <Plus className="w-3.5 h-3.5" /> Issue Certificate
                      </button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-500 text-sm font-medium">
                No students enrolled in this batch.
              </div>
            )}
          </div>
        </div>
      )}

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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-bold text-slate-800"
              readOnly
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
                <option value="Issued">Directly Issue (Active)</option>
                <option value="Pending Approval">Pending Approval (Awaiting Signoff)</option>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
                readOnly
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batch Code</label>
              <input
                type="text"
                required
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
                readOnly
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
