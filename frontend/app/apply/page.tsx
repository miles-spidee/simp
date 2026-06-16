"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// We extract the form into its own component so we can wrap it in Suspense
function ApplicationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the 'type' parameter from the URL (e.g., ?type=paid)
  const urlType = searchParams.get('type');
  
  // Set the initial state of the dropdown based on the URL
  const [internshipType, setInternshipType] = useState(urlType || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Internship Info */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          <span className="text-blue-600 text-base">ⓘ</span> Internship Information
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Internship Type</label>
          <select 
            required 
            value={internshipType}
            onChange={(e) => setInternshipType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-gray-700 transition-all"
          >
            <option value="">Select an option</option>
            <option value="free">Free Internship</option>
            <option value="paid">Paid Internship</option>
            <option value="stipend">Stipend Based Internship</option>
            <option value="corporate">Corporate Sponsored Internship</option>
            <option value="research">Research Internship</option>
            <option value="industrial">Industrial Internship</option>
          </select>
        </div>
      </div>

      {/* Applicant Info */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          <span className="text-blue-600 text-base">👤</span> Applicant Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
            <input type="text" required placeholder="John Doe" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-450 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
            <input type="email" required placeholder="john.doe@university.edu" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-450 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Mobile Number</label>
            <input type="tel" required placeholder="+1 (555) 000-0000" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-450 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">College Name</label>
            <input type="text" required placeholder="State University of Technology" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-450 transition-all" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Department</label>
            <input type="text" required placeholder="Computer Science and Engineering" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-450 transition-all" />
          </div>
        </div>
      </div>

      {/* Links */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          <span className="text-blue-600 text-base">🔗</span> Professional Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">LinkedIn Profile</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 text-sm">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l-1.507 2.26a1.293 1.293 0 102.13 1.29l1.506-2.26a1.293 1.293 0 00-2.129-1.29z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.9 13.9l1.507-2.26a1.293 1.293 0 00-2.13-1.29l-1.506 2.26a1.293 1.293 0 002.13 1.29z" /></svg>
              </span>
              <input type="url" placeholder="https://linkedin.com/in/username" className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-400 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">GitHub Profile</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 text-sm">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </span>
              <input type="url" placeholder="https://github.com/username" className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-400 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          <span className="text-blue-600 text-base">📄</span> Resume Upload
        </h2>
        <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50/80 hover:border-blue-400 transition-colors cursor-pointer text-center group">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 transition-transform group-hover:scale-105 duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div className="text-sm font-bold text-gray-850">Click to upload or drag and drop</div>
            <p className="text-xs text-gray-500 mt-1">PDF files only (Max. 5MB)</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
        <Link href="/" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </Link>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#0047FF] hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02]">
          Submit Application <span className="text-sm font-normal">▷</span>
        </button>
      </div>
    </form>
  );
}

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="h-16 w-full bg-gradient-to-r from-[#4279ea] via-[#6597f3] to-[#c7d9fb] flex items-center px-8 lg:px-24">
          <Link href="/" className="flex items-center gap-2 mr-10">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain transition-transform hover:scale-[1.02]" />
          </Link>
          <div className="hidden sm:flex gap-6 text-sm text-blue-900/80 font-semibold">
              <Link href="/" className="hover:text-blue-900 transition-colors">Overview</Link>
              <Link href="/#programs" className="hover:text-blue-900 transition-colors">Programs</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-3xl px-6 pt-12 pb-16 animate-slide-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Internship</h1>
          <p className="text-sm text-gray-500 mb-8">Submit your application to begin your internship journey with Pinesphere Solutions.</p>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 sm:p-10">
             {/* Wrapping the form in Suspense is required when using useSearchParams */}
             <Suspense fallback={<div className="p-4 text-center text-gray-500">Loading form...</div>}>
                <ApplicationFormContent />
             </Suspense>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200/80 bg-white py-6 px-8 lg:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-gray-400">
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