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
    const observer = new MutationObserver(() => removeNetlifyHud());
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
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
