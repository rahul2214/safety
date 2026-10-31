import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a8a',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sabhijude.com')
  ),
  title: {
    default: 'Sabhijude — Personal & Community Safety Platform',
    template: '%s | Sabhijude',
  },
  description:
    'Sabhijude is a comprehensive personal and community safety platform. Rapid emergency SOS, live GPS location sharing, discreet exit tools, verified incident reporting, and campus security desks.',
  keywords: [
    'personal safety app',
    'emergency SOS app',
    'community safety platform',
    'live location sharing',
    'fake call app',
    'workplace safety',
    'POSH Act compliance',
    'campus safety management',
    'neighborhood safety alerts',
  ],
  authors: [{ name: 'Sabhijude Safety Team', url: 'https://sabhijude.com' }],
  creator: 'Sabhijude',
  publisher: 'Sabhijude',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sabhijude.com',
    siteName: 'Sabhijude',
    title: 'Sabhijude — Personal & Community Safety Platform',
    description:
      'Personal safety made fast, accessible, and community-powered. Rapid SOS dispatch, live location sharing, discreet fake call exits, and campus security integrations.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Sabhijude Personal & Community Safety Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabhijude — Personal & Community Safety Platform',
    description:
      'Personal safety made fast, accessible, and community-powered. Rapid SOS dispatch, live location sharing, discreet fake call exits, and campus security integrations.',
    images: ['/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
