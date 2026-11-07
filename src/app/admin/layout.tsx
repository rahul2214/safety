import type { Metadata } from 'next';
import { AuthProvider } from '@/portals/admin/lib/auth-context';

// Server layout so private portal pages can opt out of indexing.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
