'use client';

import React from'react';

/**
 * Base atomic Skeleton block with pulse shimmer.
 * Supports light & dark theme backgrounds automatically.
 */
export function Skeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
  <div
  className={`animate-pulse rounded bg-slate-200/80 ${className}`}
  aria-hidden="true"
  />
  );
}

/**
 * Skeleton for PostCard / Incident Reports (used in Feed, MyPosts, etc.)
 */
export function PostCardSkeleton() {
  return (
  <div className="bg-white rounded-[20px] border border-[#e8e8f0] border-l-4 border-l-slate-200 p-4 sm:p-5 space-y-3.5 shadow-xs animate-pulse">
  {/* Author and Severity */}
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2.5">
  <Skeleton className="w-9 h-9 rounded-full" />
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-28 rounded-md" />
  <Skeleton className="h-3 w-16 rounded-md" />
  </div>
  </div>
  <Skeleton className="h-6 w-24 rounded-full" />
  </div>

  {/* Content lines */}
  <div className="space-y-2">
  <Skeleton className="h-4 w-full rounded-md" />
  <Skeleton className="h-4 w-5/6 rounded-md" />
  <Skeleton className="h-4 w-2/3 rounded-md" />
  </div>

  {/* Tags / Location */}
  <div className="flex items-center gap-2 pt-1">
  <Skeleton className="h-5 w-24 rounded-full" />
  <Skeleton className="h-5 w-32 rounded-full" />
  </div>

  {/* Actions footer */}
  <div className="pt-2 border-t border-[#f1f1f6] flex items-center justify-between">
  <div className="flex items-center gap-2">
  <Skeleton className="h-8 w-20 rounded-[10px]" />
  <Skeleton className="h-8 w-24 rounded-[10px]" />
  </div>
  <Skeleton className="h-8 w-16 rounded-[10px]" />
  </div>
  </div>
  );
}

/**
 * Skeleton for Emergency Contact Cards (/contacts)
 */
export function ContactCardSkeleton() {
  return (
  <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
  <div className="flex items-center gap-3.5">
  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
  <div className="space-y-1.5">
  <div className="flex items-center gap-2">
  <Skeleton className="h-4 w-32 rounded-md" />
  <Skeleton className="h-4 w-16 rounded-md" />
  </div>
  <Skeleton className="h-3 w-40 rounded-md" />
  </div>
  </div>
  <div className="flex items-center gap-2 self-end sm:self-center">
  <Skeleton className="h-8 w-8 rounded-lg" />
  <Skeleton className="h-8 w-24 rounded-lg" />
  <Skeleton className="h-8 w-8 rounded-lg" />
  <Skeleton className="h-8 w-8 rounded-lg" />
  </div>
  </div>
  );
}

/**
 * Skeleton for Support Tickets (/support)
 */
export function SupportTicketSkeleton() {
  return (
  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 animate-pulse">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
  <div className="flex items-center gap-2">
  <Skeleton className="h-5 w-20 rounded" />
  <Skeleton className="h-4 w-44 rounded" />
  <Skeleton className="h-4 w-16 rounded-full" />
  </div>
  <div className="flex items-center gap-2">
  <Skeleton className="h-5 w-20 rounded-full" />
  <Skeleton className="h-3 w-20 rounded" />
  </div>
  </div>
  <Skeleton className="h-3.5 w-4/5 rounded" />
  <Skeleton className="h-3 w-36 rounded" />
  </div>
  );
}

/**
 * Skeleton for Discover Topic Cards (/discover)
 */
export function TopicCardSkeleton() {
  return (
  <div className="p-4 rounded-[16px] bg-white border border-[#e8e8f0] flex items-center justify-between animate-pulse">
  <div className="flex items-center gap-3">
  <Skeleton className="w-10 h-10 rounded-[12px] shrink-0" />
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-28 rounded-md" />
  <Skeleton className="h-3 w-36 rounded-md" />
  </div>
  </div>
  <Skeleton className="w-4 h-4 rounded" />
  </div>
  );
}

/**
 * Skeleton for Notifications List (/notifications)
 */
