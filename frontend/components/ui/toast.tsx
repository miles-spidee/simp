"use client";

import React from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  title: string;
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, message, type = 'error', onClose }) => {
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  const isInfo = type === 'info';

  const stripeColor = isSuccess ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : isInfo ? 'bg-blue-500' : 'bg-red-600';
  const iconColor = isSuccess ? 'text-emerald-500' : isWarning ? 'text-amber-500' : isInfo ? 'text-blue-500' : 'text-red-600';

  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-100/80 ring-1 ring-black/5 animate-slide-in">
      <div className={`w-1.5 ${stripeColor} flex-shrink-0`}></div>
      <div className="flex flex-1 items-start p-5">
        <div className="flex-shrink-0">
          {isSuccess ? (
            <svg className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isWarning ? (
            <svg className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : isInfo ? (
            <svg className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          ) : (
            <svg className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-lg font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button type="button" onClick={onClose} className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;