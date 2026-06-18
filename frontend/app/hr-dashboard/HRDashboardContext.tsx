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
    activeInterns: 0,
    registrations: 0,
    completionRate: 0,
    hiringRate: 0,
    totalRevenue: 0,
    certificatesIssued: 0,
  });

  const [funnelData, setFunnelData] = useState({
    applied: 0,
    screening: 0,
    interview: 0,
    selected: 0,
    joined: 0,
    active: 0,
    completed: 0,
    certified: 0,
    hired: 0,
  });

  const [students, setStudents] = useState<StudentData[]>([]);

  const [programs, setPrograms] = useState<ProgramData[]>([]);

  const [colleges, setColleges] = useState<CollegeData[]>([]);

  const [attendanceStats, setAttendanceStats] = useState<AttendanceStat[]>([]);

  const [attendanceAlert, setAttendanceAlert] = useState({
    name: '',
    college: '',
    days: 0,
    status: ''
  });

  const [assessmentsStats, setAssessmentsStats] = useState<{ label: string; value: string }[]>([]);

  const [assessments, setAssessments] = useState<AssessmentData[]>([]);

  const [paymentsStats, setPaymentsStats] = useState<{ label: string; value: string }[]>([]);

  const [payments, setPayments] = useState<PaymentData[]>([]);

  const [certificatesStats, setCertificatesStats] = useState<{ label: string; value: string; revoked?: boolean }[]>([]);

  const [certificates, setCertificates] = useState<CertificateData[]>([]);

  const [placementsStats, setPlacementsStats] = useState<{ label: string; value: string }[]>([]);

  const [placements, setPlacements] = useState<PlacementData[]>([]);

  const [notificationStats, setNotificationStats] = useState<{ channel: string; count: string; status: string; icon: string }[]>([]);

  const [notificationsLog, setNotificationsLog] = useState<NotificationLog[]>([]);

  const [escalations, setEscalations] = useState<EscalationData[]>([]);

  const [activities, setActivities] = useState<ActivityLog[]>([]);

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
