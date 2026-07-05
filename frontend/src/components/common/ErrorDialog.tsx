"use client";

import React, { useEffect } from 'react';
import { useErrorStore } from '../../store/errorStore';
import { 
  XCircle, AlertTriangle, Info, WifiOff, X
} from 'lucide-react';
import { ActionType } from '../../lib/errorUtils';

export function ErrorDialog() {
  const { isOpen, errorData, hideError } = useErrorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        hideError();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hideError]);

  if (!isOpen || !errorData) return null;

  const getIcon = () => {
    if (!errorData.status) return <AlertTriangle className="w-6 h-6 text-red-500 stroke-[1.5]" />;
    if (errorData.status >= 500) return <XCircle className="w-6 h-6 text-red-500 stroke-[1.5]" />;
    if (errorData.status >= 400 && errorData.status < 404) return <AlertTriangle className="w-6 h-6 text-amber-500 stroke-[1.5]" />;
    return <Info className="w-6 h-6 text-blue-500 stroke-[1.5]" />;
  };

  const getThemeColor = () => {
    if (!errorData.status || errorData.status >= 500) return 'border-l-red-500';
    if (errorData.status >= 400 && errorData.status < 404) return 'border-l-amber-500';
    return 'border-l-blue-500';
  };

  const handleRefresh = () => window.location.reload();
  const handleLogin = () => { hideError(); window.location.href = '/login'; };
  const handleForgotPassword = () => { hideError(); window.location.href = '/forgot-password'; };
  const handleRetry = () => { hideError(); /* Optional retry logic here */ };

  const renderActionButton = (type?: ActionType) => {
    if (!type || type === 'close') return null;

    const btnClass = "text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider";

    switch (type) {
      case 'refresh':
        return <button key="refresh" onClick={handleRefresh} className={btnClass}>Refresh</button>;
      case 'login':
        return <button key="login" onClick={handleLogin} className={btnClass}>Login</button>;
      case 'forgot_password':
        return <button key="forgot" onClick={handleForgotPassword} className={btnClass}>Forgot Password</button>;
      case 'retry':
        return <button key="retry" onClick={handleRetry} className={btnClass}>Try Again</button>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300 w-[420px] max-w-[calc(100vw-2rem)]">
      <div className={`bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl border border-gray-100 border-l-[6px] ${getThemeColor()} p-5 flex flex-col gap-3 relative overflow-hidden`}>
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 pr-6">
            <h3 className="text-[17px] font-semibold text-slate-800 tracking-tight">
              {errorData.title}
            </h3>
            <p className="text-[14px] text-slate-500 mt-1.5 leading-snug">
              {errorData.explanation}
            </p>
          </div>
          <button
            onClick={hideError}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
        
        {(errorData.primaryAction !== 'close' || errorData.secondaryAction) && (
          <div className="flex items-center gap-4 pl-8 mt-1">
            {renderActionButton(errorData.primaryAction)}
            {renderActionButton(errorData.secondaryAction)}
          </div>
        )}
      </div>
    </div>
  );
}
