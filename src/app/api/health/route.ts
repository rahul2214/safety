import { NextResponse } from 'next/server';

/**
 * GET /api/health — is the backend reachable from this website? Used by the connection
 * banner to notice when the server is back. Answers quickly and is never cached.
 */

const BACKEND_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://safecircle-api-752721321209.asia-south1.run.app'
    : 'http://127.0.0.1:5000');

export const dynamic = 'force-dynamic';

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4_000);
  try {
    const res = await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/health/live`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    return NextResponse.json({ backend: res.ok ? 'up' : 'down' }, {
      status: res.ok ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ backend: 'down' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  } finally {
    clearTimeout(timer);
  }
}