export function NotificationSkeleton() {
  return (
  <div className="p-4 flex items-start justify-between gap-3.5 bg-white border-b border-slate-100 animate-pulse">
  <div className="flex items-start gap-3 w-full">
  <Skeleton className="w-9 h-9 rounded-lg shrink-0 mt-0.5" />
  <div className="space-y-1.5 flex-1">
  <div className="flex items-center justify-between">
  <Skeleton className="h-4 w-40 rounded-md" />
  <Skeleton className="h-3 w-16 rounded-md" />
  </div>
  <Skeleton className="h-3 w-3/4 rounded-md" />
  </div>
  </div>
  </div>
  );
}

/**
 * Skeleton for Community Solutions on the post page
 */
export function SolutionSkeleton() {
  return (
  <div className="p-3.5 rounded-[14px] bg-[#f7f7fa] border border-[#e8e8f0] space-y-2 animate-pulse">
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
  <Skeleton className="h-4 w-28 rounded-md" />
  <Skeleton className="h-3.5 w-16 rounded-full" />
  </div>
  <Skeleton className="h-3 w-16 rounded-md" />
  </div>
  <Skeleton className="h-3.5 w-full rounded-md" />
  <Skeleton className="h-3.5 w-4/5 rounded-md" />
  <div className="flex items-center gap-2 pt-1">
  <Skeleton className="h-6 w-20 rounded-lg" />
  <Skeleton className="h-6 w-20 rounded-lg" />
  </div>
  </div>
  );
}

/**
 * Skeleton for Metric / Stat Summary Cards
 */
export function StatCardSkeleton() {
  return (
  <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 animate-pulse">
  <Skeleton className="h-3 w-20 rounded" />
  <Skeleton className="h-6 w-14 rounded" />
  </div>
  );
}

/**
 * Skeleton for Map Sidebar Directory Items (/map)
 */
export function MapItemSkeleton() {
  return (
  <div className="p-3 rounded-[16px] border border-[#e8e8f0] bg-white space-y-2 animate-pulse">
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
  <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
  <Skeleton className="h-3.5 w-32 rounded" />
  </div>
  <Skeleton className="h-3 w-12 rounded" />
  </div>
  <Skeleton className="h-3 w-48 rounded ml-4" />
  <div className="flex items-center justify-between ml-4 pt-1">
  <Skeleton className="h-2.5 w-20 rounded" />
  <Skeleton className="h-2.5 w-16 rounded" />
  </div>
  </div>
  );
}

/**
 * Skeleton for Resource Guide Cards (/resources)
 */
export function ResourceCardSkeleton() {
  return (
  <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 animate-pulse">
  <div className="flex items-center justify-between">
  <Skeleton className="h-5 w-24 rounded-full" />
  <Skeleton className="h-3 w-16 rounded" />
  </div>
  <Skeleton className="h-4 w-4/5 rounded" />
  <Skeleton className="h-3.5 w-full rounded" />
  <Skeleton className="h-3.5 w-3/4 rounded" />
  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
  <Skeleton className="h-3 w-28 rounded" />
  <Skeleton className="h-7 w-24 rounded-lg" />
  </div>
  </div>
  );
}

/**
 * Universal Page Shell Skeleton for page transitions and Suspense fallbacks
 */
export function PageShellSkeleton() {
  return (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
  <div className="space-y-2">
  <Skeleton className="h-3.5 w-24 rounded" />
  <Skeleton className="h-7 w-56 rounded" />
  <Skeleton className="h-3.5 w-72 sm:w-96 rounded" />
  </div>
  <Skeleton className="h-9 w-36 rounded-lg" />
  </div>

  {/* Metrics Row */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {[1, 2, 3, 4].map((i) => (
  <StatCardSkeleton key={i} />
  ))}
  </div>

  {/* Content Cards */}
  <div className="space-y-3">
  {[1, 2, 3].map((i) => (
  <PostCardSkeleton key={i} />
  ))}
  </div>
  </div>
  );
}

export function ReportCardSkeleton() {
  return <PostCardSkeleton />;
}
