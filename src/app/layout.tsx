'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { SosModal } from '@/components/SosModal';
import { FakeCallModal } from '@/components/FakeCallModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const pathname = usePathname();
  const isPortalRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/org');

  return (
    <html lang="en">
      <head>
        <title>Sabhijude — Personal Safety Platform</title>
        <meta
          name="description"
          content="Production-quality personal safety platform. Incident reporting, case management, trusted contacts, emergency SOS, and verified community defense."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {isPortalRoute ? (
          children
        ) : (
          <AuthProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>

              {/* Global Modals for Fast Emergency Access */}
              <SosModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
              <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
            </ToastProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
