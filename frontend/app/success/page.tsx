import React from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Top Header */}
      <div className="h-16 w-full bg-gradient-to-r from-[#4279ea] via-[#6597f3] to-[#c7d9fb] flex items-center px-8 lg:px-24">
        <Link href="/" className="flex items-center gap-2 mr-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-bl-lg rounded-tr-lg bg-cyan-400">
            <span className="text-blue-900 font-bold">P</span>
          </div>
          <span className="text-lg font-bold tracking-widest text-blue-900">PINESPHERE</span>
        </Link>
        <div className="hidden sm:flex gap-6 text-sm text-blue-900/80 font-medium">
            <span>Overview</span>
            <span>Programs</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg rounded-xl bg-white p-10 text-center shadow-sm border border-gray-200">
          
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb]">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
            ✓ Application Status: Applied
          </div>

          <h2 className="mb-4 text-3xl font-bold text-gray-900">Application Submitted<br/>Successfully</h2>
          
          <p className="mb-8 text-sm text-gray-600 leading-relaxed px-4">
            Your application for the <strong>Pinesphere Internship Program</strong> has been received successfully. Our team will review your submission during the screening process and update you shortly via email.
          </p>

          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#0047FF] px-12 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors mb-8"
          >
            Return to Homepage <span>🏠</span>
          </Link>
          
          <div className="border-t pt-6">
            <p className="text-xs text-blue-400">
              The hiring team at Pinesphere usually responds<br/>within 5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}