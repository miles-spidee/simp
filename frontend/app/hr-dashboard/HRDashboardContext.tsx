"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '@/src/config';

// Define Interfaces
export interface ActivityLog {
  event: string;
  detail: string;
  time: string;
  user: string;
}

export interface StudentData {
  id: string;
  name: string;
  college: string;
  email: string;
  department: string;
  status: string;
  createdDate: string;
  performance: number;
  dept?: string;
  prog?: string;
  batch?: string;
  manager?: string;
  initials?: string;
}

export interface ProgramData {
  id: string;
  name: string;
  department: string;
  type: string;
  duration: string;
  manager: string;
  filled: number;
  capacity: number;
  status: string;
  dept?: string;
  total?: number;
  mentors?: string;
}

export interface CollegeData {
  name: string;
  coord: string;
  students: number;
  completion: string;
  placement: string;
  status: string;
}

export interface EscalationData {
  name: string;
  reason: string;
  level: string;
  color: string;
}

export interface AttendanceStat {
  label: string;
  value: string;
  alert?: boolean;
}

export interface AssessmentData {
  name: string;
  title: string;
  type: string;
  score: string;
  status: string;
}

export interface PaymentData {
  name: string;
  prog: string;
  fee: number;
  paid: number;
  pending: number;
  date: string;
  status: string;
}

export interface CertificateData {
  code: string;
  name: string;
  type: string;
  date: string;
  status: string;
}

export interface PlacementData {
  name: string;
  prog: string;
  dept: string;
  place: string;
  offer: string;
  date: string;
}

export interface NotificationLog {
  title: string;
  target: string;
  time: string;
  status: string;
}

interface HRDashboardContextType {
  isHRDataLoading: boolean;
  metrics: {
    activeInterns: number;
    registrations: number;
    completionRate: number;
    hiringRate: number;
    totalRevenue: number;
    certificatesIssued: number;
  };
  funnelData: {
    applied: number;
    screening: number;
    interview: number;
    selected: number;
    joined: number;
    active: number;
    completed: number;
    certified: number;
    hired: number;
  };
  students: StudentData[];
  programs: ProgramData[];
  colleges: CollegeData[];
  escalations: EscalationData[];
  attendanceStats: AttendanceStat[];
  attendanceAlert: { name: string; college: string; days: number; status: string };
  assessmentsStats: { label: string; value: string }[];
  assessments: AssessmentData[];
  paymentsStats: { label: string; value: string }[];
  payments: PaymentData[];
  certificatesStats: { label: string; value: string; revoked?: boolean }[];
  certificates: CertificateData[];
  placementsStats: { label: string; value: string }[];
  placements: PlacementData[];
  notificationStats: { channel: string; count: string; status: string; icon: string }[];
  notificationsLog: NotificationLog[];
  activities: ActivityLog[];
  
  // Actions
  addStudent: (student: any) => Promise<boolean>;
  createProgram: (program: any) => Promise<boolean>;
  recordPayment: (payment: any) => Promise<boolean>;
  generateCertificate: (cert: any) => Promise<boolean>;
  sendNotification: (notif: any) => Promise<boolean>;
  resolveEscalation: (studentName: string) => Promise<boolean>;
  refreshAll: () => Promise<void>;
}

const HRDashboardContext = createContext<HRDashboardContextType | undefined>(undefined);

