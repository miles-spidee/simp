"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/ui/toast';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validUsernames = ["admin", "Harini"];
    const inputVal = username.trim().toLowerCase();

    if (validUsernames.includes(inputVal)) {
      setShowToast(false);
      setSuccessMessage("Verification link sent! Please check the email associated with your account.");
      setUsername("");
    } else {
      setSuccessMessage("");
      setShowToast(true);
      // Auto-hide the error toast after 4 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans justify-between text-slate-800">
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

        <div className="flex flex-1 items-center justify-center p-4 py-20 animate-slide-in">
          <div className="w-full max-w-md rounded-none bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-200/80 text-center">
            
            {/* Blue Icon with Key/Lock */}
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-none bg-blue-600 text-white shadow-sm shadow-blue-500/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0113.3-6m-9.3 12A8 8 0 014 12" />
              </svg>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-slate-900">Reset your password</h2>
            <p className="mb-8 text-sm text-slate-500 px-2 leading-relaxed">
              Enter your email address and we&apos;ll send you a verification code to reset your password.
            </p>

            {successMessage && (
              <div className="mb-6 rounded-none bg-green-50 border border-green-100 p-4 text-sm text-green-700 font-semibold animate-slide-in">
                ✓ {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="text-left space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Enter your username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-none border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 transition-all placeholder-slate-400" 
                  placeholder="Eg: Harini" 
                />
              </div>

              <button type="submit" className="w-full rounded-none bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]">
                Send password to email
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <Link href="/login" className="text-xs font-bold text-blue-600 hover:text-blue-500 flex justify-center items-center gap-2 transition-transform">
                <span>←</span> Back to login
              </Link>
            </div>
          </div>
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

      {/* Toast only shows when showToast state is true */}
      {showToast && <Toast onClose={() => setShowToast(false)} />}
    </div>
  );
}