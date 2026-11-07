'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

/**
 * Loads Google Analytics only when a real measurement ID is configured and only on
 * public routes (SEC-33). Sensitive/private areas never load or report to GA.
 */
const GA_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim();
const IS_VALID_GA_ID = /^G-[A-Z0-9]{4,20}$/i.test(GA_ID);

const EXCLUDED_PREFIXES = [
  '/admin',
  '/org',
  '/emergency',
  '/contacts',
  '/profile',
  '/settings',
  '/report',
  '/create',
  '/notifications',
  '/my-posts',
  '/myposts',
];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function GoogleAnalytics() {
  const pathname = usePathname() || '/';
  const excluded = isExcluded(pathname);
  // Once loaded on a public page, the script persists across client navigations,
  // so keep rendering it but toggle GA's official opt-out flag per route.
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!IS_VALID_GA_ID) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = excluded;
    if (!excluded && !hasLoaded) setHasLoaded(true);
  }, [excluded, hasLoaded]);

  if (!IS_VALID_GA_ID) return null;
  if (excluded && !hasLoaded) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
