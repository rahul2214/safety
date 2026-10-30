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
    'inline-flex items-center justify-center font-semibold rounded-full transition active:scale-[0.98] cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-brand hover:bg-brand-deep text-white focus-visible:ring-brand shadow-[0_6px_16px_-8px_rgba(29,91,216,0.7)]',
    secondary:
      'bg-mist hover:bg-slate-200 text-ink focus-visible:ring-slate-400',
    emergency:
      'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600 shadow-[0_6px_16px_-8px_rgba(220,38,38,0.7)]',
    outline:
      'border border-slate-200 bg-white hover:border-slate-300 hover:bg-mist text-ink focus-visible:ring-slate-400',
    ghost:
      'text-slate-600 hover:text-ink hover:bg-mist focus-visible:ring-slate-400',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-600',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[34px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[50px]',
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
