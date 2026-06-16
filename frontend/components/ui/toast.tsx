"use client";

import React from 'react';

interface ToastProps {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ onClose }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-96 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
      <div className="w-2 bg-red-600"></div>
      <div className="flex flex-1 items-start p-4">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-lg font-semibold text-gray-900">Account Not Found</p>
          <p className="mt-1 text-sm text-gray-500">
            We couldn&apos;t find an account associated with this email address. Please check for typos and try again.
          </p>
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