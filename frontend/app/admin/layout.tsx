"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopNav } from '@/components/admin/TopNav';
import { RouteGuard } from '@/components/guards/RouteGuard';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar isMobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav setMobileOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <RouteGuard>
              {children}
            </RouteGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
