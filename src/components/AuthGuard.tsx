'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, LogIn, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/Skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  title = 'Authentication Required',
  description = 'This section contains private emergency circle data, safety alerts, and confidential profile settings. Please log in to access your secure portal.',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Auto-redirect to login with return path
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Loading state with Skeleton layout
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-in fade-in-50 duration-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-[20px]" />
          <Skeleton className="h-28 rounded-[20px]" />
          <Skeleton className="h-28 rounded-[20px]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-36 rounded-[20px]" />
          <Skeleton className="h-36 rounded-[20px]" />
        </div>
      </div>
    );
  }

  // Not authenticated gate
  if (!isAuthenticated) {
    return (
      <div className="relative max-w-md mx-auto py-12 px-4 select-none text-center space-y-6">
        {/* Soft background aura */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#6d4aff]/10 rounded-full blur-3xl z-0" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-[22px] bg-[#f1edff] dark:bg-[#241a4d] border border-[#6d4aff]/20 flex items-center justify-center text-[#6d4aff] dark:text-[#a78bfa] shadow-sm">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-full bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa] text-[11px] font-bold uppercase tracking-wider">
              Private Safety Area
            </span>
            <h2 className="text-[22px] font-black text-[#16161d] dark:text-[#f4f4f8] tracking-tight">
              {title}
            </h2>
            <p className="text-[13px] text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed max-w-sm">
              {description}
            </p>
          </div>

          <div className="pt-2 w-full space-y-2.5">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full h-11 rounded-[14px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              <span>Log in to Sabhijude</span>
            </Link>

            <Link
              href={`/signup?redirect=${encodeURIComponent(pathname)}`}
              className="w-full h-11 rounded-[14px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] hover:bg-[#f7f7fa] dark:hover:bg-[#1d1d2c] text-[#16161d] dark:text-[#f4f4f8] font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
            >
              <UserPlus className="h-4 w-4 text-[#6d4aff]" />
              <span>Create Free Account</span>
            </Link>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Safety Feed</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Render protected page content
  return <>{children}</>;
}
