"use client";

import React from 'react';
import { ShieldX } from 'lucide-react';
import Link from 'next/link';

export function AccessRestrictedPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            You do not have permission to access this module.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/feature"
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
