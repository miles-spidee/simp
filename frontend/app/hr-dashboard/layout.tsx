"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Building,
  Briefcase,
  Layers,
  BadgeCheck,
  BookOpen,
  ClipboardEdit,
  LineChart,
  CreditCard,
  Award,
  UserCheck,
  Bell,
  AlertTriangle,
  PieChart,
  History,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { HRDashboardProvider } from './HRDashboardContext';

function HRDashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getActiveTab = () => {
    if (pathname === '/hr-dashboard') return 'overview';
    const pathParts = pathname.split('/');
    if (pathParts.length > 2) return pathParts[2];
    return 'overview';
  };

  const activeTab = getActiveTab();

  // Helper component for section titles
  const SectionTitle = ({ title }: { title: string }) => (
    <div className="px-4 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {title}
    </div>
  );

  // Helper component for Nav Items
  const NavItem = ({ tab }: { tab: any }) => (
    <Link
      href={tab.path}
      onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
      className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 rounded-xl ${
        activeTab === tab.id
          ? 'bg-blue-100/50 text-blue-600'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      <tab.icon className={`h-4.5 w-4.5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
      <span>{tab.label}</span>
      {tab.badge && (
        <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{tab.badge}</span>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/80 transition-transform duration-300 flex flex-col justify-between shadow-sm ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-12 w-auto object-contain transition-transform hover:scale-[1.02]" />
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Switcher */}
          <div className="p-5 border-b border-slate-100/60 bg-slate-50/50 shrink-0 hidden">
            <div className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center font-bold text-white shadow-sm rounded-xl shrink-0">
                HR
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-extrabold text-slate-800 truncate tracking-tight">HR Profile</div>
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider truncate">HR Administrator Profile</div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-0.5">
            <NavItem tab={{ id: 'overview', label: 'Dashboard', icon: Home, path: '/hr-dashboard' }} />

            <SectionTitle title="INTERNSHIP MANAGEMENT" />
            <NavItem tab={{ id: 'students', label: 'Student Management', icon: Users, path: '/hr-dashboard/students' }} />
            <NavItem tab={{ id: 'college', label: 'College Management', icon: Building, path: '/hr-dashboard/college' }} />
            <NavItem tab={{ id: 'programs', label: 'Internship Programs', icon: Briefcase, path: '/hr-dashboard/programs' }} />
            <NavItem tab={{ id: 'batch', label: 'Batch & Group', icon: Layers, path: '/hr-dashboard/batch' }} />

            <SectionTitle title="ACADEMIC OPERATIONS" />
            <NavItem tab={{ id: 'attendance', label: 'Attendance Management', icon: BadgeCheck, path: '/hr-dashboard/attendance' }} />
            <NavItem tab={{ id: 'lms', label: 'LMS', icon: BookOpen, path: '/hr-dashboard/lms' }} />
            <NavItem tab={{ id: 'assessment', label: 'Assessment', icon: ClipboardEdit, path: '/hr-dashboard/assessment' }} />
            <NavItem tab={{ id: 'performance', label: 'Performance', icon: LineChart, path: '/hr-dashboard/performance' }} />

            <SectionTitle title="BUSINESS OPERATIONS" />
            <NavItem tab={{ id: 'finance', label: 'Fee & Payment', icon: CreditCard, path: '/hr-dashboard/finance' }} />
            <NavItem tab={{ id: 'certificates', label: 'Certificates', icon: Award, path: '/hr-dashboard/certificates' }} />
            <NavItem tab={{ id: 'placement', label: 'Placement', icon: UserCheck, path: '/hr-dashboard/placement' }} />

            <SectionTitle title="COMMUNICATION" />
            <NavItem tab={{ id: 'notifications', label: 'Notifications', icon: Bell, path: '/hr-dashboard/notifications' }} />
            <NavItem tab={{ id: 'escalations', label: 'Escalations', icon: AlertTriangle, path: '/hr-dashboard/escalations' }} />

            <SectionTitle title="ANALYTICS" />
            <NavItem tab={{ id: 'analytics', label: 'Reports & Analytics', icon: PieChart, path: '/hr-dashboard/analytics' }} />
            <NavItem tab={{ id: 'audit', label: 'Audit Logs', icon: History, path: '/hr-dashboard/audit' }} />

            <SectionTitle title="SYSTEM" />
            <NavItem tab={{ id: 'settings', label: 'Settings & Config', icon: Settings, path: '/hr-dashboard/settings' }} />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2 shrink-0">
          <button
            onClick={() => {
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-xs transition-all duration-200 text-left"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 lg:pl-72 z-10 w-full relative">
        {/* Top Header */}
        <header className="h-16 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-4 py-2 rounded-full w-full max-w-md focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <Search className="h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search internships, students, or records..." 
                className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions Dropdown */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-blue-200">
                + Add Student
              </button>
              <button className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-200">
                Create Program
              </button>
            </div>

            {/* Notification bell widget */}
            <button className="h-9 w-9 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-full transition-colors relative shadow-sm">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Content */}
        <main className="flex-1 bg-[#f8fafc] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function HRDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HRDashboardProvider>
      <HRDashboardLayoutContent>{children}</HRDashboardLayoutContent>
    </HRDashboardProvider>
  );
}
