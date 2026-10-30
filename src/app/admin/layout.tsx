'use client';

import { AuthProvider } from '@/portals/admin/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
