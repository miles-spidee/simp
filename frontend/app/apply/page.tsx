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
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          <span className="text-blue-600">ⓘ</span> Internship Information
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Internship Type</label>
          <select 
            required 
            value={internshipType}
            onChange={(e) => setInternshipType(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
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
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          <span className="text-blue-600">👤</span> Applicant Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required placeholder="John Doe" className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required placeholder="john.doe@university.edu" className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number</label>
            <input type="tel" required placeholder="+1 (555) 000-0000" className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">College Name</label>
            <input type="text" required placeholder="State University of Technology" className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
            <input type="text" required placeholder="Computer Science and Engineering" className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
        </div>
      </div>

      {/* Links */}
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          <span className="text-blue-600">🔗</span> Professional Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn Profile</label>
            <div className="absolute top-8 left-3 text-gray-400">🔗</div>
            <input type="url" placeholder="https://linkedin.com/in/username" className="w-full rounded-md border border-gray-300 pl-9 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">GitHub Profile</label>
            <div className="absolute top-8 left-3 text-gray-400">&lt;&gt;</div>
            <input type="url" placeholder="https://github.com/username" className="w-full rounded-md border border-gray-300 pl-9 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400" />
          </div>
        </div>
      </div>

      {/* Upload */}
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          <span className="text-blue-600">📄</span> Resume Upload
        </h2>
        <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
              <span className="text-xl text-blue-600">☁️</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">Click to upload or drag and drop</div>
            <p className="text-xs text-gray-500 mt-1">PDF files only (Max. 5MB)</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-4 border-t pt-6">
        <Link href="/" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-blue-600 hover:bg-gray-50 transition-colors">
          Cancel
        </Link>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          Submit Application <span>&rarr;</span>
        </button>
      </div>
    </form>
  );
}

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-12">
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

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-6 pt-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Internship</h1>
        <p className="text-sm text-gray-500 mb-8">Submit your application to begin your internship journey with Pinesphere Solutions.</p>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
           {/* Wrapping the form in Suspense is required when using useSearchParams */}
           <Suspense fallback={<div className="p-4 text-center text-gray-500">Loading form...</div>}>
              <ApplicationFormContent />
           </Suspense>
        </div>
      </div>
    </div>
  );
}