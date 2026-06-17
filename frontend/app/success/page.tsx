"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  const isLogin = type === 'login';

  return (
    <div className="w-full max-w-lg rounded-none bg-white p-8 sm:p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-200/80 animate-slide-in">
      
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-blue-600 text-white shadow-sm shadow-blue-500/10">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="mb-4 inline-block rounded-none bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
        ✓ {isLogin ? "Authentication: Success" : "Application Status: Applied"}
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
        {isLogin ? "Enter Workspace" : "Return to Homepage"} <span className="text-xs">🏠</span>
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
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span>←</span> Return to Homepage
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