'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Navigation, Phone, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/** Mirrors PublicSosLiveDto (GET /api/sos/live/{token}). */
interface LiveSos {
  status: 'ACTIVE' | 'ENDED' | 'EXPIRED';
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  startedAt: string;
  updatedAt: string;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: LiveSos }
  | { kind: 'not-found' }
  | { kind: 'error' };

/** How often the page asks for a newer position. The phone reports about every 10 seconds. */
const POLL_MS = 10_000;

const PIN_HTML = `
  <div style="position:relative;width:30px;height:30px;transform:translate(-50%,-100%);">
    <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:#e11d48;border:3px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.35);"></div>
  </div>`;

function timeAgo(iso: string, now: number): string {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 15) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}

export function LiveLocationClient({ token }: { token: string }) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [now, setNow] = useState(() => Date.now());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  // The first position centres the map; later ones only move the pin, so someone who has
  // panned or zoomed is not yanked back every ten seconds.
  const centredRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/proxy/api/sos/live/${encodeURIComponent(token)}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) return setState({ kind: 'not-found' });
      if (!res.ok) return setState((prev) => (prev.kind === 'ready' ? prev : { kind: 'error' }));
      const body = (await res.json()) as { data?: LiveSos | null };
      if (!body.data) return setState({ kind: 'not-found' });
      setState({ kind: 'ready', data: body.data });
    } catch {
      // Keep showing the last position through a network blip.
      setState((prev) => (prev.kind === 'ready' ? prev : { kind: 'error' }));
    }
  }, [token]);

  // Poll while the SOS is active; stop once it has ended.
  const active = state.kind === 'loading' || (state.kind === 'ready' && state.data.status === 'ACTIVE') || state.kind === 'error';
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (!active) return;
    const poll = setInterval(() => void load(), POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 5_000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [active, load]);

  const data = state.kind === 'ready' ? state.data : null;
  const hasPosition = data?.status === 'ACTIVE' && data.latitude != null && data.longitude != null;

  // Map: created once there is a position, then the pin follows it.
  useEffect(() => {
    if (!hasPosition || !data || !containerRef.current) return;
    const lat = data.latitude as number;
    const lng = data.longitude as number;
    let cancelled = false;

    (async () => {
      if (!leafletRef.current) leafletRef.current = (await import('leaflet')).default;
      const L = leafletRef.current;
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, { center: [lat, lng], zoom: 16, zoomControl: true });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);
        setTimeout(() => mapRef.current?.invalidateSize(), 250);
      }

      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else
        markerRef.current = L.marker([lat, lng], {
          icon: L.divIcon({ html: PIN_HTML, className: '', iconSize: [0, 0] }),
          keyboard: false,
        }).addTo(mapRef.current);

      const radius = data.accuracy && data.accuracy > 0 ? Math.min(data.accuracy, 2_000) : 0;
      if (circleRef.current) {
        circleRef.current.setLatLng([lat, lng]);
        circleRef.current.setRadius(radius);
      } else if (radius > 0) {
        circleRef.current = L.circle([lat, lng], {
          radius,
          color: '#e11d48',
          weight: 1,
          fillOpacity: 0.12,
        }).addTo(mapRef.current);
      }

      if (!centredRef.current) {
        mapRef.current.setView([lat, lng], 16);
        centredRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasPosition, data]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    []
  );

  const mapsUrl = hasPosition && data ? `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}` : null;
  const directionsUrl =
    hasPosition && data ? `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}` : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-6">
      {/* Header */}
      <div
        className={`rounded-2xl p-4 text-white ${
          data && data.status !== 'ACTIVE' ? 'bg-slate-700' : 'bg-rose-600'
        }`}
      >
        <div className="flex items-center gap-2">
          {data && data.status !== 'ACTIVE' ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          ) : (
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
            </span>
          )}
          <h1 className="text-lg font-extrabold tracking-tight">
            {data?.status === 'ENDED'
              ? 'This SOS has ended'
              : data?.status === 'EXPIRED'
              ? 'This live location has expired'
              : 'SOS: live location'}
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/90">
          {data?.status === 'ENDED'
            ? 'They stopped the SOS, so their location is no longer shared. Call them to check in.'
            : data?.status === 'EXPIRED'
            ? 'No update has arrived for a long time. Call them, and call 112 if you cannot reach them.'
            : 'Someone in your trusted circle needs help. Their position updates on this page every few seconds.'}
        </p>
      </div>

      {state.kind === 'loading' && (
        <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          Loading live location…
        </div>
      )}

      {state.kind === 'not-found' && (
        <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          This link is not valid. Check that the whole link from the message was opened.
        </div>
      )}

      {state.kind === 'error' && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Could not load the location. Retrying…
          </span>
          <button
            type="button"
            onClick={() => void load()}
            className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 font-semibold"
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Retry
          </button>
        </div>
      )}

      {data?.status === 'ACTIVE' && !hasPosition && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Their phone has not shared a GPS position yet. Call them now; this page will update when it
          arrives.
        </div>
      )}

      {hasPosition && data && (
        <>
          <div
            ref={containerRef}
            className="h-[55vh] min-h-[320px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
            aria-label="Map showing their live location"
          />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Updated <strong>{timeAgo(data.updatedAt, now)}</strong>
            {data.accuracy ? <> · accurate to about {Math.round(data.accuracy)} m</> : null}
            <span className="block text-xs text-slate-500">
              {(data.latitude as number).toFixed(5)}, {(data.longitude as number).toFixed(5)}
            </span>
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <a
              href={directionsUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white"
            >
              <Navigation className="h-4 w-4" aria-hidden /> Get directions
            </a>
            <a
              href={mapsUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
            >
              Open in Google Maps
            </a>
          </div>
        </>
      )}

      <a
        href="tel:112"
        className="flex items-center justify-center gap-2 rounded-xl border border-rose-300 px-4 py-3 font-bold text-rose-700 dark:border-rose-800 dark:text-rose-300"
      >
        <Phone className="h-4 w-4" aria-hidden /> Call police / emergency (112)
      </a>

      <p className="text-center text-xs text-slate-500">
        Shared through Sabhijude. Only people with this link can see this page.
      </p>
    </main>
  );
}
