'use client';

import { AuthProvider } from '@/portals/org/lib/auth-context';

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
