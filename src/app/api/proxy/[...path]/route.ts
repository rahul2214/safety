import { NextRequest, NextResponse } from 'next/server';

/**
 * Sabhijude BFF (Backend-for-Frontend) Proxy
 *
 * Strictly forwards client requests to the ASP.NET Core backend API.
 * The frontend never directly connects to the database or stores database credentials.
 * All data access, business logic, authorization, and validation are handled
 * exclusively by Sabhijude.Api.
 */

const BACKEND_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000';

interface ProxyCacheItem {
  status: number;
  data: any;
  isJson: boolean;
  contentType: string;
  timestamp: number;
  ttlMs: number;
}

const proxyCache = new Map<string, ProxyCacheItem>();

// Determine if endpoint is safe and beneficial to cache in BFF proxy
function getProxyCacheTtl(cleanSubpath: string): number {
  const p = cleanSubpath.toLowerCase();
  if (
    p.includes('api/categories') ||
    p.includes('api/postseverities') ||
    p.includes('api/poststatuses') ||
    p.includes('api/postvisibilities') ||
    p.includes('api/genders') ||
    p.includes('api/occupationstatuses') ||
    p.includes('api/relationships')
  ) {
    return 5 * 60 * 1000; // 5 minutes
  }
  if (p.includes('api/hashtags')) {
    return 2 * 60 * 1000; // 2 minutes
  }
  return 0; // Not cached in BFF
}

function invalidateProxyCache(subpath: string) {
  const p = subpath.toLowerCase();
  for (const key of proxyCache.keys()) {
    if (key.toLowerCase().includes(p)) {
      proxyCache.delete(key);
    }
  }
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const subpath = path.join('/');
  // Normalize subpath so target always has /api/ prefix
  const cleanSubpath = subpath.startsWith('api/') ? subpath : `api/${subpath}`;
  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/${cleanSubpath}${search}`;

  const method = request.method;
  const headers = new Headers();

  // Forward authorization, content-type, and accept headers
  const authHeader = request.headers.get('authorization');
  if (authHeader) headers.set('authorization', authHeader);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);

  // Strip any client-supplied identity assertions (X-User-Id) to prevent spoofing.
  // Identity is strictly established via the cryptographically verified Authorization JWT.

  // ─── Proxy Cache HIT Check for GET requests ────────────────────────
  const ttlMs = method === 'GET' ? getProxyCacheTtl(cleanSubpath) : 0;
  const cacheKey = `${cleanSubpath}${search}`;

  if (method === 'GET' && ttlMs > 0 && !authHeader) {
    const cached = proxyCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp <= cached.ttlMs) {
      if (cached.isJson) {
        return NextResponse.json(cached.data, {
          status: cached.status,
          headers: {
            'X-Proxy-Cache': 'HIT',
            'Cache-Control': `public, max-age=${Math.round(cached.ttlMs / 1000)}, stale-while-revalidate=60`,
          },
        });
      } else {
        return new NextResponse(cached.data, {
          status: cached.status,
          headers: {
            'content-type': cached.contentType,
            'X-Proxy-Cache': 'HIT',
            'Cache-Control': `public, max-age=${Math.round(cached.ttlMs / 1000)}, stale-while-revalidate=60`,
          },
        });
      }
    }
  }

  let rawBody: string | null = null;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      rawBody = await request.text();
    } catch {
      // Body reading exception
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? rawBody : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentTypeHeader = backendRes.headers.get('content-type') || '';
    const isJson = contentTypeHeader.includes('application/json');

    if (backendRes.ok) {
      if (method === 'GET' && ttlMs > 0 && !authHeader) {
        // Cache successful response
        if (isJson) {
          const data = await backendRes.json().catch(() => ({}));
          proxyCache.set(cacheKey, {
            status: backendRes.status,
            data,
            isJson: true,
            contentType: contentTypeHeader,
            timestamp: Date.now(),
            ttlMs,
          });
          return NextResponse.json(data, {
            status: backendRes.status,
            headers: {
              'X-Proxy-Cache': 'MISS',
              'Cache-Control': `public, max-age=${Math.round(ttlMs / 1000)}, stale-while-revalidate=60`,
            },
          });
        } else {
          const text = await backendRes.text();
          proxyCache.set(cacheKey, {
            status: backendRes.status,
            data: text,
            isJson: false,
            contentType: contentTypeHeader,
            timestamp: Date.now(),
            ttlMs,
          });
          return new NextResponse(text, {
            status: backendRes.status,
            headers: {
              'content-type': contentTypeHeader,
              'X-Proxy-Cache': 'MISS',
              'Cache-Control': `public, max-age=${Math.round(ttlMs / 1000)}, stale-while-revalidate=60`,
            },
          });
        }
      }

      // If mutation succeeded, invalidate related proxy cache
      if (method !== 'GET' && method !== 'HEAD') {
        invalidateProxyCache(cleanSubpath);
      }
    }

    if (isJson) {
      const data = await backendRes.json().catch(() => ({}));
      return NextResponse.json(data, { status: backendRes.status });
    } else {
      const text = await backendRes.text();
      return new NextResponse(text, {
        status: backendRes.status,
        headers: { 'content-type': contentTypeHeader },
      });
    }
  } catch (err: any) {
    console.error(`BFF Proxy failed to reach backend API at ${targetUrl}:`, err?.message || err);
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

export async function HEAD(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}
