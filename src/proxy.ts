import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Server-Side Route Guards (SEC-08) ───────────────────────────────────
  const isAdminPortal = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isAdminPortal && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle aliases for organization enrollment
  if (pathname === '/org/request' || pathname === '/org/request-access') {
    return NextResponse.redirect(new URL('/organization-request', request.url));
  }

  const isOrgPortal = pathname === '/org' || pathname.startsWith('/org/');
  const publicOrgPaths = ['/org/login', '/org/register'];
  if (isOrgPortal && !publicOrgPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    const orgSession = request.cookies.get('org_session');
    if (!orgSession?.value) {
      const loginUrl = new URL('/org/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── URL Canonicalization ────────────────────────────────────────────────
  if (pathname !== '/' && pathname.endsWith('/')) {
    const cleanUrl = new URL(pathname.slice(0, -1) + request.nextUrl.search, request.url);
    return NextResponse.redirect(cleanUrl, 301);
  }

  const isDev = process.env.NODE_ENV === 'development';
  const defaultApiOrigin = isDev
    ? 'http://localhost:5000'
    : 'https://safecircle-api-752721321209.asia-south1.run.app';
  // API origin comes from env (NEXT_PUBLIC_API_URL); hardcoded value is only a fallback.
  let apiOrigin = defaultApiOrigin;
  try {
    apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL || defaultApiOrigin).origin;
  } catch {
    apiOrigin = defaultApiOrigin;
  }
  const apiSocketOrigin = apiOrigin.replace(/^http/, 'ws');

  // Production: no 'unsafe-eval' and no blanket https: script source (SEC-16).
  // 'unsafe-inline' is still required for Next's inline bootstrap scripts (no nonce in use)
  // and the inline gtag snippet. Dev additionally needs 'unsafe-eval' for React refresh.
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    isDev ? "'unsafe-eval'" : '',
    'https://www.googletagmanager.com',
  ]
    .filter(Boolean)
    .join(' ');

  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' ${apiOrigin} ${apiSocketOrigin} https://nominatim.openstreetmap.org https://*.tile.openstreetmap.org https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self), payment=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  if (!isDev) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|manifest\\.json|robots\\.txt|sitemap\\.xml|apple-touch-icon|.*\\.(?:ico|png|svg|jpg|jpeg|webp)).*)'],
};
