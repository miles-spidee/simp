"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from '../feature/TopNav';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on tablet screen widths (between 768px and 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 768 && window.innerWidth < 1024) {
          setSidebarCollapsed(true);
        } else if (window.innerWidth >= 1024) {
          setSidebarCollapsed(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Run on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Unified Sidebar Navigation */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        setMobileOpen={setSidebarOpen} 
        isCollapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      {/* Content Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <TopNav setMobileOpen={setSidebarOpen} />
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col justify-between">
          <div className="p-4 sm:p-6 lg:p-8 flex-grow">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
          
          {/* Common Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
