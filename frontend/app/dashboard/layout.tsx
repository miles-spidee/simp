"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  FolderGit2,
  CreditCard,
  LogOut,
  Bell,
  CheckCircle2,
  Menu,
  X,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Award,
  BarChart3,
  HelpCircle,
  Clock
} from 'lucide-react';
import { DashboardProvider, useDashboard } from './DashboardContext';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const {
    username,
    notificationToast,
    announcements
  } = useDashboard();

  // Determine active tab based on route path
  const getActiveTabId = () => {
    if (pathname === '/dashboard') return 'overview';
    if (pathname === '/dashboard/lms') return 'lms';
    if (pathname === '/dashboard/tasks') return 'tasks';
    if (pathname === '/dashboard/assessment') return 'assessment';
    if (pathname === '/dashboard/capstone') return 'capstone';
    if (pathname === '/dashboard/attendance') return 'attendance';
    if (pathname === '/dashboard/documents') return 'documents';
    if (pathname === '/dashboard/financials') return 'financials';
    if (pathname === '/dashboard/kpi') return 'kpi';
    if (pathname === '/dashboard/chat') return 'chat';
    return 'overview';
  };

  const activeTab = getActiveTabId();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Subtle blueprint tech-grid watermark overlay */}
      <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none z-0" />

      {/* Dynamic Toast Notification banner */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 border border-blue-500 text-white font-bold py-3.5 px-6 shadow-xl animate-slide-in flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-blue-200" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 transition-transform duration-300 flex flex-col justify-between shadow-sm ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand header */}
        <div>
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-12 w-auto object-contain transition-transform hover:scale-[1.02]" />
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User profile capsule */}
          <div className="p-5 border-b border-slate-100/60 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm rounded-xl">
                {username.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-800 truncate">{username}</div>
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Intern Developer</div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
              { id: 'lms', label: 'My Learning', icon: BookOpen, path: '/dashboard/lms' },
              { id: 'tasks', label: 'Assignments', icon: ClipboardList, path: '/dashboard/tasks' },
              { id: 'assessment', label: 'Assessments', icon: ClipboardCheck, path: '/dashboard/assessment' },
              { id: 'capstone', label: 'Projects', icon: FolderGit2, path: '/dashboard/capstone' },
              { id: 'attendance', label: 'Attendance', icon: CalendarDays, path: '/dashboard/attendance' },
              { id: 'documents', label: 'Certificates', icon: Award, path: '/dashboard/documents' },
              { id: 'financials', label: 'Payments', icon: CreditCard, path: '/dashboard/financials' },
              { id: 'kpi', label: 'Performance', icon: BarChart3, path: '/dashboard/kpi' },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-600 pl-3.5'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:pl-5'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <Link
            href="/dashboard/chat"
            onClick={() => {
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-600 pl-3.5'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:pl-5'
            }`}
          >
            <HelpCircle className="h-4.5 w-4.5" />
            <span>Help Center</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('pinesphere_username');
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-xs transition-all duration-200 text-left"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER PANEL */}
      <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 lg:pl-64 z-10 relative">
        {/* Top workspace bar */}
        <header className="h-16 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-700 capitalize">
                Workspace / {activeTab === 'overview' ? 'dashboard' : activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active Session indicator */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider border border-emerald-250 bg-emerald-50 text-emerald-600">
              <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span>Active</span>
            </div>

            {/* Notification bell widget */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="h-9 w-9 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors relative shadow-sm"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
              </button>

              {showNotificationPopup && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-40 animate-slide-in text-slate-800">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                    Recent ERP Notices
                  </h3>
                  <div className="space-y-3">
                    {announcements.map((an, idx) => (
                      <div key={idx} className="text-[11px] leading-relaxed">
                        <div className="flex items-center justify-between text-blue-600 font-bold mb-1">
                          <span>{an.title}</span>
                          <span className="text-[9px] text-slate-400">{an.date}</span>
                        </div>
                        <p className="text-slate-500">{an.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Initials capsule */}
            <div className="h-9 w-9 bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 rounded-full uppercase">
              {username.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Inner panels content */}
        <main className="flex-1 p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
