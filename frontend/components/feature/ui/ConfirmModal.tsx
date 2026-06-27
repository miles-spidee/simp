import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-lg font-bold text-slate-900 leading-none">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all text-white ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/20 shadow-rose-600/10' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20 shadow-blue-600/10'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
