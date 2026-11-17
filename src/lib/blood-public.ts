// Server-side only: imported by the /blood/[uuid] server component, never by client code.
import { cache } from 'react';

/**
 * One blood request as anyone with its link sees it (GET /api/bloodrequests/{uuid}).
 * Mirrors PublicBloodRequestDto. Phone, note and pin are null once the request is closed.
 */
export interface PublicBloodRequest {
  uuid: string;
  bloodGroup: string;
  unitsNeeded: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  contactPhone: string | null;
  note: string | null;
  status: 'OPEN' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
}

const API_BASE =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://safecircle-api-752721321209.asia-south1.run.app'
    : 'http://127.0.0.1:5000');

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Loads a shared request on the server, so the page and its WhatsApp preview carry the real
 * details. Returns 'not-found' for a bad or unknown link and 'error' when the API is down.
 * Wrapped in cache() so metadata and page share one request.
 */
export const getPublicBloodRequest = cache(
  async (uuid: string): Promise<PublicBloodRequest | 'not-found' | 'error'> => {
    if (!UUID_REGEX.test(uuid)) return 'not-found';
    try {
      const res = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/bloodrequests/${uuid}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) return 'not-found';
      if (!res.ok) return 'error';
      const body = (await res.json()) as { data?: PublicBloodRequest | null };
      return body.data ?? 'not-found';
    } catch {
      return 'error';
    }
  }
);
