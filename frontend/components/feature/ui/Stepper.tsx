import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full px-16 pt-6 pb-12 mb-2 bg-slate-50/50 border-b border-slate-100">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-100 z-0" />
        
        {/* Active progress bar */}
        <div 
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-blue-600 z-0 transition-all duration-300 ease-in-out" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300 ${
                  isCompleted 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : isCurrent 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <span 
                className={`mt-2 text-xs font-medium whitespace-nowrap absolute top-10 transition-colors duration-300 ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
