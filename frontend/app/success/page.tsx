"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/src/config';
import Toast, { ToastType } from '../../components/ui/toast';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  const isLogin = type === 'login';

  const [toastConfig, setToastConfig] = React.useState<{ show: boolean, title: string, message: string, type: ToastType }>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });

  React.useEffect(() => {
    // Optionally fetch or send success data to the backend
    if (type) {
      fetch(`${API_ENDPOINTS.SUCCESS_DATA}?type=${type}`)
        .then((res) => {
          if (!res.ok) {
            console.warn('Failed to record success data');
            setToastConfig({
              show: true,
              title: 'Warning',
              message: 'Failed to record success data telemetry.',
              type: 'warning'
            });
            setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 4000);
          } else {
            setToastConfig({
              show: true,
              title: 'Success Data Synced',
              message: 'Your activity has been successfully logged.',
              type: 'success'
            });
            setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 4000);
          }
        })
        .catch((err) => {
          console.error('Error fetching success data:', err);
          setToastConfig({
            show: true,
            title: 'Connection Error',
            message: 'Unable to connect to the server.',
            type: 'error'
          });
          setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 4000);
        });
    }
  }, [type]);

  return (
    <div className="w-full max-w-lg rounded-2xl bg-white p-8 sm:p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 animate-slide-in">
      {/* Toast Notification */}
      {toastConfig.show && (
        <Toast 
          title={toastConfig.title}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(prev => ({ ...prev, show: false }))} 
        />
      )}
      
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/10">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {isLogin ? "Authentication: Success" : "Application Status: Applied"}
      </div>

      <h2 className="mb-4 text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
        {isLogin ? (
          <>Login Successful<br/>Welcome Back</>
        ) : (
          <>Application Submitted<br/>Successfully</>
        )}
      </h2>
      
      <p className="mb-8 text-sm text-slate-500 leading-relaxed px-4">
        {isLogin ? (
          <>You have successfully authenticated into the <strong>Pinesphere Portal</strong>. You can now access your candidate workspace, track assignments, and view upcoming schedules.</>
        ) : (
          <>Your application for the <strong>Pinesphere Internship Program</strong> has been received. Our team will review your submission and update you shortly via email.</>
        )}
      </p>

      <Link
        href={isLogin ? "/dashboard" : "/"}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-none bg-blue-600 hover:bg-blue-700 px-12 py-3.5 text-sm font-semibold text-white shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
      >
        <span>{isLogin ? "Enter Workspace" : "Return to Homepage"}</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      
      <div className="border-t border-slate-100 pt-6 mt-8">
        <p className="text-xs text-blue-500 font-semibold leading-relaxed">
          {isLogin ? (
            <>Session is active. If this is a public computer,<br/>please remember to sign out when finished.</>
          ) : (
            <>The hiring team at Pinesphere usually responds<br/>within 5 business days.</>
          )}
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col justify-between text-slate-800">
      <div>
        {/* Navigation Header */}
        <header className="h-16 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-13.5 w-auto object-contain transition-transform hover:scale-[1.02]" />
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Homepage
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <Suspense fallback={<div className="p-4 text-center text-gray-500">Loading details...</div>}>
            <SuccessPageContent />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-150 bg-white py-6 px-8 lg:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-slate-400">
        <div>© 2026 PINESPHERE ENTERPRISE. BUILT FOR SCALE.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-blue-600 transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">TERMS</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">SUPPORT</Link>
        </div>
      </footer>
    </div>
  );
}