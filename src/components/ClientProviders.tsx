'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { SosModal } from '@/components/SosModal';
import { FakeCallModal } from '@/components/FakeCallModal';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [sosOpen, setSosOpen] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const pathname = usePathname();

  const isPortalRoute =
    pathname === '/admin' ||
    pathname?.startsWith('/admin/') ||
    pathname === '/org' ||
    pathname?.startsWith('/org/');

  useEffect(() => {
    const removeNetlifyHud = () => {
      const frame = document.getElementById('nl-badge-frame');
      if (frame) frame.remove();
      document.querySelectorAll('iframe[title*="Netlify" i]').forEach((el) => el.remove());
    };
    removeNetlifyHud();

    // Prevent AbortError or background network retry errors from polluting DevTools console
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.name === 'AbortError' ||
        event.reason?.message?.includes?.('aborted') ||
        event.reason?.message?.includes?.('Failed to fetch')
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  if (isPortalRoute) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <AppShell>{children}</AppShell>

        {/* Global Modals for Fast Emergency Access */}
        <SosModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
        <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      </ToastProvider>
    </AuthProvider>
  );
}
