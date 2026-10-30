'use client';

import Sidebar from '@/portals/org/components/Sidebar';
import Header from '@/portals/org/components/Header';
import { useAdminAuth } from '@/portals/org/lib/auth-context';
import { OrgProvider, useOrg } from '@/portals/org/lib/org-context';

function OrgGate({ children }: { children: React.ReactNode }) {
  const { organization, loading, error } = useOrg();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] text-[#5b5b6e] text-xs">
        Loading organization profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] px-6">
        <div className="max-w-md text-center">
          <h2 className="text-sm font-bold text-[#16161d]">Could not load organization</h2>
          <p className="mt-2 text-xs text-[#5b5b6e]">{error}</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] px-6">
        <div className="max-w-md text-center">
          <h2 className="text-sm font-bold text-[#16161d]">No organization assigned</h2>
          <p className="mt-2 text-xs text-[#5b5b6e]">
            This account is not linked to any active campus or organization yet.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] text-[#5b5b6e] text-xs">
        Authenticating session...
      </div>
    );
  }

  return (
    <OrgProvider>
      <div className="flex min-h-screen bg-[#f7f7fa] text-[#16161d]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            <OrgGate>{children}</OrgGate>
          </main>
        </div>
      </div>
    </OrgProvider>
  );
}
