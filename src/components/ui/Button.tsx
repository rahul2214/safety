'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emergency' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const loadingState = isLoading || loading;
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-600 shadow-xs active:bg-blue-800',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400 active:bg-slate-300',
    emergency:
      'bg-red-600 hover:bg-red-700 text-white font-semibold focus-visible:ring-red-600 shadow-xs active:bg-red-800',
    outline:
      'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400 active:bg-slate-100',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-600 shadow-xs active:bg-emerald-800',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loadingState}
      {...props}
    >
      {loadingState && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {!loadingState && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!loadingState && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
