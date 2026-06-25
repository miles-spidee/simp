"use client";

import React, { useState } from 'react';
import { ShieldX, X } from 'lucide-react';

interface AccessRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessRestrictedModal({ isOpen, onClose }: AccessRestrictedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <ShieldX className="h-8 w-8 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            You do not have permission to perform this action.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please contact your administrator.
          </p>
        </div>

        {/* Action */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for easy modal usage
export function useAccessRestrictedModal() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    Modal: () => <AccessRestrictedModal isOpen={isOpen} onClose={() => setIsOpen(false)} />,
  };
}
