'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/portals/org/lib/auth-context';

export default function RootPage() {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        router.replace('/org/dashboard');
      } else {
        router.replace('/org/login');
      }
    }
  }, [admin, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-500 text-xs">
      Loading Sabhijude Org Command...
    </div>
  );
}
