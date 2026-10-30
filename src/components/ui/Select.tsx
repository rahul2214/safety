'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: Array<{ value: string | number; label: string }>;
}

export function Select({
  label,
  helperText,
  error,
  options,
  children,
  className = '',
  id,
  ...props
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-semibold text-ink"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-9 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/20'
              : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs text-red-600 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
