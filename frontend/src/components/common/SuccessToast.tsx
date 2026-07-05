"use client";

import React from 'react';
import { useErrorStore } from '../../store/errorStore';
import { CheckCircle, X } from 'lucide-react';

export function SuccessToast() {
  const { isSuccessOpen, successData, hideSuccess } = useErrorStore();

  if (!isSuccessOpen || !successData) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="bg-white shadow-xl rounded-lg border-l-4 border-green-500 p-4 flex items-start gap-3 w-80">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">Success</h3>
          <p className="text-sm text-gray-600 mt-1">{successData.message}</p>
        </div>
        <button
          onClick={hideSuccess}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
