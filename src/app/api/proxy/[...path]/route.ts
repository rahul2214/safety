import { NextRequest, NextResponse } from 'next/server';

/**
 * Sabhijude BFF (Backend-for-Frontend) Proxy
 *
 * Strictly forwards client requests to the ASP.NET Core backend API.
 * The frontend never directly connects to the database or stores database credentials.
 * All data access, business logic, authorization, and validation are handled
 * exclusively by Sabhijude.Api.
 */

const DEFAULT_PROD_URL = 'https://safecircle-api-752721321209.asia-south1.run.app';

const BACKEND_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_URL : 'http://127.0.0.1:5000');

const BACKEND_ORIGIN = new URL(BACKEND_URL).origin;

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
const MAX_BODY_BYTES = 1024 * 1024; // 1 MB
const MAX_CACHE_ENTRIES = 200;
const PUBLIC_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Exact allow-list of public, user-independent reference endpoints that may be
 * cached in the BFF. Matched against the full lower-cased pathname only.
 */
const PUBLIC_CACHEABLE_PATHS = new Set([
  '/api/categories',
  '/api/postseverities',
  '/api/poststatuses',
  '/api/postvisibilities',
  '/api/genders',
  '/api/occupationstatuses',
  '/api/relationships',
]);

interface ProxyCacheItem {
  status: number;
  body: ArrayBuffer;
  contentType: string;
  timestamp: number;
  ttlMs: number;
}

// Map preserves insertion order -> oldest entries are first (simple bounded LRU).
const proxyCache = new Map<string, ProxyCacheItem>();

function cacheGet(key: string): ProxyCacheItem | undefined {
  const item = proxyCache.get(key);
  if (!item) return undefined;
  if (Date.now() - item.timestamp > item.ttlMs) {
    proxyCache.delete(key);
    return undefined;
  }
  // refresh recency
  proxyCache.delete(key);
  proxyCache.set(key, item);
  return item;
}

function cacheSet(key: string, item: ProxyCacheItem) {
  proxyCache.delete(key);
  proxyCache.set(key, item);
  while (proxyCache.size > MAX_CACHE_ENTRIES) {
    const oldest = proxyCache.keys().next().value;
    if (oldest === undefined) break;
    proxyCache.delete(oldest);
  }
}

function invalidateProxyCache(pathname: string) {
  const p = pathname.toLowerCase();
  for (const key of proxyCache.keys()) {
    if (key.toLowerCase().startsWith(p)) {
      proxyCache.delete(key);
    }
  }
}

function badRequest(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: { code: 'BAD_REQUEST', message } },
    { status }
  );
}

/** Reject traversal / smuggling attempts in any path segment. */
function isSafeSegment(segment: string): boolean {
  let decoded = segment;
  // Decode repeatedly (bounded) to catch double-encoding.
  for (let i = 0; i < 3; i++) {
    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return false;
    }
    if (next === decoded) break;
    decoded = next;
  }
  const lowerRaw = segment.toLowerCase();
  const lowerDecoded = decoded.toLowerCase();
  if (lowerRaw.includes('%2f') || lowerRaw.includes('%5c')) return false;
  if (lowerDecoded.includes('%2f') || lowerDecoded.includes('%5c')) return false;
  if (decoded.includes('..') || decoded.includes('\\') || decoded.includes('/')) return false;
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(decoded)) return false;
  return true;
}

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() || null;
}

