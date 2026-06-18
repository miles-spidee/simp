"use client";

import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';

export default function HRDashboardOverview() {
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
            { label: 'Add Student', action: () => triggerToast('Student Registration drawer initiated.') },
            { label: 'Create Program', action: () => triggerToast('Program Builder template opened.') },
            { label: 'Create Batch', action: () => triggerToast('Batch Allocation tool active.') },
            { label: 'Record Payment', action: () => triggerToast('Payment collection entry created.') },
            { label: 'Generate Certificate', action: () => triggerToast('Batch eligibility audit compiled.') },
            { label: 'Send Notification', action: () => triggerToast('Global broadcast simulator active.') }
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
                <a
                  key={row.id}
                  href={`#${row.id}`}
                  onClick={() => setActiveJump(row.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all duration-200 ${
                    activeJump === row.id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2.5'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {row.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* ROW 1: EXECUTIVE KPI CARDS */}
          <section id="kpi" className="space-y-4 scroll-mt-20">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-150 pb-2">Row 1: Executive KPI Cards</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Active Interns', value: '2,450', desc: 'Status: Joined / Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { title: 'New Registrations', value: '382', desc: 'Current Month Applications', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { title: 'Completion Rate', value: '92.5%', desc: '% Reaching Completed Status', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { title: 'Hiring Rate', value: '42.8%', desc: '% Interns Hired Internally', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-350 transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{kpi.title}</span>
                      <span className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
                    </div>
                    <div className={`h-8 w-8 rounded-lg ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                      <kpi.icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-3 pt-2 border-t border-slate-50 font-bold">{kpi.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'Total Revenue', value: '$450.2k', desc: 'Confirmed payments sum', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { title: 'Certificates Issued', value: '12,482', desc: 'Current cycle generated', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { title: 'Open Escalations', value: '42', desc: 'Cases requiring HR closure', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-350 transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{kpi.title}</span>
                      <span className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
                    </div>
                    <div className={`h-8 w-8 rounded-lg ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                      <kpi.icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-3 pt-2 border-t border-slate-50 font-bold">{kpi.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ROW 2: STUDENT LIFECYCLE */}
          <section id="lifecycle" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 2: Student Lifecycle</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Strict spec-defined chronological stages count</p>
              </div>
              <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-150 px-2 py-0.5 rounded-lg">Status Distribution</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { stage: 'Applied', count: 4201, color: 'bg-slate-100 text-slate-700' },
                { stage: 'Screening', count: 1840, color: 'bg-slate-200 text-slate-800' },
                { stage: 'Interview', count: 800, color: 'bg-slate-300 text-slate-900' },
                { stage: 'Selected', count: 600, color: 'bg-blue-50 text-blue-700' },
                { stage: 'Offer Released', count: 450, color: 'bg-blue-100 text-blue-800' },
                { stage: 'Joined', count: 422, color: 'bg-blue-600 text-white' },
                { stage: 'Active', count: 400, color: 'bg-indigo-650 text-white' },
                { stage: 'Completed', count: 382, color: 'bg-emerald-50 text-emerald-700' },
                { stage: 'Certified', count: 382, color: 'bg-emerald-600 text-white' },
                { stage: 'Hired', count: 190, color: 'bg-teal-600 text-white' }
              ].map((item) => (
                <div key={item.stage} className={`p-4 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform ${item.color}`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 truncate">{item.stage}</span>
                  <span className="text-xl font-black mt-2">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ROW 3: STUDENT MANAGEMENT OVERVIEW */}
          <section id="students" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 3: Student Management Overview</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Verification records and state distribution</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['Total: 4,201', 'Applied: 1,840', 'Selected: 600', 'Active: 422', 'Completed: 382', 'Hired: 190'].map((itm, i) => (
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
                  {[
                    { id: 'STU-2024-8841', name: 'Julianne Smith', college: 'Stanford University', dept: 'CS & Data Science', prog: 'Java Fullstack', batch: 'Fall 2024', manager: 'Sarah Thorne', status: 'Active' },
                    { id: 'STU-2024-8842', name: 'Marcus Liang', college: 'MIT Institute', dept: 'Mechanical Eng.', prog: 'AI/ML Research', batch: 'Batch #482', manager: 'Arjun V.', status: 'Joined' },
                    { id: 'STU-2024-8843', name: 'Devi Kumar', college: 'IIT Delhi', dept: 'Business Admin', prog: 'Backend Enterprise', batch: 'Batch #482', manager: 'Sarah Thorne', status: 'Screening' },
                    { id: 'STU-2024-8844', name: 'Ahmed El-Sayed', college: 'Cairo University', dept: 'Software Eng.', prog: 'Data Engineering', batch: 'Spring 2024', manager: 'Dr. Thorne', status: 'Hired' }
                  ].map((stu) => (
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
                      <td className="p-3 whitespace-nowrap text-slate-500">{stu.manager}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                          stu.status === 'Active' || stu.status === 'Hired'
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

          {/* ROW 4: PROGRAM MANAGEMENT */}
          <section id="programs" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 4: Program Management</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Seat allocations across 6 spec-defined internship models</p>
              </div>
              <div className="flex gap-4 text-xs font-bold text-slate-500">
                <span>Total Programs: <span className="text-slate-850 font-black">4</span></span>
                <span>Filled: <span className="text-slate-850 font-black">207</span></span>
                <span>Available: <span className="text-slate-850 font-black">83</span></span>
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
                  {[
                    { name: 'AI/ML Research Internship', dept: 'Data Science', type: 'Research Internship', duration: '24 Weeks', filled: 45, total: 50, mentors: 'Arjun V., Priya S.' },
                    { name: 'Data Engineering Co-op', dept: 'Analytics', type: 'Stipend Based', duration: '12 Weeks', filled: 120, total: 150, mentors: 'Dr. Thorne' },
                    { name: 'Enterprise Backend Focus', dept: 'Engineering', type: 'Paid', duration: '8 Weeks', filled: 30, total: 30, mentors: 'Sarah Chen' },
                    { name: 'Corporate Sponsored Java', dept: 'Engineering', type: 'Corporate Sponsored', duration: '16 Weeks', filled: 12, total: 60, mentors: 'Priya Sharma' }
                  ].map((prg, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{prg.name}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{prg.dept}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">
                          {prg.type}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{prg.duration}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${(prg.filled / prg.total) * 100}%` }} />
                          </div>
                          <span className="font-extrabold text-slate-700">{prg.filled}/{prg.total}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{prg.mentors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ROW 5: COLLEGE MANAGEMENT */}
          <section id="colleges" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
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
                  {[
                    { name: 'Stanford University', coord: 'Julianne Smith (j.smith@st.edu)', students: 120, completion: '92.5%', placement: '42.8%', status: 'Active' },
                    { name: 'MIT Institute', coord: 'Marcus Liang (m.liang@mit.edu)', students: 85, completion: '88.0%', placement: '38.0%', status: 'Active' },
                    { name: 'IIT Delhi', coord: 'Devi Kumar (d.kumar@iit.ac.in)', students: 15, completion: '--', placement: '--', status: 'Pending Review' }
                  ].map((clg, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{clg.name}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{clg.coord}</td>
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

          {/* ROW 6: ATTENDANCE MANAGEMENT */}
          <section id="attendance" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 6: Attendance Management</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Today's tracking registers and approvals queue</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => triggerToast('Daily attendance report exported.')} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[9px] font-bold uppercase rounded-lg">Daily</button>
                <button onClick={() => triggerToast('Weekly attendance report exported.')} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[9px] font-bold uppercase rounded-lg">Weekly</button>
                <button onClick={() => triggerToast('Monthly attendance report exported.')} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[9px] font-bold uppercase rounded-lg">Monthly</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Average Attendance', value: '88.5%' },
                { label: 'Below 75%', value: '14 Students', alert: true },
                { label: "Today's Absentees", value: '8 Students' },
                { label: 'Pending Approvals', value: '3 Cases' }
              ].map((item, idx) => (
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
                <span>Low Attendance flag raised: Julianne Smith ( Stanford University ) has missed 3 consecutive days. Automated Level 1 reminder dispatched to Reporting Manager.</span>
              </div>
            </div>
          </section>

          {/* ROW 7: ASSESSMENT MANAGEMENT */}
          <section id="assessments" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
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
              {[
                { label: 'Total Assessments', value: '18 Active' },
                { label: 'Completed', value: '1,248 Submissions' },
                { label: 'Pending Evaluations', value: '45 Papers' },
                { label: 'Average Class Score', value: '82.4/100' }
              ].map((item, idx) => (
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
                  {[
                    { name: 'Julianne Smith', title: 'React Hooks & State Flow', type: 'Coding Test', score: '92/100', status: 'Evaluated' },
                    { name: 'Marcus Liang', title: 'Sprint 3 Core Review', type: 'Project Evaluation', score: '88/100', status: 'Evaluated' },
                    { name: 'Devi Kumar', title: 'Database Relational Mapping', type: 'MCQ', score: '--', status: 'Pending Evaluation' }
                  ].map((ass, i) => (
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
                            : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
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

          {/* ROW 8: PERFORMANCE MANAGEMENT */}
          <section id="performance" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
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

          {/* ROW 9: PAYMENT MANAGEMENT */}
          <section id="payments" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
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
              {[
                { label: 'Total Revenue Collected', value: '$450.2k' },
                { label: 'Pending Dues', value: '$12,400' },
                { label: 'Confirmed Payments', value: '412 Ledger entries' },
                { label: 'Overdue Reminders Out', value: '8 Alerts' }
              ].map((item, idx) => (
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
                  {[
                    { name: 'Julianne Smith', prog: 'Java Fullstack Program', fee: 1200, paid: 1200, pending: 0, date: 'Paid', status: 'Cleared' },
                    { name: 'Marcus Liang', prog: 'AI/ML Research Co-op', fee: 1500, paid: 750, pending: 750, date: 'June 30, 2026', status: 'Partially Paid' },
                    { name: 'Vikas Gupta', prog: 'Backend Enterprise Focus', fee: 1200, paid: 0, pending: 1200, date: 'June 15, 2026', status: 'Overdue' }
                  ].map((pay, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{pay.name}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{pay.prog}</td>
                      <td className="p-3 text-right font-black text-slate-700">${pay.fee}</td>
                      <td className="p-3 text-right font-black text-slate-700">${pay.paid}</td>
                      <td className="p-3 text-right font-black text-rose-600">${pay.pending}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500 font-bold">{pay.date}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                          pay.status === 'Cleared'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : pay.status === 'Partially Paid'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
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

          {/* ROW 10: CERTIFICATE MANAGEMENT */}
          <section id="certificates" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
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
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Generated Certificates</span>
                <span className="text-lg font-black text-slate-800 block mt-1">12,482 Issued</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ineligibility Alerts</span>
                <span className="text-lg font-black text-slate-800 block mt-1">45 Pending Completion Checks</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Revoked Certificates</span>
                <span className="text-lg font-black text-rose-600 block mt-1">2 Revoked</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Certificate Code</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Certificate Type</th>
                    <th className="p-3">Generation Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                  {[
                    { code: 'CERT-2026-9912', name: 'Ananya Krishnan', type: 'Completion Certificate', date: 'June 01, 2026', status: 'Verified' },
                    { code: 'OFFR-2026-0041', name: 'Devi Kumar', type: 'Offer Letter', date: 'May 10, 2026', status: 'Issued' },
                    { code: 'CERT-2026-9900', name: 'Julianne Smith', type: 'Internship Letter', date: 'June 18, 2026', status: 'Pending Review' }
                  ].map((cert, i) => (
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

          {/* ROW 11: PLACEMENT MANAGEMENT */}
          <section id="placements" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 11: Placement Management</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Corporate selections logs and hiring analytics</p>
              </div>
              <div className="flex gap-4 text-xs font-bold text-slate-500">
                <span>Hired Interns: <span className="text-slate-800 font-black">190</span></span>
                <span>Hiring Rate: <span className="text-slate-800 font-black">42.8%</span></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Internship Program</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Placement Status</th>
                    <th className="p-3">Offer Letter</th>
                    <th className="p-3">Hiring Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                  {[
                    { name: 'Ahmed El-Sayed', prog: 'Data Engineering Co-op', dept: 'Analytics Dept.', place: 'Hired', offer: 'Uploaded & Verified', date: 'Aug 20, 2024' },
                    { name: 'Julianne Smith', prog: 'Java Fullstack Focus', dept: 'Engineering Dept.', place: 'Eligible', offer: 'Pending Upload', date: '--' },
                    { name: 'Vikas Gupta', prog: 'Enterprise Backend Focus', dept: 'Engineering Dept.', place: 'Not Placed', offer: '--', date: '--' }
                  ].map((plc, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{plc.name}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{plc.prog}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{plc.dept}</td>
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
                      <td className="p-3 whitespace-nowrap font-bold text-slate-500">{plc.offer}</td>
                      <td className="p-3 whitespace-nowrap text-slate-500">{plc.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ROW 12: NOTIFICATION MANAGEMENT */}
          <section id="notifications" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 12: Notification Management</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Delivery metrics tracking across 4 communication channels</p>
              </div>
              <div className="flex gap-1 flex-wrap">
                {['Email', 'SMS', 'WhatsApp', 'Push'].map((c, i) => (
                  <span key={i} className="text-[8px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase font-extrabold">{c}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { channel: 'Emails Sent', count: '14,282', icon: Mail, status: '99.2% Delivered' },
                { channel: 'SMS Sent', count: '5,800', icon: Smartphone, status: '94.8% Delivered' },
                { channel: 'WhatsApp Dispatches', count: '8,412', icon: MessageSquare, status: '97.4% Delivered' },
                { channel: 'Push Alerts Sent', count: '12,940', icon: Clock, status: '12 Delivery Failures' }
              ].map((ch, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-450 uppercase tracking-wider block font-bold">{ch.channel}</span>
                    <span className="text-lg font-black text-slate-800 block">{ch.count}</span>
                    <span className="text-[9px] text-slate-400 font-bold block">{ch.status}</span>
                  </div>
                  <ch.icon className="h-5 w-5 text-slate-400" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Recent Dispatched Log Broadcasts</h4>
              <div className="divide-y divide-slate-100 border border-slate-150 p-4 rounded-xl space-y-3 bg-slate-50/50">
                {[
                  { title: 'Lecture Path Alert: Spring 3 Review Agenda', target: 'Batch #482', time: '12 minutes ago', status: 'Sent via Email/SMS' },
                  { title: 'Late fee warning reminder: Payment overdue notice', target: '4 Students', time: '2 hours ago', status: 'Sent via WhatsApp' }
                ].map((l, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-2 first:pt-0 last:pb-0 font-semibold text-slate-600">
                    <div>
                      <span className="text-slate-800 font-extrabold block">{l.title}</span>
                      <span className="text-[9px] text-slate-450 block mt-0.5">Target: {l.target}</span>
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

          {/* ROW 13: ESCALATION MANAGEMENT */}
          <section id="escalations" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 13: Escalation Management</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Strict functional escalation triggers configurations</p>
              </div>
            </div>

            {/* RULES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 mb-2">Attendance Escalation triggers</span>
                <div className="flex justify-between">
                  <span>1 Day Absent:</span>
                  <span className="font-bold text-slate-500">Auto SMS Reminder</span>
                </div>
                <div className="flex justify-between">
                  <span>3 Days Absent:</span>
                  <span className="font-extrabold text-blue-600">Level 1 Escalation (Reporting Manager)</span>
                </div>
                <div className="flex justify-between">
                  <span>5 Days Absent:</span>
                  <span className="font-extrabold text-amber-600">Level 2 Escalation (HR Warning)</span>
                </div>
                <div className="flex justify-between">
                  <span>7 Days Absent:</span>
                  <span className="font-extrabold text-rose-650">Level 3 Escalation (Coordinator + HR Lock)</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 mb-2">Assignment Escalation triggers</span>
                <div className="flex justify-between">
                  <span>Due Date Missed:</span>
                  <span className="font-bold text-slate-500">Email Reminder Notification</span>
                </div>
                <div className="flex justify-between">
                  <span>2 Days Overdue:</span>
                  <span className="font-extrabold text-blue-600">Level 1 Escalation (Mentor Alert)</span>
                </div>
                <div className="flex justify-between">
                  <span>5 Days Overdue:</span>
                  <span className="font-extrabold text-rose-650">Level 2 Escalation (HR Review)</span>
                </div>
              </div>
            </div>

            {/* OPEN CASES */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Active Escalation List (Action Needed)</h4>
              <div className="divide-y divide-slate-100 border border-slate-150 p-4 rounded-xl space-y-3 bg-rose-50/20 text-xs">
                {[
                  { name: 'Vikas Gupta', reason: 'Absent for 4 consecutive days', level: 'Level 2 Escalation', color: 'text-amber-700 border-amber-250 bg-amber-50' },
                  { name: 'Julianne Smith', reason: 'Assignment React Hooks overdue 6 days', level: 'Level 2 Escalation', color: 'text-rose-700 border-rose-250 bg-rose-50' }
                ].map((esc, i) => (
                  <div key={i} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 font-semibold">
                    <div>
                      <span className="text-slate-800 font-extrabold block">{esc.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{esc.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${esc.color}`}>
                        {esc.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ROW 14: REPORTS & EXPORTS */}
          <section id="reports" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-20">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Row 14: Reports</h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Compliance records export vault (PDF / Excel formats)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
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

              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="block font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">Batch / Revenue Reports</span>
                <div className="flex flex-col gap-2">
                  {['Batch Revenue', 'Batch Completion Rate', 'Batch Performance', 'Assignment Completion'].map((rep) => (
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

          {/* RECENT ACTIVITY PANEL */}
          <section className="bg-slate-900 border border-slate-950 text-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest">Recent Activity Panel</h2>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Immutable system event log registry feed</p>
            </div>
            
            <div className="space-y-4">
              {[
                { event: 'Student Registered', detail: 'Rahul Sharma registered for Java Fullstack Program', time: '2 minutes ago', user: 'Automated' },
                { event: 'Program Created', detail: 'New Co-op Data Engineering Program finalized', time: '15 minutes ago', user: 'Admin: Sarah' },
                { event: 'Payment Recorded', detail: 'Batch #482 payment of $1,200 confirmed', time: '30 minutes ago', user: 'System Sync' },
                { event: 'Certificate Generated', detail: 'Certificate Issued: Ananya Krishnan', time: '1 hour ago', user: 'HR System Manager' },
                { event: 'Assessment Published', detail: 'React Hooks and State coding evaluation published', time: '2 hours ago', user: 'Mentor: Arjun' },
                { event: 'Notification Sent', detail: 'Late fee warning broadcast sent via WhatsApp', time: '4 hours ago', user: 'Automated Trigger' },
                { event: 'Escalation Raised', detail: 'Julianne Smith low attendance warning raised to RM', time: '6 hours ago', user: 'System Clock' },
                { event: 'Placement Updated', detail: 'Ahmed El-Sayed offer letter verified for Co-op', time: '12 hours ago', user: 'Corporate Placement Lead' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs font-semibold">
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
      
    </div>
  );
}
