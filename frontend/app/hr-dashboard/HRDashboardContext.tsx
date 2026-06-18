"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  user: string;
  type: 'system' | 'user' | 'alert';
}

export interface StudentData {
  id: string;
  name: string;
  initials: string;
  college: string;
  email: string;
  department: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Selected' | 'Joined' | 'Active' | 'Completed' | 'Certified' | 'Hired';
  createdDate: string;
  performance: number;
}

export interface ProgramData {
  id: string;
  name: string;
  department: string;
  type: 'Research Based' | 'Stipend Based' | 'Paid';
  duration: string;
  manager: string;
  filled: number;
  capacity: number;
  status: 'Active' | 'Closed' | 'Draft';
}

export interface EscalationData {
  id: string;
  rule: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  count: number;
  status: 'Students Active' | 'Attention Needed' | 'Students Notified';
}

interface HRDashboardContextType {
  // KPIs
  metrics: {
    activeInterns: number;
    registrations: number;
    completionRate: number;
    hiringRate: number;
    totalRevenue: number;
    certificatesIssued: number;
  };
  
  // Funnel
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

  recentActivity: ActivityLog[];
  students: StudentData[];
  programs: ProgramData[];
  escalations: EscalationData[];

  // Global Actions
  markNotificationRead: (id: string) => void;
  resolveEscalation: (id: string) => void;
}

const HRDashboardContext = createContext<HRDashboardContextType | undefined>(undefined);

export function HRDashboardProvider({ children }: { children: ReactNode }) {
  const [metrics] = useState({
    activeInterns: 12482,
    registrations: 2450,
    completionRate: 92.5,
    hiringRate: 42.8,
    totalRevenue: 450200,
    certificatesIssued: 12482, // Total issued
  });

  const [funnelData] = useState({
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

  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([
    { id: '1', action: 'registered for Java Fullstack Program', target: 'Rahul Sharma', timestamp: '2 minutes ago', user: 'Automated', type: 'system' },
    { id: '2', action: 'recorded for Batch #482 - $1,200', target: 'Payment', timestamp: '15 minutes ago', user: 'Admin: Sarah', type: 'user' },
    { id: '3', action: 'Q3 Target Met', target: 'Julianne Smith', timestamp: '30 minutes ago', user: 'System', type: 'system' },
    { id: '4', action: 'Low attendance for Vikas G. (Batch 22)', target: 'Escalation Raised', timestamp: '42 minutes ago', user: 'Auto-Trigger', type: 'alert' },
    { id: '5', action: 'uploaded placement offer letter from Microsoft India', target: 'Ananya K.', timestamp: '1 hour ago', user: 'Student Portal', type: 'user' },
    { id: '6', action: 'certificates generated', target: 'Batch SF-2024-05', timestamp: '2 hours ago', user: 'HR Admin', type: 'system' },
  ]);

  const [students] = useState<StudentData[]>([
    { id: 'STU-2024-8841', name: 'Julianne Smith', initials: 'JS', college: 'Stanford University', email: 'jsmith@edu.stanford.com', department: 'CS & Data Science', status: 'Active', createdDate: 'Sep 12, 2024', performance: 92 },
    { id: 'STU-2024-8842', name: 'Marcus Liang', initials: 'ML', college: 'MIT Institute', email: 'm.liang@mit.edu', department: 'Mechanical Eng.', status: 'Active', createdDate: 'Oct 05, 2024', performance: 88 },
    { id: 'STU-2024-8843', name: 'Devi Kumar', initials: 'DK', college: 'IIT Delhi', email: 'dkumar@iitd.ac.in', department: 'Business Admin', status: 'Screening', createdDate: 'Nov 01, 2024', performance: 0 },
    { id: 'STU-2024-8844', name: 'Ahmed El-Sayed', initials: 'AE', college: 'Cairo University', email: 'ahmed.e@cairo.uni', department: 'Software Eng.', status: 'Hired', createdDate: 'Aug 20, 2024', performance: 100 },
  ]);

  const [programs] = useState<ProgramData[]>([
    { id: 'PRG-1', name: 'AI/ML Research Internship', department: 'Data Science Dept.', type: 'Research Based', duration: '24 Weeks', manager: 'Arjun V.', capacity: 50, filled: 45, status: 'Active' },
    { id: 'PRG-2', name: 'Data Engineering Co-op', department: 'Analytics Dept.', type: 'Stipend Based', duration: '12 Weeks', manager: 'Dr. Aris Thorne', capacity: 150, filled: 120, status: 'Active' },
    { id: 'PRG-3', name: 'Enterprise Backend Focus', department: 'Engineering Dept.', type: 'Paid', duration: '8 Weeks', manager: 'Sarah Chen', capacity: 30, filled: 30, status: 'Active' },
    { id: 'PRG-4', name: 'Brand Awareness Drive', department: 'Marketing Dept.', type: 'Stipend Based', duration: '16 Weeks', manager: 'Priya Sharma', capacity: 60, filled: 12, status: 'Active' },
  ]);

  const [escalations, setEscalations] = useState<EscalationData[]>([
    { id: 'ESC-1', rule: 'Continuous Absence (3+ Days)', severity: 'HIGH', count: 12, status: 'Students Active' },
    { id: 'ESC-2', rule: 'Low Assessment Score (< 60%)', severity: 'MEDIUM', count: 28, status: 'Attention Needed' },
    { id: 'ESC-3', rule: 'Pending Documentation (> 7 Days)', severity: 'LOW', count: 2, status: 'Students Notified' },
  ]);

  const markNotificationRead = (id: string) => {
    setRecentActivity(prev => prev.filter(log => log.id !== id));
  };

  const resolveEscalation = (id: string) => {
    setEscalations(prev => prev.filter(esc => esc.id !== id));
  };

  return (
    <HRDashboardContext.Provider value={{
      metrics,
      funnelData,
      recentActivity,
      students,
      programs,
      escalations,
      markNotificationRead,
      resolveEscalation
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
