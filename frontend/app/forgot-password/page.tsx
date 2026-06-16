import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans">
      
      {/* Top Header */}
      <div className="h-16 w-full bg-gradient-to-r from-[#4279ea] via-[#6597f3] to-[#c7d9fb] flex items-center px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-bl-lg rounded-tr-lg bg-cyan-400">
            <span className="text-blue-900 font-bold">P</span>
          </div>
          <span className="text-lg font-bold tracking-widest text-blue-900">PINESPHERE</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
          
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb]">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">Reset your password</h2>
          <p className="mb-8 text-sm text-gray-500 px-2">
            Enter your email address and we&apos;ll send you a verification code to reset your password.
          </p>

          <form className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter your username</label>
              <input type="text" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Eg: Harini Sarvesh" />
            </div>

            <button type="submit" className="w-full rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Send password to email
            </button>
          </form>

          <div className="mt-8">
            <Link href="/login" className="text-sm font-semibold text-[#2563eb] hover:text-blue-800 flex justify-center items-center gap-2">
              <span>&larr;</span> Back to login
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between border-t border-gray-200 px-8 py-6 text-[10px] font-semibold text-gray-500 lg:px-24 gap-4 sm:gap-0">
        <div>© 2026 PINESPHERE ENTERPRISE. BUILT FOR SCALE.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-gray-900">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-gray-900">TERMS</Link>
          <Link href="#" className="hover:text-gray-900">SUPPORT</Link>
        </div>
      </div>
    </div>
  );
}