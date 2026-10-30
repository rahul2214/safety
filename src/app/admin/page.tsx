'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/portals/admin/lib/auth-context';

export default function RootPage() {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [admin, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] text-[#5b5b6e] text-xs">
      Loading Sabhijude Admin...
    </div>
  );
}
