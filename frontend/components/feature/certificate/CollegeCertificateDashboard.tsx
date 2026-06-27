'use client';
import { useState, useEffect, useMemo } from 'react';
import { CertificateService } from '@/src/services/certificate.service';
import { VerificationService } from '@/src/services/verification.service';
import { Certificate } from '@/src/types/certificate.types';
import { VerificationResult } from '@/src/types/verification.types';
import {
  ShieldCheck, Search, Award, Users, CheckCircle, XCircle, AlertTriangle,
  Loader2, Eye, ChevronDown, ChevronUp, Building,
  Calendar, User, FileText, Hash, Lock, Fingerprint, BadgeCheck, Copy, Check
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';

/* ── Simulated college→student mapping ── */
const COLLEGE_STUDENT_MAP: Record<string, string[]> = {
  'Stanford University': ['Student 1', 'Student 3', 'Student 5', 'Student 7', 'Student 9', 'Student 11', 'Student 13', 'Student 15', 'Student 17', 'Student 19'],
  'MIT': ['Student 2', 'Student 4', 'Student 6', 'Student 8', 'Student 10', 'Student 12', 'Student 14', 'Student 16', 'Student 18', 'Student 20'],
  'IIT Madras': ['Student 21', 'Student 22', 'Student 23', 'Student 24', 'Student 25', 'Student 26', 'Student 27', 'Student 28', 'Student 29', 'Student 30'],
  'UC Berkeley': ['Student 31', 'Student 32', 'Student 33', 'Student 34', 'Student 35'],
  'Harvard University': ['Student 36', 'Student 37', 'Student 38', 'Student 39', 'Student 40'],
};

/* ── Deterministic verification hash ── */
function generateVerificationHash(cert: Certificate): string {
  const raw = `${cert.certificateNumber}-${cert.studentId}-${cert.digitalSignatureId || 'NOSIG'}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `VH-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}

export default function CollegeCertificateDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Verification drawer
  const [verifyDrawerOpen, setVerifyDrawerOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Certificate detail drawer
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  useEffect(() => { loadCertificates(); }, []);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const data = await CertificateService.getCertificates();
      setCertificates(data);
    } catch {
      console.warn('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const colleges = Object.keys(COLLEGE_STUDENT_MAP);

  // Get certificates for selected college
  const collegeCertificates = useMemo(() => {
    if (!selectedCollege) return [];
    const studentNames = COLLEGE_STUDENT_MAP[selectedCollege] || [];
    return certificates.filter(c => studentNames.includes(c.studentName) && c.status === 'Issued');
  }, [selectedCollege, certificates]);

  // Filter by search
  const filteredCertificates = useMemo(() => {
    if (!searchQuery.trim()) return collegeCertificates;
    const q = searchQuery.toLowerCase();
    return collegeCertificates.filter(c =>
      c.studentName.toLowerCase().includes(q) ||
      c.certificateNumber.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.program.toLowerCase().includes(q)
    );
  }, [collegeCertificates, searchQuery]);

  // Group by student
  const studentGroups = useMemo(() => {
    const groups: Record<string, Certificate[]> = {};
    filteredCertificates.forEach(cert => {
      if (!groups[cert.studentName]) groups[cert.studentName] = [];
      groups[cert.studentName].push(cert);
    });
    return groups;
  }, [filteredCertificates]);

  const totalIssued = collegeCertificates.length;
  const uniqueStudents = new Set(collegeCertificates.map(c => c.studentName)).size;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await VerificationService.verifyCertificate(verifyCode.trim());
      setVerificationResult(result);
    } catch {
      console.warn('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div className="space-y-6 font-sans">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building className="h-6 w-6 text-violet-600" />
            College Certificate Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            View student certificates by college. Verify authenticity using unique verification codes.
          </p>
        </div>
        <button
          onClick={() => { setVerifyDrawerOpen(true); setVerificationResult(null); setVerifyCode(''); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors duration-200 font-bold text-sm cursor-pointer shadow-sm"
        >
          <Fingerprint className="w-4 h-4" />
          Verify Certificate
        </button>
      </div>

      {/* ── College Selector ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
          Select College / Institution
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {colleges.map(college => (
            <button
              key={college}
              onClick={() => { setSelectedCollege(college); setSearchQuery(''); setExpandedStudent(null); }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors duration-200 cursor-pointer border text-left flex items-center gap-2 ${
                selectedCollege === college
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span className="truncate">{college}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Dashboard Content ── */}
      {selectedCollege ? (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Issued Certificates', value: totalIssued, icon: Award, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              { label: 'Unique Students', value: uniqueStudents, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
              { label: 'Verification Status', value: 'Secure', icon: ShieldCheck, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                  <p className={`text-3xl font-extrabold mt-1 font-mono ${kpi.label === 'Verification Status' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {kpi.value}
                  </p>
                </div>
                <div className={`h-12 w-12 ${kpi.iconBg} ${kpi.iconColor} rounded-xl flex items-center justify-center`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student name, certificate number, type, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all duration-200 font-medium text-slate-800 shadow-sm placeholder:text-slate-400"
            />
          </div>

          {/* Student List with Certificates */}
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : Object.keys(studentGroups).length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 text-lg">No Issued Certificates Found</h3>
              <p className="text-sm text-slate-600 mt-2">
                No certificates have been issued for students from {selectedCollege} yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(studentGroups).map(([studentName, certs]) => {
                const isExpanded = expandedStudent === studentName;
                return (
                  <div key={studentName} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Student Row */}
                    <button
                      onClick={() => setExpandedStudent(isExpanded ? null : studentName)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900 text-sm">{studentName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {certs.length} certificate{certs.length > 1 ? 's' : ''} issued
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-slate-400" />
                          : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Expanded Certificate Rows */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 divide-y divide-slate-100">
                        {certs.map(cert => {
                          const vHash = generateVerificationHash(cert);
                          return (
                            <div key={cert.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors duration-200">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                  <Award className="w-4 h-4 text-violet-500" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 text-sm">{cert.type}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                      {cert.certificateNumber}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{cert.program}</span>
                                    <span className="text-[10px] text-slate-500">
                                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Verification Hash Chip */}
                                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                                  <Hash className="w-3 h-3 text-amber-600" />
                                  <span className="text-[10px] font-mono font-bold text-amber-800">{vHash}</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCopyCode(cert.certificateNumber); }}
                                    className="ml-0.5 p-0.5 hover:bg-amber-100 rounded transition-colors duration-150 cursor-pointer"
                                    title="Copy certificate number"
                                  >
                                    {copiedCode === cert.certificateNumber
                                      ? <Check className="w-3 h-3 text-emerald-600" />
                                      : <Copy className="w-3 h-3 text-amber-500" />}
                                  </button>
                                </div>
                                {/* View Detail */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedCert(cert); setDetailDrawerOpen(true); }}
                                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 cursor-pointer shadow-sm"
                                  title="View certificate details"
                                >
                                  <Eye className="w-4 h-4 text-slate-600" />
                                </button>
                                {/* Verify */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVerifyCode(cert.certificateNumber);
                                    setVerificationResult(null);
                                    setVerifyDrawerOpen(true);
                                  }}
                                  className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 cursor-pointer shadow-sm"
                                  title="Verify this certificate"
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-lg">Select a College to Begin</h3>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Choose a college or institution above to view student certificates and verify their authenticity.
          </p>
        </div>
      )}

      {/* ══════════ Verification Drawer ══════════ */}
      <Drawer
        isOpen={verifyDrawerOpen}
        onClose={() => setVerifyDrawerOpen(false)}
        title="Certificate Verification Portal"
      >
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
          {/* Intro banner */}
          <div className="bg-slate-900 rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-slate-800 rounded-full opacity-50 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 bg-violet-900 rounded-full opacity-40 blur-3xl" />
            <Fingerprint className="h-12 w-12 text-emerald-400 mx-auto mb-3 relative z-10" />
            <h3 className="text-lg font-bold text-white relative z-10">Verify Authenticity</h3>
            <p className="text-xs text-slate-400 mt-1 relative z-10 max-w-xs mx-auto">
              Enter the certificate number printed on the document to verify it on the Pinesphere network.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificate Number</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="e.g. PS-CERT-2026-00001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all duration-200 text-slate-800"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                : <><ShieldCheck className="w-4 h-4" /> Verify Certificate</>}
            </button>
          </form>

          {/* Result */}
          {verificationResult && (
            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-300">
              {verificationResult.status === 'Valid' ? (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <CheckCircle className="h-7 w-7 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-base font-bold text-emerald-900">Certificate is Authentic</h4>
                      <p className="text-xs text-emerald-700">Verified by Pinesphere Digital Trust</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <User className="h-4 w-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Student</p>
                        <p className="font-bold text-slate-900 text-sm">{verificationResult.studentName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Type</p>
                          <p className="font-medium text-slate-800 text-xs">{verificationResult.certificateType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Issued</p>
                          <p className="font-medium text-slate-800 text-xs">{verificationResult.issueDate ? new Date(verificationResult.issueDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Building className="h-4 w-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Program</p>
                        <p className="font-medium text-slate-800 text-xs">{verificationResult.program}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : verificationResult.status === 'Revoked' ? (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-center">
                  <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-rose-900">Certificate Revoked</h4>
                  <p className="text-sm text-rose-700 mt-1">{verificationResult.message}</p>
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center">
                  <XCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-900">Invalid Certificate</h4>
                  <p className="text-sm text-slate-600 mt-1">{verificationResult.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {/* ══════════ Certificate Detail Drawer ══════════ */}
      <Drawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        title="Certificate Details"
      >
        {selectedCert && (
          <div className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
            {/* Preview Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-violet-800/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 bg-emerald-800/20 rounded-full blur-3xl" />
              <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 relative z-10" />
              <h3 className="text-xl font-bold text-white relative z-10">{selectedCert.type}</h3>
              <p className="text-sm text-slate-400 mt-1 relative z-10 font-mono">{selectedCert.certificateNumber}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold relative z-10">
                <BadgeCheck className="w-3.5 h-3.5" /> Digitally Verified
              </div>
            </div>

            {/* Detail Fields */}
            <div className="space-y-3">
              {[
                { icon: User, label: 'Student Name', value: selectedCert.studentName },
                { icon: FileText, label: 'Program', value: selectedCert.program },
                { icon: Building, label: 'Batch', value: selectedCert.batch },
                { icon: User, label: 'Mentor / Signatory', value: selectedCert.mentorName },
                { icon: Calendar, label: 'Issue Date', value: selectedCert.issueDate ? new Date(selectedCert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                { icon: Hash, label: 'Verification Hash', value: generateVerificationHash(selectedCert) },
                { icon: Fingerprint, label: 'Digital Signature ID', value: selectedCert.digitalSignatureId || 'N/A' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5 break-all">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
              <button
                onClick={() => {
                  setVerifyCode(selectedCert.certificateNumber);
                  setVerificationResult(null);
                  setDetailDrawerOpen(false);
                  setVerifyDrawerOpen(true);
                }}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" /> Verify This Certificate
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
