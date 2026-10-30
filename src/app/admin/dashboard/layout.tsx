'use client';

import Sidebar from '@/portals/admin/components/Sidebar';
import Header from '@/portals/admin/components/Header';
import { useAdminAuth } from '@/portals/admin/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdminAuth();

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] text-[#5b5b6e] text-xs">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7fa] text-[#16161d]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
