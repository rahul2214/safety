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

  const isDev = process.env.NODE_ENV === 'development';
  const defaultApiOrigin = isDev
    ? 'http://localhost:5000'
    : 'https://safecircle-api-752721321209.asia-south1.run.app';
  const apiOrigin = process.env.NEXT_PUBLIC_API_URL || defaultApiOrigin;
  const apiSocketOrigin = apiOrigin.replace(/^http/, 'ws');

  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' ${apiOrigin} ${apiSocketOrigin} https://safecircle-api-752721321209.asia-south1.run.app wss://safecircle-api-752721321209.asia-south1.run.app https://nominatim.openstreetmap.org https://*.tile.openstreetmap.org;
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
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self), payment=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|manifest\\.json|apple-touch-icon|.*\\.(?:ico|png|svg|jpg|jpeg|webp)).*)'],
};
