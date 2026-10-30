'use client';

import React from 'react';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Action Required'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

interface StatusBadgeProps {
  status: ReportStatus | string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalized = status?.toUpperCase() || 'SUBMITTED';

  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  if (normalized.includes('SUBMIT')) {
    colorStyles = 'bg-blue-50 text-blue-700 border-blue-200';
    label = 'Submitted';
  } else if (normalized.includes('REVIEW')) {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Under Review';
  } else if (normalized.includes('ACTION')) {
    colorStyles = 'bg-red-50 text-red-700 border-red-200 font-semibold';
    label = 'Action Required';
  } else if (normalized.includes('PROGRESS')) {
    colorStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    label = 'In Progress';
  } else if (normalized.includes('RESOLV')) {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Resolved';
  } else if (normalized.includes('CLOSE')) {
    colorStyles = 'bg-slate-100 text-slate-600 border-slate-200';
    label = 'Closed';
  }

  const sizeStyles =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${colorStyles} ${sizeStyles}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized.includes('RESOLV')
            ? 'bg-emerald-600'
            : normalized.includes('ACTION')
            ? 'bg-red-600'
            : normalized.includes('REVIEW')
            ? 'bg-amber-600'
            : normalized.includes('PROGRESS')
            ? 'bg-indigo-600'
            : 'bg-blue-600'
        }`}
      />
      <span>{label}</span>
    </span>
  );
}
