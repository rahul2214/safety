'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, BatteryLow, CheckCircle2, Clock, Navigation, Phone, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/** Mirrors PublicLocationShareDto (GET /api/share-links/{token}). */
interface SharedLocation {
  status: 'ACTIVE' | 'ENDED' | 'EXPIRED';
  senderName: string;
  startedAt: string;
  expiresAt: string;
  untilStopped: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  lastFixAt: string | null;
  locationState: 'OK' | 'UNAVAILABLE' | 'PAUSED';
  battery: number | null;
  sosAt: string | null;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: SharedLocation }
  | { kind: 'not-found' }
  | { kind: 'error' };

/** The phone sends about every 30 s when moving; checking every 15 s keeps the pin fresh. */
const POLL_MS = 15_000;
/** Older than this, the position is shown as stale. */
const STALE_MS = 5 * 60_000;

const PIN_HTML = `
  <div style="position:relative;width:28px;height:28px;transform:translate(-50%,-100%);">
    <div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:#2563eb;border:3px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.3);"></div>
  </div>`;

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function ago(iso: string, now: number): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h} h ago`;
}

function remaining(iso: string, now: number): string {
  const ms = Math.max(0, new Date(iso).getTime() - now);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h} h ${m} min left` : `${m} min left`;
}

export function ShareLocationClient({ token }: { token: string }) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [now, setNow] = useState(() => Date.now());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const centredRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/proxy/api/share-links/${encodeURIComponent(token)}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) return setState({ kind: 'not-found' });
      if (!res.ok) return setState((prev) => (prev.kind === 'ready' ? prev : { kind: 'error' }));
      const body = (await res.json()) as { data?: SharedLocation | null };
      if (!body.data) return setState({ kind: 'not-found' });
      setState({ kind: 'ready', data: body.data });
    } catch {
      setState((prev) => (prev.kind === 'ready' ? prev : { kind: 'error' }));
    }
  }, [token]);

  const data = state.kind === 'ready' ? state.data : null;
  const active = !data || data.status === 'ACTIVE';

  useEffect(() => {
    void load();
  }, [load]);

  // Keep checking while sharing is on; slower when the tab is in the background.
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      timer = setTimeout(async () => {
        await load();
        tick();
      }, document.hidden ? POLL_MS * 4 : POLL_MS);
    };
    tick();
    const clock = setInterval(() => setNow(Date.now()), 10_000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, [active, load]);

  const hasPosition = data?.status === 'ACTIVE' && data.latitude != null && data.longitude != null;

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
        circleRef.current = L.circle([lat, lng], { radius, color: '#2563eb', weight: 1, fillOpacity: 0.1 }).addTo(mapRef.current);
      }

      // Centre once; after that only the pin moves, so panning is not undone every 15 s.
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

  const stale = !!data?.lastFixAt && now - new Date(data.lastFixAt).getTime() > STALE_MS;
  const name = data?.senderName ?? 'Someone';

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-6">
      {data?.sosAt && data.status === 'ACTIVE' && (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-600 p-4 text-white">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div>
            <p className="font-extrabold">{name} raised an SOS at {timeOf(data.sosAt)}</p>
            <p className="text-sm text-white/90">Call them now. If you cannot reach them, call 112 and give this location.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {state.kind === 'loading' ? (
          <p className="text-sm text-slate-500">Loading live location…</p>
        ) : state.kind === 'not-found' ? (
          <>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">This link is not valid</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Check that the whole link from the message was opened.</p>
          </>
        ) : data && data.status !== 'ACTIVE' ? (
          <>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-slate-500" aria-hidden />
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">This location sharing session has ended</h1>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {name}&apos;s location is no longer shared with you{data.status === 'EXPIRED' ? ' because the time they chose ran out' : ''}.
            </p>
          </>
        ) : data ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{name} is sharing their live location with you</h1>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
              <Clock className="h-4 w-4" aria-hidden />
              {data.untilStopped
                ? 'Until they stop sharing'
                : `${remaining(data.expiresAt, now)} · ends ${timeOf(data.expiresAt)}`}
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between gap-3 text-sm text-amber-800">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden /> Could not load the location. Retrying…
            </span>
            <button type="button" onClick={() => void load()} className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 font-semibold">
              <RefreshCw className="h-4 w-4" aria-hidden /> Retry
            </button>
          </div>
        )}
      </div>

      {data?.status === 'ACTIVE' && data.locationState !== 'OK' && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {data.locationState === 'PAUSED'
            ? `${name}'s phone restarted, so updates are paused until they open Sabhijude again.`
            : `${name}'s location is unavailable (location may be turned off on their phone).`}
          {data.lastFixAt ? ` Last known position from ${ago(data.lastFixAt, now)} is shown below.` : ''}
        </div>
      )}

      {data?.status === 'ACTIVE' && !hasPosition && data.locationState === 'OK' && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Waiting for {name}&apos;s first position. This page updates by itself.
        </div>
      )}

      {hasPosition && data && (
        <>
          <div
            ref={containerRef}
            className="h-[55vh] min-h-[320px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
            aria-label={`Map showing ${name}'s location`}
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
            <span className={stale ? 'font-semibold text-amber-700' : ''}>
              Updated {data.lastFixAt ? ago(data.lastFixAt, now) : 'recently'}
              {stale ? ' (their phone may be offline)' : ''}
            </span>
            {data.accuracy ? <span>Accurate to about {Math.round(data.accuracy)} m</span> : null}
            {data.battery != null && data.battery <= 20 ? (
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <BatteryLow className="h-4 w-4" aria-hidden /> Phone battery {data.battery}%
              </span>
            ) : null}
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white"
          >
            <Navigation className="h-4 w-4" aria-hidden /> Get directions
          </a>
        </>
      )}

      <a
        href="tel:112"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
      >
        <Phone className="h-4 w-4" aria-hidden /> Emergency? Call 112
      </a>

      <p className="text-center text-xs text-slate-500">
        Shared through Sabhijude. This private link works only while {name} is sharing.
      </p>
    </main>
  );
}
