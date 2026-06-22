"use client";

import React, { useMemo } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';

export default function DynamicDashboardRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const DashboardComponent = useMemo(() => {
    if (!user) return null;
    switch (user.roleName) {
      case 'Super Admin':
      case 'Admin':
        return SuperAdminDashboard;
      case 'Student':
        return StudentDashboard;
      // case 'HR': return HRDashboard;
      // case 'Mentor': return MentorDashboard;
      default:
        // Default to student dashboard for now if role not strictly matched
        return StudentDashboard;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user || !DashboardComponent) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
          <p className="text-sm text-slate-500">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Notice we don't redirect, we simply render the dashboard component. 
  // However, this page currently doesn't have the Admin layout (sidebar/TopNav).
  // Ideally, the dynamic dashboard router is wrapped by the app shell layout.
  // For now, if SuperAdmin, redirect to /admin so they get the layout. 
  // Others redirect to /dashboard which currently has no layout, or they render their component here.
  
  if (user.roleName === 'Super Admin') {
    router.push('/admin');
    return null;
  }

  return (
    <div className="p-6 md:p-8">
      <DashboardComponent />
    </div>
  );
}
