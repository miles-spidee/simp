import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  let variantStyles = '';
  switch (variant) {
    case 'default':
      variantStyles = 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200';
      break;
    case 'secondary':
      variantStyles = 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200';
      break;
    case 'destructive':
      variantStyles = 'border-transparent bg-red-100 text-red-700 hover:bg-red-200';
      break;
    case 'success':
      variantStyles = 'border-transparent bg-green-100 text-green-700 hover:bg-green-200';
      break;
    case 'outline':
      variantStyles = 'text-slate-950 border-slate-200';
      break;
  }

  return (
    <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${variantStyles} ${className}`} {...props} />
  );
}