function cacheHeaders(contentType: string, ttlMs: number, state: 'HIT' | 'MISS') {
  const h: Record<string, string> = {
    'X-Proxy-Cache': state,
    'Cache-Control': `public, max-age=${Math.round(ttlMs / 1000)}, stale-while-revalidate=60`,
  };
  if (contentType) h['content-type'] = contentType;
  return h;
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const method = request.method.toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    return badRequest('Method not allowed', 405);
  }

  const { path } = await context.params;
  if (!Array.isArray(path) || path.length === 0 || !path.every(isSafeSegment)) {
    return badRequest('Invalid path');
  }

  const subpath = path.map((seg) => encodeURIComponent(safeDecode(seg))).join('/');
  // Normalize subpath so target always has /api/ prefix
  const cleanSubpath = path[0]?.toLowerCase() === 'api' ? subpath : `api/${subpath}`;
  const search = request.nextUrl.search;

  let target: URL;
  try {
    target = new URL(`/${cleanSubpath}${search}`, BACKEND_ORIGIN);
  } catch {
    return badRequest('Invalid path');
  }
  if (target.origin !== BACKEND_ORIGIN || !target.pathname.startsWith('/api/')) {
    return badRequest('Invalid path');
  }
  const targetUrl = target.toString();

  const headers = new Headers();

  // Forward authorization, content-type, and accept headers
  const authHeader = request.headers.get('authorization');
  if (authHeader) headers.set('authorization', authHeader);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);

  // SOS retries reuse one key so the API never records the same emergency twice.
  const idempotencyKey = request.headers.get('idempotency-key');
  if (idempotencyKey && /^[A-Za-z0-9-]{8,64}$/.test(idempotencyKey)) {
    headers.set('idempotency-key', idempotencyKey);
  }

  // Forward the client IP so backend rate limiting applies per end user.
  const clientIp = getClientIp(request);
  const incomingXff = request.headers.get('x-forwarded-for');
  if (incomingXff) {
    headers.set('x-forwarded-for', incomingXff);
  } else if (clientIp) {
    headers.set('x-forwarded-for', clientIp);
  }
  if (clientIp) headers.set('x-real-ip', clientIp);

  // Strip any client-supplied identity assertions (X-User-Id) to prevent spoofing.
  // Identity is strictly established via the cryptographically verified Authorization JWT.

  // ─── Proxy Cache (exact allow-list, anonymous GET only) ────────────
  const isCacheable =
    method === 'GET' && !authHeader && PUBLIC_CACHEABLE_PATHS.has(target.pathname.toLowerCase());
  const ttlMs = isCacheable ? PUBLIC_CACHE_TTL_MS : 0;
  const cacheKey = `${target.pathname.toLowerCase()}${target.search}`;

  if (isCacheable) {
    const cached = cacheGet(cacheKey);
    if (cached) {
      return new NextResponse(cached.body.slice(0), {
        status: cached.status,
        headers: cacheHeaders(cached.contentType, cached.ttlMs, 'HIT'),
      });
    }
  }

  let rawBody: ArrayBuffer | undefined;
  if (method !== 'GET') {
    const declaredLength = Number(request.headers.get('content-length') || '0');
    if (declaredLength > MAX_BODY_BYTES) {
      return badRequest('Request body too large', 413);
    }
    try {
      rawBody = await request.arrayBuffer();
    } catch {
      rawBody = undefined;
    }
    if (rawBody && rawBody.byteLength > MAX_BODY_BYTES) {
      return badRequest('Request body too large', 413);
    }
    if (rawBody && rawBody.byteLength === 0) rawBody = undefined;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body: rawBody,
      signal: controller.signal,
      redirect: 'manual',
    });
    clearTimeout(timeoutId);

    const contentTypeHeader = backendRes.headers.get('content-type') || '';
    const isJson = contentTypeHeader.includes('application/json');

    if (backendRes.ok) {
      if (isCacheable) {
        const body = await backendRes.arrayBuffer();
        cacheSet(cacheKey, {
          status: backendRes.status,
          body,
          contentType: contentTypeHeader,
          timestamp: Date.now(),
          ttlMs,
        });
        return new NextResponse(body.slice(0), {
          status: backendRes.status,
          headers: cacheHeaders(contentTypeHeader, ttlMs, 'MISS'),
        });
      }

      // If mutation succeeded, invalidate related proxy cache
      if (method !== 'GET') {
        invalidateProxyCache(target.pathname);
      }
    }

    if (isJson) {
      const data = await backendRes.json().catch(() => ({}));
      return NextResponse.json(data, { status: backendRes.status });
    } else {
      const body = await backendRes.arrayBuffer();
      return new NextResponse(body.byteLength > 0 ? body : null, {
        status: backendRes.status,
        headers: contentTypeHeader ? { 'content-type': contentTypeHeader } : undefined,
      });
    }
  } catch (err: any) {
    console.error(`BFF Proxy failed to reach backend API at ${target.pathname}:`, err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Unable to reach the backend API server. Please verify the backend service is running.',
        },
      },
      { status: 502 }
    );
  }
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}
