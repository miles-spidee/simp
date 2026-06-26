"use client";

import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface AccessRestrictedProps {
  isOpen?: boolean;
  onClose?: () => void;
  message?: string;
  variant?: 'modal' | 'inline' | 'page';
}

export function AccessRestricted({ 
  isOpen = true, 
  onClose, 
  message = "You do not have permission to perform this action. Please contact your administrator if you believe this access should be granted.",
  variant = 'modal' 
}: AccessRestrictedProps) {
  if (!isOpen) return null;

  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Access Restricted</h4>
          <p className="text-sm mt-1 text-red-700/80">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-red-100 rounded-md text-red-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-md">{message}</p>
      </div>
    );
  }

  // Default: Modal
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-5">
            <ShieldAlert className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Access Restricted</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="inline-flex justify-center px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
