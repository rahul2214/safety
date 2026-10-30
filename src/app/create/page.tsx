'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/report');
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-slate-500">
      Redirecting to secure safety report wizard...
    </div>
  );
}