export function HRDashboardProvider({ children }: { children: ReactNode }) {
  const [isHRDataLoading, setIsHRDataLoading] = useState(true);

  // States
  const [metrics, setMetrics] = useState({
    activeInterns: 12482,
    registrations: 2450,
    completionRate: 92.5,
    hiringRate: 42.8,
    totalRevenue: 450200,
    certificatesIssued: 12482,
  });

  const [funnelData, setFunnelData] = useState({
    applied: 4201,
    screening: 1840,
    interview: 800,
    selected: 600,
    joined: 450,
    active: 422,
    completed: 382,
    certified: 382,
    hired: 190,
  });

  const [students, setStudents] = useState<StudentData[]>([
    { id: 'STU-2024-8841', name: 'Julianne Smith', college: 'Stanford University', email: 'jsmith@edu.stanford.com', department: 'CS & Data Science', dept: 'CS & Data Science', prog: 'Java Fullstack', batch: 'Fall 2024', manager: 'Sarah Thorne', status: 'Active', createdDate: 'Sep 12, 2024', performance: 92, initials: 'JS' },
    { id: 'STU-2024-8842', name: 'Marcus Liang', college: 'MIT Institute', email: 'm.liang@mit.edu', department: 'Mechanical Eng.', dept: 'Mechanical Eng.', prog: 'AI/ML Research', batch: 'Batch #482', manager: 'Arjun V.', status: 'Joined', createdDate: 'Oct 05, 2024', performance: 88, initials: 'ML' },
    { id: 'STU-2024-8843', name: 'Devi Kumar', college: 'IIT Delhi', email: 'dkumar@iitd.ac.in', department: 'Business Admin', dept: 'Business Admin', prog: 'Backend Enterprise', batch: 'Batch #482', manager: 'Sarah Thorne', status: 'Screening', createdDate: 'Nov 01, 2024', performance: 0, initials: 'DK' },
    { id: 'STU-2024-8844', name: 'Ahmed El-Sayed', college: 'Cairo University', email: 'ahmed.e@cairo.uni', department: 'Software Eng.', dept: 'Software Eng.', prog: 'Data Engineering', batch: 'Spring 2024', manager: 'Dr. Thorne', status: 'Hired', createdDate: 'Aug 20, 2024', performance: 100, initials: 'AE' }
  ]);

  const [programs, setPrograms] = useState<ProgramData[]>([
    { id: 'PRG-1', name: 'AI/ML Research Internship', department: 'Data Science', dept: 'Data Science', type: 'Research Based', duration: '24 Weeks', manager: 'Arjun V.', filled: 45, capacity: 50, total: 50, status: 'Active', mentors: 'Arjun V., Priya S.' },
    { id: 'PRG-2', name: 'Data Engineering Co-op', department: 'Analytics', dept: 'Analytics', type: 'Stipend Based', duration: '12 Weeks', manager: 'Dr. Thorne', filled: 120, capacity: 150, total: 150, status: 'Active', mentors: 'Dr. Thorne' },
    { id: 'PRG-3', name: 'Enterprise Backend Focus', department: 'Engineering', dept: 'Engineering', type: 'Paid', duration: '8 Weeks', manager: 'Sarah Chen', filled: 30, capacity: 30, total: 30, status: 'Active', mentors: 'Sarah Chen' },
    { id: 'PRG-4', name: 'Corporate Sponsored Java', department: 'Engineering', dept: 'Engineering', type: 'Corporate Sponsored', duration: '16 Weeks', manager: 'Priya Sharma', filled: 12, capacity: 60, total: 60, status: 'Active', mentors: 'Priya Sharma' }
  ]);

  const [colleges, setColleges] = useState<CollegeData[]>([
    { name: 'Stanford University', coord: 'Julianne Smith (j.smith@st.edu)', students: 120, completion: '92.5%', placement: '42.8%', status: 'Active' },
    { name: 'MIT Institute', coord: 'Marcus Liang (m.liang@mit.edu)', students: 85, completion: '88.0%', placement: '38.0%', status: 'Active' },
    { name: 'IIT Delhi', coord: 'Devi Kumar (d.kumar@iit.ac.in)', students: 15, completion: '--', placement: '--', status: 'Pending Review' }
  ]);

  const [attendanceStats, setAttendanceStats] = useState<AttendanceStat[]>([
    { label: 'Average Attendance', value: '88.5%' },
    { label: 'Below 75%', value: '14 Students', alert: true },
    { label: "Today's Absentees", value: '8 Students' },
    { label: 'Pending Approvals', value: '3 Cases' }
  ]);

  const [attendanceAlert, setAttendanceAlert] = useState({
    name: 'Julianne Smith',
    college: 'Stanford University',
    days: 3,
    status: 'Automated Level 1 reminder dispatched to Reporting Manager'
  });

  const [assessmentsStats, setAssessmentsStats] = useState([
    { label: 'Total Assessments', value: '18 Active' },
    { label: 'Completed', value: '1,248 Submissions' },
    { label: 'Pending Evaluations', value: '45 Papers' },
    { label: 'Average Class Score', value: '82.4/100' }
  ]);

  const [assessments, setAssessments] = useState<AssessmentData[]>([
    { name: 'Julianne Smith', title: 'React Hooks & State Flow', type: 'Coding Test', score: '92/100', status: 'Evaluated' },
    { name: 'Marcus Liang', title: 'Sprint 3 Core Review', type: 'Project Evaluation', score: '88/100', status: 'Evaluated' },
    { name: 'Devi Kumar', title: 'Database Relational Mapping', type: 'MCQ', score: '--', status: 'Pending Evaluation' }
  ]);

  const [paymentsStats, setPaymentsStats] = useState([
    { label: 'Total Revenue Collected', value: '$450.2k' },
    { label: 'Pending Dues', value: '$12,400' },
    { label: 'Confirmed Payments', value: '412 Ledger entries' },
    { label: 'Overdue Reminders Out', value: '8 Alerts' }
  ]);

  const [payments, setPayments] = useState<PaymentData[]>([
    { name: 'Julianne Smith', prog: 'Java Fullstack Program', fee: 1200, paid: 1200, pending: 0, date: 'Paid', status: 'Cleared' },
    { name: 'Marcus Liang', prog: 'AI/ML Research Co-op', fee: 1500, paid: 750, pending: 750, date: 'June 30, 2026', status: 'Partially Paid' },
    { name: 'Vikas Gupta', prog: 'Backend Enterprise Focus', fee: 1200, paid: 0, pending: 1200, date: 'June 15, 2026', status: 'Overdue' }
  ]);

  const [certificatesStats, setCertificatesStats] = useState([
    { label: 'Generated Certificates', value: '12,482 Issued' },
    { label: 'Ineligibility Alerts', value: '45 Pending Completion Checks' },
    { label: 'Revoked Certificates', value: '2 Revoked', revoked: true }
  ]);

  const [certificates, setCertificates] = useState<CertificateData[]>([
    { code: 'CERT-2026-9912', name: 'Ananya Krishnan', type: 'Completion Certificate', date: 'June 01, 2026', status: 'Verified' },
    { code: 'OFFR-2026-0041', name: 'Devi Kumar', type: 'Offer Letter', date: 'May 10, 2026', status: 'Issued' },
    { code: 'CERT-2026-9900', name: 'Julianne Smith', type: 'Internship Letter', date: 'June 18, 2026', status: 'Pending Review' }
  ]);

  const [placementsStats, setPlacementsStats] = useState([
    { label: 'Hired Interns', value: '190' },
    { label: 'Hiring Rate', value: '42.8%' }
  ]);

  const [placements, setPlacements] = useState<PlacementData[]>([
    { name: 'Ahmed El-Sayed', prog: 'Data Engineering Co-op', dept: 'Analytics Dept.', place: 'Hired', offer: 'Uploaded & Verified', date: 'Aug 20, 2024' },
    { name: 'Julianne Smith', prog: 'Java Fullstack Focus', dept: 'Engineering Dept.', place: 'Eligible', offer: 'Pending Upload', date: '--' },
    { name: 'Vikas Gupta', prog: 'Enterprise Backend Focus', dept: 'Engineering Dept.', place: 'Not Placed', offer: '--', date: '--' }
  ]);

  const [notificationStats, setNotificationStats] = useState([
    { channel: 'Emails Sent', count: '14,282', status: '99.2% Delivered', icon: 'Mail' },
    { channel: 'SMS Sent', count: '5,800', status: '94.8% Delivered', icon: 'Smartphone' },
    { channel: 'WhatsApp Dispatches', count: '8,412', status: '97.4% Delivered', icon: 'MessageSquare' },
    { channel: 'Push Alerts Sent', count: '12,940', status: '12 Delivery Failures', icon: 'Clock' }
  ]);

  const [notificationsLog, setNotificationsLog] = useState<NotificationLog[]>([
    { title: 'Lecture Path Alert: Spring 3 Review Agenda', target: 'Batch #482', time: '12 minutes ago', status: 'Sent via Email/SMS' },
    { title: 'Late fee warning reminder: Payment overdue notice', target: '4 Students', time: '2 hours ago', status: 'Sent via WhatsApp' }
  ]);

  const [escalations, setEscalations] = useState<EscalationData[]>([
    { name: 'Vikas Gupta', reason: 'Absent for 4 consecutive days', level: 'Level 2 Escalation', color: 'text-amber-700 border-amber-250 bg-amber-50' },
    { name: 'Julianne Smith', reason: 'Assignment React Hooks overdue 6 days', level: 'Level 2 Escalation', color: 'text-rose-700 border-rose-250 bg-rose-50' }
  ]);

  const [activities, setActivities] = useState<ActivityLog[]>([
    { event: 'Student Registered', detail: 'Rahul Sharma registered for Java Fullstack Program', time: '2 minutes ago', user: 'Automated' },
    { event: 'Program Created', detail: 'New Co-op Data Engineering Program finalized', time: '15 minutes ago', user: 'Admin: Sarah' },
    { event: 'Payment Recorded', detail: 'Batch #482 payment of $1,200 confirmed', time: '30 minutes ago', user: 'System Sync' },
    { event: 'Certificate Generated', detail: 'Certificate Issued: Ananya Krishnan', time: '1 hour ago', user: 'HR System Manager' },
    { event: 'Assessment Published', detail: 'React Hooks and State coding evaluation published', time: '2 hours ago', user: 'Mentor: Arjun' },
    { event: 'Notification Sent', detail: 'Late fee warning broadcast sent via WhatsApp', time: '4 hours ago', user: 'Automated Trigger' },
    { event: 'Escalation Raised', detail: 'Julianne Smith low attendance warning raised to RM', time: '6 hours ago', user: 'System Clock' },
    { event: 'Placement Updated', detail: 'Ahmed El-Sayed offer letter verified for Co-op', time: '12 hours ago', user: 'Corporate Placement Lead' }
  ]);

  // Load from local storage and backend APIs
  const refreshAll = async () => {
    setIsHRDataLoading(true);
    
    // 1. Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const getStored = (key: string, fallback: any) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      };

      setMetrics(getStored('pinesphere_hr_metrics', metrics));
      setFunnelData(getStored('pinesphere_hr_funnel', funnelData));
      setStudents(getStored('pinesphere_hr_students', students));
      setPrograms(getStored('pinesphere_hr_programs', programs));
      setColleges(getStored('pinesphere_hr_colleges', colleges));
      setAttendanceStats(getStored('pinesphere_hr_attendance_stats', attendanceStats));
      setAttendanceAlert(getStored('pinesphere_hr_attendance_alert', attendanceAlert));
      setAssessmentsStats(getStored('pinesphere_hr_assessments_stats', assessmentsStats));
      setAssessments(getStored('pinesphere_hr_assessments', assessments));
      setPaymentsStats(getStored('pinesphere_hr_payments_stats', paymentsStats));
      setPayments(getStored('pinesphere_hr_payments', payments));
      setCertificatesStats(getStored('pinesphere_hr_certificates_stats', certificatesStats));
      setCertificates(getStored('pinesphere_hr_certificates', certificates));
      setPlacementsStats(getStored('pinesphere_hr_placements_stats', placementsStats));
      setPlacements(getStored('pinesphere_hr_placements', placements));
      setNotificationStats(getStored('pinesphere_hr_notification_stats', notificationStats));
      setNotificationsLog(getStored('pinesphere_hr_notifications_log', notificationsLog));
      setEscalations(getStored('pinesphere_hr_escalations', escalations));
      setActivities(getStored('pinesphere_hr_activities', activities));
    }

    // 2. Try to fetch from actual backend endpoints
    try {
      const endpointsToFetch = [
        { url: API_ENDPOINTS.HR_METRICS, setter: setMetrics, key: 'pinesphere_hr_metrics' },
        { url: API_ENDPOINTS.HR_STUDENTS, setter: setStudents, key: 'pinesphere_hr_students' },
        { url: API_ENDPOINTS.HR_PROGRAMS, setter: setPrograms, key: 'pinesphere_hr_programs' },
        { url: API_ENDPOINTS.HR_COLLEGES, setter: setColleges, key: 'pinesphere_hr_colleges' },
        { url: API_ENDPOINTS.HR_ESCALATIONS, setter: setEscalations, key: 'pinesphere_hr_escalations' },
        { url: API_ENDPOINTS.HR_NOTIFICATIONS, setter: (data: any) => {
            if (data.stats) setNotificationStats(data.stats);
            if (data.log) setNotificationsLog(data.log);
          }, key: 'pinesphere_hr_notifications'
        },
        { url: API_ENDPOINTS.HR_ATTENDANCE, setter: (data: any) => {
            if (data.stats) setAttendanceStats(data.stats);
            if (data.alert) setAttendanceAlert(data.alert);
          }, key: 'pinesphere_hr_attendance'
        },
        { url: API_ENDPOINTS.HR_PAYMENTS, setter: (data: any) => {
            if (data.stats) setPaymentsStats(data.stats);
            if (data.list) setPayments(data.list);
          }, key: 'pinesphere_hr_payments'
        },
        { url: API_ENDPOINTS.HR_CERTIFICATES, setter: (data: any) => {
            if (data.stats) setCertificatesStats(data.stats);
            if (data.list) setCertificates(data.list);
          }, key: 'pinesphere_hr_certificates'
        },
        { url: API_ENDPOINTS.HR_PLACEMENTS, setter: (data: any) => {
            if (data.stats) setPlacementsStats(data.stats);
            if (data.list) setPlacements(data.list);
          }, key: 'pinesphere_hr_placements'
        },
        { url: API_ENDPOINTS.HR_ASSESSMENTS, setter: (data: any) => {
            if (data.stats) setAssessmentsStats(data.stats);
            if (data.list) setAssessments(data.list);
          }, key: 'pinesphere_hr_assessments'
        }
      ];

      await Promise.all(endpointsToFetch.map(async ({ url, setter, key }) => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setter(data);
            localStorage.setItem(key, JSON.stringify(data));
          }
        } catch (e) {
          // Silent catch to handle offline/dev mode
        }
      }));
    } catch (e) {
      console.warn("Backend endpoints not fully reachable, relying on mock data:", e);
    } finally {
      setIsHRDataLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Save changes locally helper
  const saveLocal = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Log activity helper
  const addActivity = (event: string, detail: string, user: string = 'HR Admin') => {
    const newAct: ActivityLog = {
      event,
      detail,
      time: 'Just now',
      user
    };
    const updated = [newAct, ...activities];
    setActivities(updated);
    saveLocal('pinesphere_hr_activities', updated);
  };

  // Actions
  const addStudent = async (student: any) => {
    const newId = `STU-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = student.name || '';
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
    
    const fullStudent: StudentData = { 
      id: newId, 
      name,
      college: student.college || '',
      email: student.email || `${name.toLowerCase().replace(/\s+/g, '')}@pinesphere.com`, 
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      performance: student.performance || 0,
      status: student.status || 'Active',
      department: student.department || student.dept || 'Engineering',
      dept: student.dept || student.department || 'Engineering',
      prog: student.prog || 'General Program',
      batch: student.batch || 'Batch #1',
      manager: student.manager || 'Arjun V.',
      initials
    };
    
    // Optimistic Update
    const updatedStudents = [fullStudent, ...students];
    setStudents(updatedStudents);
    saveLocal('pinesphere_hr_students', updatedStudents);

    // Update KPIs & Funnel optimistically
    const nextMetrics = {
      ...metrics,
      activeInterns: student.status === 'Active' ? metrics.activeInterns + 1 : metrics.activeInterns,
      registrations: metrics.registrations + 1
    };
    setMetrics(nextMetrics);
    saveLocal('pinesphere_hr_metrics', nextMetrics);

    const nextFunnel = {
      ...funnelData,
      applied: funnelData.applied + 1,
      screening: student.status === 'Screening' ? funnelData.screening + 1 : funnelData.screening,
      joined: student.status === 'Joined' ? funnelData.joined + 1 : funnelData.joined,
      active: student.status === 'Active' ? funnelData.active + 1 : funnelData.active,
      hired: student.status === 'Hired' ? funnelData.hired + 1 : funnelData.hired,
    };
    setFunnelData(nextFunnel);
    saveLocal('pinesphere_hr_funnel', nextFunnel);

    // Record activity
    addActivity('Student Registered', `${name} registered and assigned to ${fullStudent.prog} Program`, 'HR Workspace');

    // Make API request
    try {
      const res = await fetch(API_ENDPOINTS.HR_STUDENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullStudent),
      });
      return res.ok;
    } catch (e) {
      // Offline fallback success (dynamic mock)
      return true;
    }
  };

  const createProgram = async (program: any) => {
    const newId = `PRG-${programs.length + 1}`;
    const fullProgram: ProgramData = {
      id: newId,
      name: program.name || 'New Program',
      department: program.department || program.dept || 'Engineering',
      dept: program.dept || program.department || 'Engineering',
      type: program.type || 'Standard',
      duration: program.duration || '12 Weeks',
      manager: program.manager || program.mentors || 'Arjun V.',
      filled: program.filled || 0,
      capacity: program.capacity || program.total || 100,
      total: program.total || program.capacity || 100,
      status: program.status || 'Active',
      mentors: program.mentors || program.manager || 'Arjun V.'
    };

    // Optimistic Update
    const updatedPrograms = [...programs, fullProgram];
    setPrograms(updatedPrograms);
    saveLocal('pinesphere_hr_programs', updatedPrograms);

    addActivity('Program Created', `New ${program.type} program "${program.name}" finalized`, 'HR Admin');

    try {
      const res = await fetch(API_ENDPOINTS.HR_PROGRAMS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProgram),
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  };

  const recordPayment = async (payment: any) => {
    const newPay: PaymentData = {
      name: payment.name,
      prog: payment.prog,
      fee: Number(payment.fee),
      paid: Number(payment.paid),
      pending: Number(payment.fee) - Number(payment.paid),
      date: payment.paid >= payment.fee ? 'Paid' : payment.dueDate || 'Pending',
      status: payment.paid >= payment.fee ? 'Cleared' : payment.paid > 0 ? 'Partially Paid' : 'Overdue'
    };

    // Optimistic Update
    const updatedPayments = [newPay, ...payments];
    setPayments(updatedPayments);
    saveLocal('pinesphere_hr_payments', updatedPayments);

    // Update revenue metrics
    const updatedRevenue = metrics.totalRevenue + Number(payment.paid);
    const nextMetrics = {
      ...metrics,
      totalRevenue: updatedRevenue
    };
    setMetrics(nextMetrics);
    saveLocal('pinesphere_hr_metrics', nextMetrics);

    // Also update stats cards
    const newPending = paymentsStats[1].value;
    const parsedPending = Number(newPending.replace(/[$,]/g, '')) - Number(payment.paid) + (Number(payment.fee) - Number(payment.paid));
    const nextStats = [
      { label: 'Total Revenue Collected', value: `$${(updatedRevenue / 1000).toFixed(1)}k` },
      { label: 'Pending Dues', value: `$${parsedPending.toLocaleString()}` },
      { label: 'Confirmed Payments', value: `${payments.length + 1} Ledger entries` },
      { label: 'Overdue Reminders Out', value: paymentsStats[3].value }
    ];
    setPaymentsStats(nextStats);
    saveLocal('pinesphere_hr_payments_stats', nextStats);

    addActivity('Payment Recorded', `Payment of $${payment.paid} recorded for ${payment.name}`, 'Billing Sync');

    try {
      const res = await fetch(API_ENDPOINTS.HR_PAYMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPay),
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  };

  const generateCertificate = async (cert: any) => {
    const newCert: CertificateData = {
      code: `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: cert.name,
      type: cert.type,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      status: 'Issued'
    };

    // Optimistic Update
    const updatedCerts = [newCert, ...certificates];
    setCertificates(updatedCerts);
    saveLocal('pinesphere_hr_certificates', updatedCerts);

    // Update KPI & Stats
    const nextMetrics = { ...metrics, certificatesIssued: metrics.certificatesIssued + 1 };
    setMetrics(nextMetrics);
    saveLocal('pinesphere_hr_metrics', nextMetrics);

    const nextStats = [
      { label: 'Generated Certificates', value: `${metrics.certificatesIssued + 1} Issued` },
      { label: 'Ineligibility Alerts', value: certificatesStats[1].value },
      { label: 'Revoked Certificates', value: certificatesStats[2].value, revoked: true }
    ];
    setCertificatesStats(nextStats);
    saveLocal('pinesphere_hr_certificates_stats', nextStats);

    addActivity('Certificate Generated', `${cert.type} issued for ${cert.name}`, 'HR Certification Desk');

    try {
      const res = await fetch(API_ENDPOINTS.HR_CERTIFICATES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert),
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  };

  const sendNotification = async (notif: any) => {
    const newLog: NotificationLog = {
      title: notif.title,
      target: notif.target,
      time: 'Just now',
      status: `Sent via ${notif.channels.join('/')}`
    };

    // Optimistic Update
    const updatedLogs = [newLog, ...notificationsLog];
    setNotificationsLog(updatedLogs);
    saveLocal('pinesphere_hr_notifications_log', updatedLogs);

    // Update channel stats counts
    const nextStats = notificationStats.map(ch => {
      const match = notif.channels.some((c: string) => ch.channel.toLowerCase().includes(c.toLowerCase()));
      if (match) {
        const currentCount = Number(ch.count.replace(/,/g, ''));
        return { ...ch, count: (currentCount + 1).toLocaleString() };
      }
      return ch;
    });
    setNotificationStats(nextStats);
    saveLocal('pinesphere_hr_notification_stats', nextStats);

    addActivity('Notification Sent', `Broadcast alert "${notif.title}" dispatched to ${notif.target}`, 'Global Dispatcher');

    try {
      const res = await fetch(API_ENDPOINTS.HR_NOTIFICATIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif),
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  };

  const resolveEscalation = async (studentName: string) => {
    // Optimistic Update
    const updatedEscalations = escalations.filter(esc => esc.name !== studentName);
    setEscalations(updatedEscalations);
    saveLocal('pinesphere_hr_escalations', updatedEscalations);

    addActivity('Escalation Resolved', `System escalation flag closed for ${studentName}`, 'HR Supervisor');

    try {
      const res = await fetch(`${API_ENDPOINTS.HR_ESCALATIONS}/${encodeURIComponent(studentName)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  };

  return (
    <HRDashboardContext.Provider value={{
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
      
      // Actions
      addStudent,
      createProgram,
      recordPayment,
      generateCertificate,
      sendNotification,
      resolveEscalation,
      refreshAll
    }}>
      {children}
    </HRDashboardContext.Provider>
  );
}

export function useHRDashboard() {
  const context = useContext(HRDashboardContext);
  if (context === undefined) {
    throw new Error('useHRDashboard must be used within a HRDashboardProvider');
  }
  return context;
}
