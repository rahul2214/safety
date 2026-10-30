'use client';

import React from 'react';
import { PageShellSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="py-4">
      <PageShellSkeleton />
    </div>
  );
}
