"use client";

import React, { useState } from 'react';
import { useHRDashboard } from './HRDashboardContext';
import {
  Users,
  Briefcase,
  Layers,
  GraduationCap,
  Calendar,
  ClipboardList,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Download,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  ChevronRight,
  Plus,
  PlusCircle,
  RefreshCw,
  Building,
  UserCheck,
  X,
  Send,
  Loader2
} from 'lucide-react';

export default function HRDashboardOverview() {
  const {
    isHRDataLoading,
    metrics,
    funnelData,
    students,
    programs,
    colleges,
    escalations,
    attendanceStats,
    attendanceAlert,
    assessmentsStats,
    assessments,
    paymentsStats,
    payments,
    certificatesStats,
    certificates,
    placementsStats,
    placements,
    notificationStats,
    notificationsLog,
    activities,
    addStudent,
    createProgram,
    recordPayment,
    generateCertificate,
    sendNotification,
    resolveEscalation
  } = useHRDashboard();

  // Navigation jump list
  const rows = [
    { id: 'kpi', label: 'Executive KPIs' },
    { id: 'lifecycle', label: 'Lifecycle Funnel' },
    { id: 'students', label: 'Student Management' },
    { id: 'programs', label: 'Internship Programs' },
    { id: 'colleges', label: 'College Management' },
    { id: 'attendance', label: 'Attendance Management' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'performance', label: 'Performance Analytics' },
    { id: 'payments', label: 'Payment Logs' },
    { id: 'certificates', label: 'Certificate Vault' },
    { id: 'placements', label: 'Placements' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'escalations', label: 'Escalations' },
    { id: 'reports', label: 'Reports' }
  ];

  const [activeJump, setActiveJump] = useState('kpi');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal toggle states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isGenerateCertificateOpen, setIsGenerateCertificateOpen] = useState(false);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', college: '', dept: '', prog: 'AI/ML Research Internship', batch: 'Batch #482', manager: 'Arjun V.', status: 'Active' });
  const [newProgram, setNewProgram] = useState({ name: '', dept: '', type: 'Research Internship', duration: '12 Weeks', filled: 0, total: 100, mentors: '' });
  const [newPayment, setNewPayment] = useState({ name: 'Julianne Smith', prog: 'Java Fullstack Program', fee: 1200, paid: 0, dueDate: '' });
  const [newCert, setNewCert] = useState({ name: 'Julianne Smith', type: 'Completion Certificate' });
  const [newNotif, setNewNotif] = useState({ title: '', target: 'Batch #482', channels: [] as string[] });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form handlers
  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.college || !newStudent.dept) {
      triggerToast("Please fill in all student details.");
      return;
    }
    const success = await addStudent(newStudent);
    if (success) {
      triggerToast(`Student ${newStudent.name} registered successfully!`);
      setIsAddStudentOpen(false);
      setNewStudent({ name: '', college: '', dept: '', prog: 'AI/ML Research Internship', batch: 'Batch #482', manager: 'Arjun V.', status: 'Active' });
    }
  };

  const handleCreateProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name || !newProgram.dept || !newProgram.duration || !newProgram.mentors) {
      triggerToast("Please fill in all program fields.");
      return;
    }
    const success = await createProgram({ ...newProgram, total: Number(newProgram.total) });
    if (success) {
      triggerToast(`Program "${newProgram.name}" created successfully!`);
      setIsCreateProgramOpen(false);
      setNewProgram({ name: '', dept: '', type: 'Research Internship', duration: '12 Weeks', filled: 0, total: 100, mentors: '' });
    }
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.name || !newPayment.prog || !newPayment.fee || newPayment.paid === undefined) {
      triggerToast("Please fill in all payment details.");
      return;
    }
    const success = await recordPayment(newPayment);
    if (success) {
      triggerToast(`Payment recorded for ${newPayment.name}!`);
      setIsRecordPaymentOpen(false);
      setNewPayment({ name: 'Julianne Smith', prog: 'Java Fullstack Program', fee: 1200, paid: 0, dueDate: '' });
    }
  };

  const handleGenerateCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name || !newCert.type) {
      triggerToast("Please fill in all certificate fields.");
      return;
    }
    const success = await generateCertificate(newCert);
    if (success) {
      triggerToast(`Certificate generated successfully for ${newCert.name}!`);
      setIsGenerateCertificateOpen(false);
      setNewCert({ name: 'Julianne Smith', type: 'Completion Certificate' });
    }
  };

  const handleSendNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.target) {
      triggerToast("Please fill in notification fields.");
      return;
    }
    if (newNotif.channels.length === 0) {
      triggerToast("Please check at least one delivery channel.");
      return;
    }
    const success = await sendNotification(newNotif);
    if (success) {
      triggerToast(`Broadcast notification dispatched to ${newNotif.target}!`);
      setIsSendNotificationOpen(false);
      setNewNotif({ title: '', target: 'Batch #482', channels: [] });
    }
  };

  const handleResolveEscalation = async (name: string) => {
    const success = await resolveEscalation(name);
    if (success) {
      triggerToast(`Escalation resolved for ${name}.`);
    }
  };

  const handleChannelCheckbox = (channel: string) => {
    setNewNotif(prev => {
      const exists = prev.channels.includes(channel);
      const updated = exists 
        ? prev.channels.filter(c => c !== channel) 
        : [...prev.channels, channel];
      return { ...prev, channels: updated };
    });
  };

  if (isHRDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-semibold">Syncing HR Workspace logs with servers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in max-w-7xl mx-auto">
      
      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 shadow-xl rounded-xl border border-slate-800 animate-slide-in flex items-center gap-2">
          <CheckCircle className="h-4.5 w-4.5 text-blue-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/4 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Enterprise HR Workspace</h1>
          <p className="text-xs text-slate-400 font-medium">Compliance Gated Administration System for Student Lifecycles</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-250/60 rounded-xl text-[10px] font-bold text-slate-500 tracking-wide uppercase">
            Active Cycle: <span className="text-blue-600">Summer 2024 Cycle</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTION BUTTONS HUB */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
        <h3 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">HR System Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Add Student', action: () => setIsAddStudentOpen(true) },
            { label: 'Create Program', action: () => setIsCreateProgramOpen(true) },
            { label: 'Create Batch', action: () => triggerToast('Batch Allocation tool initiated.') },
            { label: 'Record Payment', action: () => setIsRecordPaymentOpen(true) },
            { label: 'Generate Certificate', action: () => setIsGenerateCertificateOpen(true) },
            { label: 'Send Notification', action: () => setIsSendNotificationOpen(true) }
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={act.action}
              className="px-3 py-2 bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
            >
              + {act.label}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK JUMP AND METRICS DIVISION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* JUMP PANEL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sticky top-20 space-y-2">
            <h3 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5 mb-2">Module Navigation</h3>
            <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {rows.map(row => (
                <button
                  key={row.id}
                  onClick={() => setActiveJump(row.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all duration-200 ${
                    activeJump === row.id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2.5'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {row.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* ROW 1: EXECUTIVE KPI CARDS */}
          {activeJump === 'kpi' && (
            <section id="kpi" className="space-y-4 animate-slide-in">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-150 pb-2">Row 1: Executive KPI Cards</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Interns', value: metrics.activeInterns.toLocaleString(), desc: 'Status: Joined / Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'New Registrations', value: metrics.registrations.toLocaleString(), desc: 'Current Month Applications', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Completion Rate', value: `${metrics.completionRate}%`, desc: '% Reaching Completed Status', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Hiring Rate', value: `${metrics.hiringRate}%`, desc: '% Interns Hired Internally', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-355 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{kpi.label}</span>
                        <span className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
                      </div>
                      <div className={`h-8 w-8 rounded-lg ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                        <kpi.icon className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-455 mt-3 pt-2 border-t border-slate-50 font-bold">{kpi.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Revenue', value: `$${(metrics.totalRevenue / 1000).toFixed(1)}k`, desc: 'Confirmed payments sum', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Certificates Issued', value: metrics.certificatesIssued.toLocaleString(), desc: 'Current cycle generated', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Open Escalations', value: escalations.length.toString(), desc: 'Cases requiring HR closure', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-355 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{kpi.label}</span>
                        <span className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
                      </div>
                      <div className={`h-8 w-8 rounded-lg ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                        <kpi.icon className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-455 mt-3 pt-2 border-t border-slate-50 font-bold">{kpi.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ROW 2: STUDENT LIFECYCLE */}
          {activeJump === 'lifecycle' && (
            <section id="lifecycle" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 2: Student Lifecycle</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Strict spec-defined chronological stages count</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-150 px-2 py-0.5 rounded-lg">Status Distribution</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { stage: 'Applied', count: funnelData.applied, color: 'bg-slate-100 text-slate-700' },
                  { stage: 'Screening', count: funnelData.screening, color: 'bg-slate-200 text-slate-800' },
                  { stage: 'Interview', count: funnelData.interview, color: 'bg-slate-300 text-slate-900' },
                  { stage: 'Selected', count: funnelData.selected, color: 'bg-blue-50 text-blue-700' },
                  { stage: 'Offer Released', count: funnelData.joined, color: 'bg-blue-100 text-blue-800' },
                  { stage: 'Joined', count: funnelData.joined, color: 'bg-blue-600 text-white' },
                  { stage: 'Active', count: funnelData.active, color: 'bg-indigo-650 text-white' },
                  { stage: 'Completed', count: funnelData.completed, color: 'bg-emerald-50 text-emerald-700' },
                  { stage: 'Certified', count: funnelData.certified, color: 'bg-emerald-600 text-white' },
                  { stage: 'Hired', count: funnelData.hired, color: 'bg-teal-600 text-white' }
                ].map((item) => (
                  <div key={item.stage} className={`p-4 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform ${item.color}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 truncate">{item.stage}</span>
                    <span className="text-xl font-black mt-2">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ROW 3: STUDENT MANAGEMENT OVERVIEW */}
          {activeJump === 'students' && (
            <section id="students" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 3: Student Management Overview</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Verification records and state distribution</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[`Total: ${funnelData.applied}`, `Applied: ${funnelData.screening}`, `Selected: ${funnelData.selected}`, `Active: ${funnelData.active}`, `Completed: ${funnelData.completed}`, `Hired: ${funnelData.hired}`].map((itm, i) => (
                    <span key={i} className="text-[9px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-lg">{itm}</span>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">College & Dept</th>
                      <th className="p-3">Program & Batch</th>
                      <th className="p-3">Reporting Manager</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {students.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-blue-600 whitespace-nowrap">{stu.id}</td>
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{stu.name}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="block text-slate-800">{stu.college}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{stu.dept}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="block text-slate-800">{stu.prog}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{stu.batch}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{stu.manager}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                            stu.status === 'Active' || stu.status === 'Hired' || stu.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : stu.status === 'Joined'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {stu.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 4: PROGRAM MANAGEMENT */}
          {activeJump === 'programs' && (
            <section id="programs" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 4: Program Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Seat allocations across 6 spec-defined internship models</p>
                </div>
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                  <span>Total Programs: <span className="text-slate-850 font-black">{programs.length}</span></span>
                  <span>Filled: <span className="text-slate-850 font-black">{programs.reduce((acc, c) => acc + c.filled, 0)}</span></span>
                  <span>Available: <span className="text-slate-850 font-black">{programs.reduce((acc, c) => acc + (c.total || 100) - c.filled, 0)}</span></span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Program Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Internship Type</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Seats (Filled/Total)</th>
                      <th className="p-3">Assigned Mentors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {programs.map((prg, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{prg.name}</td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{prg.dept}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">
                            {prg.type}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-500">{prg.duration}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: `${(prg.filled / (prg.total || 100)) * 100}%` }} />
                            </div>
                            <span className="font-extrabold text-slate-700">{prg.filled}/{prg.total || 100}</span>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{prg.mentors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 5: COLLEGE MANAGEMENT */}
          {activeJump === 'colleges' && (
            <section id="colleges" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 5: College Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Coordinator contacts and MoU status parameters</p>
                </div>
                <div className="bg-amber-50 border border-amber-250 p-2.5 rounded-xl text-amber-700 text-[10px] font-bold flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>Upcoming MoU Expiry Alerts: Stanford University MoU expires in 12 days.</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">College Name</th>
                      <th className="p-3">Coordinator</th>
                      <th className="p-3">Active Students</th>
                      <th className="p-3">Completion Rate</th>
                      <th className="p-3">Placement Rate</th>
                      <th className="p-3">MoU Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {colleges.map((clg, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{clg.name}</td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{clg.coord}</td>
                        <td className="p-3 whitespace-nowrap font-extrabold text-slate-700">{clg.students}</td>
                        <td className="p-3 whitespace-nowrap text-slate-700">{clg.completion}</td>
                        <td className="p-3 whitespace-nowrap text-slate-700">{clg.placement}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            clg.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {clg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 6: ATTENDANCE MANAGEMENT */}
          {activeJump === 'attendance' && (
            <section id="attendance" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 6: Attendance Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Today's tracking registers and approvals queue</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => triggerToast('Daily attendance report exported.')} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[9px] font-bold uppercase rounded-lg">Daily</button>
                  <button onClick={() => triggerToast('Weekly attendance report exported.')} className="px-2.5 py-1 bg-slate-50 border border-slate-205 text-[9px] font-bold uppercase rounded-lg">Weekly</button>
                  <button onClick={() => triggerToast('Monthly attendance report exported.')} className="px-2.5 py-1 bg-slate-50 border border-slate-205 text-[9px] font-bold uppercase rounded-lg">Monthly</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {attendanceStats.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">{item.label}</span>
                    <span className={`text-lg font-black block mt-1 ${item.alert ? 'text-rose-600' : 'text-slate-800'}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-700 font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="block font-black text-rose-800 uppercase tracking-wider text-[10px] mb-1">Escalation Alert Triggered</span>
                  <span>Low Attendance flag raised: {attendanceAlert.name} ( {attendanceAlert.college} ) has missed {attendanceAlert.days} consecutive days. {attendanceAlert.status}.</span>
                </div>
              </div>
            </section>
          )}

          {/* ROW 7: ASSESSMENT MANAGEMENT */}
          {activeJump === 'assessments' && (
            <section id="assessments" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 7: Assessment Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Exams completion registers and evaluation metrics</p>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {['MCQ', 'Coding Test', 'Practical Test', 'Assignment', 'Viva', 'Project Evaluation'].map((t, i) => (
                    <span key={i} className="text-[8px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase font-extrabold">{t}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assessmentsStats.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">{item.label}</span>
                    <span className="text-lg font-black block mt-1 text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Assessment Title</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-center">Score Result</th>
                      <th className="p-3">Evaluation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {assessments.map((ass, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{ass.name}</td>
                        <td className="p-3 whitespace-nowrap text-slate-800">{ass.title}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{ass.type}</span>
                        </td>
                        <td className="p-3 text-center font-black text-slate-700">{ass.score}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            ass.status === 'Evaluated'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {ass.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 8: PERFORMANCE MANAGEMENT */}
          {activeJump === 'performance' && (
            <section id="performance" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 8: Performance Management</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Spec-defined weighted KPI calculation matrix model</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {[
                  { weight: 'Attendance 20%', val: '0.20' },
                  { weight: 'Assessments 25%', val: '0.25' },
                  { weight: 'Projects 30%', val: '0.30' },
                  { weight: 'Mentor Feedback 15%', val: '0.15' },
                  { weight: 'Discipline 10%', val: '0.10' }
                ].map((w, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-150 shadow-sm">
                    <span className="text-[10px] text-slate-450 uppercase tracking-wider block font-bold">{w.weight}</span>
                    <span className="text-xs font-black text-blue-600 mt-1 block">Multiplier: {w.val}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
                <div className="border border-slate-200 p-4 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Average Platform KPI</span>
                  <span className="text-2xl font-black text-slate-800">84.2/100</span>
                  <p className="text-[10px] text-slate-450 mt-2">Class-wide performance metrics summary</p>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Top Performers (Batch 482)</span>
                  <ul className="space-y-1 text-slate-700">
                    <li>1. Julianne Smith (KPI: 92)</li>
                    <li>2. Marcus Liang (KPI: 88)</li>
                  </ul>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl border-rose-200 bg-rose-50/20">
                  <span className="text-[9px] uppercase font-bold text-rose-700 tracking-wider block mb-2">At-Risk Student List</span>
                  <ul className="space-y-1 text-rose-700">
                    <li>• Vikas Gupta (Low Attendance: 72%)</li>
                    <li>• Anand R. (Assessments Avg: 58%)</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* ROW 9: PAYMENT MANAGEMENT */}
          {activeJump === 'payments' && (
            <section id="payments" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 9: Payment Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Revenue collection ledgers and pending invoices</p>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {['UPI', 'Razorpay', 'Cash', 'Bank Transfer', 'Card'].map((m, i) => (
                    <span key={i} className="text-[8px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase font-extrabold">{m}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentsStats.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">{item.label}</span>
                    <span className="text-lg font-black block mt-1 text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Student</th>
                      <th className="p-3">Program Name</th>
                      <th className="p-3 text-right">Fee (Total)</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Pending</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {payments.map((pay, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{pay.name}</td>
                        <td className="p-3 whitespace-nowrap text-slate-500">{pay.prog}</td>
                        <td className="p-3 text-right font-black text-slate-700">${pay.fee}</td>
                        <td className="p-3 text-right font-black text-slate-700">${pay.paid}</td>
                        <td className="p-3 text-right font-black text-rose-600">${pay.pending}</td>
                        <td className="p-3 whitespace-nowrap text-slate-550 font-bold">{pay.date}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            pay.status === 'Cleared'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : pay.status === 'Partially Paid'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 10: CERTIFICATE MANAGEMENT */}
          {activeJump === 'certificates' && (
            <section id="certificates" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 10: Certificate Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Compliance check validations and letters registry</p>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {['Offer Letter', 'Joining Letter', 'Internship Letter', 'Completion Certificate', 'Recommendation Letter'].map((t, i) => (
                    <span key={i} className="text-[8px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase font-extrabold">{t}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
                {certificatesStats.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{item.label}</span>
                    <span className={`text-lg font-black block mt-1 ${item.revoked ? 'text-rose-600' : 'text-slate-800'}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Certificate Number</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Certificate Type</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {certificates.map((cert, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-blue-600 whitespace-nowrap">{cert.code}</td>
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{cert.name}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{cert.type}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{cert.date}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            cert.status === 'Verified' || cert.status === 'Issued'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 11: PLACEMENT MANAGEMENT */}
          {activeJump === 'placements' && (
            <section id="placements" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 11: Placement Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Corporate selections logs and hiring analytics</p>
                </div>
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                  <span>Hired Interns: <span className="text-slate-805 font-black">{placementsStats[0].value}</span></span>
                  <span>Hiring Rate: <span className="text-slate-805 font-black">{placementsStats[1].value}</span></span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Student</th>
                      <th className="p-3">Program</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Placement Status</th>
                      <th className="p-3">Offer Status</th>
                      <th className="p-3">Hiring Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {placements.map((plc, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{plc.name}</td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{plc.prog}</td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{plc.dept}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                            plc.place === 'Hired'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : plc.place === 'Eligible'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}>
                            {plc.place}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap font-bold text-slate-550">{plc.offer}</td>
                        <td className="p-3 whitespace-nowrap text-slate-550">{plc.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ROW 12: NOTIFICATION MANAGEMENT */}
          {activeJump === 'notifications' && (
            <section id="notifications" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 12: Notification Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Delivery status tracker across 4 channels</p>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {['Email', 'SMS', 'WhatsApp', 'Push'].map((c, i) => (
                    <span key={i} className="text-[8px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase font-extrabold">{c}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {notificationStats.map((ch, idx) => {
                  let Icon = Mail;
                  if (ch.icon === 'Smartphone') Icon = Smartphone;
                  else if (ch.icon === 'MessageSquare') Icon = MessageSquare;
                  else if (ch.icon === 'Clock') Icon = Clock;
                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between animate-slide-in">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-450 uppercase tracking-wider block font-bold">{ch.channel}</span>
                        <span className="text-lg font-black text-slate-800 block">{ch.count}</span>
                        <span className="text-[9px] text-slate-400 font-bold block">{ch.status}</span>
                      </div>
                      <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Recent Dispatched Log Broadcasts</h4>
                <div className="divide-y divide-slate-100 border border-slate-150 p-4 rounded-xl space-y-3 bg-slate-50/50">
                  {notificationsLog.map((l, i) => (
                    <div key={i} className="flex justify-between items-center text-xs py-2 first:pt-0 last:pb-0 font-semibold text-slate-650 animate-slide-in">
                      <div>
                        <span className="text-slate-800 font-extrabold block">{l.title}</span>
                        <span className="text-[9px] text-slate-455 block mt-0.5">Target: {l.target}</span>
                      </div>
                      <div className="text-right text-[10px]">
                        <span className="text-slate-400 block">{l.time}</span>
                        <span className="text-blue-600 font-extrabold block mt-0.5">{l.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ROW 13: ESCALATION MANAGEMENT */}
          {activeJump === 'escalations' && (
            <section id="escalations" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 13: Escalation Management</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Strict functional escalation triggers configurations</p>
                </div>
              </div>

              {/* RULES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 mb-2">Attendance Escalation rules</span>
                  <div className="flex justify-between">
                    <span>1 Day Absent:</span>
                    <span className="font-bold text-slate-505">Reminder Notification</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3 Days Absent:</span>
                    <span className="font-extrabold text-blue-600">Level 1 Escalation (Reporting Manager)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5 Days Absent:</span>
                    <span className="font-extrabold text-amber-600">Level 2 Escalation (HR Review)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7 Days Absent:</span>
                    <span className="font-extrabold text-rose-650">Level 3 Escalation (Coordinator + HR)</span>
                  </div>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 mb-2">Assignment Escalation rules</span>
                  <div className="flex justify-between">
                    <span>Due Date Missed:</span>
                    <span className="font-bold text-slate-505">Reminder Notification</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2 Days Overdue:</span>
                    <span className="font-extrabold text-blue-600">Level 1 Escalation (Mentor Alert)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5 Days Overdue:</span>
                    <span className="font-extrabold text-rose-650">Level 2 Escalation (HR Alert)</span>
                  </div>
                </div>
              </div>

              {/* OPEN CASES */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Active Escalation List (Action Needed)</h4>
                <div className="divide-y divide-slate-100 border border-slate-155 p-4 rounded-xl space-y-3 bg-rose-50/20 text-xs font-semibold">
                  {escalations.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 font-bold">No active escalations. Good job!</div>
                  ) : (
                    escalations.map((esc, i) => (
                      <div key={i} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 animate-slide-in">
                        <div>
                          <span className="text-slate-800 font-extrabold block">{esc.name}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{esc.reason}</span>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${esc.color}`}>
                            {esc.level}
                          </span>
                          <button
                            onClick={() => handleResolveEscalation(esc.name)}
                            className="px-2.5 py-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded hover:bg-emerald-100 transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ROW 14: REPORTS & EXPORTS */}
          {activeJump === 'reports' && (
            <section id="reports" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 14: Reports</h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">Compliance records export options (PDF / Excel formats)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="border border-slate-205 p-4 rounded-xl space-y-2">
                  <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">Student / Course Reports</span>
                  <div className="flex flex-col gap-2">
                    {['Attendance Report', 'Assessment Report', 'Skill Report', 'Progress Report', 'Completion Report'].map((rep) => (
                      <div key={rep} className="flex justify-between items-center py-1">
                        <span className="text-slate-650">{rep}</span>
                        <div className="flex gap-1.5">
                          <button onClick={() => triggerToast(`Downloading ${rep} PDF.`)} className="px-2 py-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100">PDF</button>
                          <button onClick={() => triggerToast(`Downloading ${rep} Excel.`)} className="px-2 py-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100">EXCEL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-205 p-4 rounded-xl space-y-2">
                  <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">Batch / Revenue Reports</span>
                  <div className="flex flex-col gap-2">
                    {['Batch Revenue', 'Completion Rate', 'Batch Performance', 'Assignment Completion'].map((rep) => (
                      <div key={rep} className="flex justify-between items-center py-1">
                        <span className="text-slate-650">{rep}</span>
                        <div className="flex gap-1.5">
                          <button onClick={() => triggerToast(`Downloading ${rep} PDF.`)} className="px-2 py-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100">PDF</button>
                          <button onClick={() => triggerToast(`Downloading ${rep} Excel.`)} className="px-2 py-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100">EXCEL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* RECENT ACTIVITY PANEL */}
          <section className="bg-slate-900 border border-slate-955 text-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest">Recent Activity Panel</h2>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Immutable system event log registry feed</p>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {activities.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs font-semibold animate-slide-in">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">{item.event}</span>
                      <span className="text-[9px] text-slate-500 font-bold">{item.time}</span>
                    </div>
                    <p className="text-slate-300 leading-normal">{item.detail}</p>
                    <span className="text-[9px] text-slate-450 block font-bold">Initiated by: {item.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* ================================================== */}
      {/* MODALS GATEWAYS */}
      {/* ================================================== */}

      {/* MODAL 1: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-[#0047b3] text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Add New Student</h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / University</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Stanford University"
                  value={newStudent.college}
                  onChange={(e) => setNewStudent({...newStudent, college: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Computer Science"
                  value={newStudent.dept}
                  onChange={(e) => setNewStudent({...newStudent, dept: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Internship Program</label>
                <select 
                  value={newStudent.prog}
                  onChange={(e) => setNewStudent({...newStudent, prog: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                >
                  {programs.map((p, idx) => (
                    <option key={idx} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Batch ID</label>
                  <input 
                    type="text" 
                    value={newStudent.batch}
                    onChange={(e) => setNewStudent({...newStudent, batch: e.target.value})}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reporting Manager</label>
                  <input 
                    type="text" 
                    value={newStudent.manager}
                    onChange={(e) => setNewStudent({...newStudent, manager: e.target.value})}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                <select 
                  value={newStudent.status}
                  onChange={(e) => setNewStudent({...newStudent, status: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                >
                  {['Applied', 'Screening', 'Interview', 'Selected', 'Joined', 'Active', 'Completed', 'Hired'].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddStudentOpen(false)} 
                  className="flex-1 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#003B95] text-white text-xs font-bold rounded-xl hover:bg-[#002f78]"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PROGRAM */}
      {isCreateProgramOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-[#0047b3] text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Create Internship Program</h3>
              <button onClick={() => setIsCreateProgramOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateProgramSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Program Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Fullstack Automation Co-op"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Quality Engineering"
                  value={newProgram.dept}
                  onChange={(e) => setNewProgram({...newProgram, dept: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Internship Model</label>
                <select 
                  value={newProgram.type}
                  onChange={(e) => setNewProgram({...newProgram, type: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                >
                  {['Research Internship', 'Stipend Based', 'Paid', 'Corporate Sponsored'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 12 Weeks"
                    value={newProgram.duration}
                    onChange={(e) => setNewProgram({...newProgram, duration: e.target.value})}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Seat Capacity</label>
                  <input 
                    type="number" 
                    required
                    value={newProgram.total}
                    onChange={(e) => setNewProgram({...newProgram, total: Number(e.target.value)})}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Mentors</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Arjun V., Priya Sharma"
                  value={newProgram.mentors}
                  onChange={(e) => setNewProgram({...newProgram, mentors: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCreateProgramOpen(false)} 
                  className="flex-1 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#003B95] text-white text-xs font-bold rounded-xl hover:bg-[#002f78]"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD PAYMENT */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-[#0047b3] text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Record Student Payment</h3>
              <button onClick={() => setIsRecordPaymentOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Recipient</label>
                <select 
                  value={newPayment.name}
                  onChange={(e) => setNewPayment({...newPayment, name: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                >
                  {students.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Internship Program</label>
                <select 
                  value={newPayment.prog}
                  onChange={(e) => setNewPayment({...newPayment, prog: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white"
                >
                  {programs.map((p, idx) => (
                    <option key={idx} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fee Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newPayment.fee}
                    onChange={(e) => setNewPayment({...newPayment, fee: Number(e.target.value)})}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paid Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newPayment.paid}
                    onChange={(e) => setNewPayment({...newPayment, paid: Number(e.target.value)})}
                    className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Due Date (If partially paid)</label>
                <input 
                  type="date" 
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRecordPaymentOpen(false)} 
                  className="flex-1 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#003B95] text-white text-xs font-bold rounded-xl hover:bg-[#002f78]"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: GENERATE CERTIFICATE */}
      {isGenerateCertificateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-[#0047b3] text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Generate Certificate</h3>
              <button onClick={() => setIsGenerateCertificateOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleGenerateCertificateSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Recipient</label>
                <select 
                  value={newCert.name}
                  onChange={(e) => setNewCert({...newCert, name: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                >
                  {students.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificate / Letter Type</label>
                <select 
                  value={newCert.type}
                  onChange={(e) => setNewCert({...newCert, type: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white"
                >
                  {['Completion Certificate', 'Offer Letter', 'Joining Letter', 'Internship Letter', 'Recommendation Letter'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsGenerateCertificateOpen(false)} 
                  className="flex-1 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#003B95] text-white text-xs font-bold rounded-xl hover:bg-[#002f78]"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: SEND NOTIFICATION */}
      {isSendNotificationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-[#0047b3] text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Send Global Broadcast</h3>
              <button onClick={() => setIsSendNotificationOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSendNotificationSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notification Title / Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Scrum Sync Postponed to 11 AM"
                  value={newNotif.title}
                  onChange={(e) => setNewNotif({...newNotif, title: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Audience</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Batch #482, All Active Interns"
                  value={newNotif.target}
                  onChange={(e) => setNewNotif({...newNotif, target: e.target.value})}
                  className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Channels</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  {['Email', 'SMS', 'WhatsApp', 'Push'].map((ch) => {
                    const isChecked = newNotif.channels.includes(ch);
                    return (
                      <label key={ch} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleChannelCheckbox(ch)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{ch}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsSendNotificationOpen(false)} 
                  className="flex-1 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#003B95] text-white text-xs font-bold rounded-xl hover:bg-[#002f78] flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" /> Send Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
