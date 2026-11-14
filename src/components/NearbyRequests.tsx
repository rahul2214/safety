'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Droplet, GraduationCap, MapPin, Navigation, Phone } from 'lucide-react';
import { api, type BackendPost, type BloodRequest } from '@/lib/api-client';
import { coarse, formatDistance } from '@/lib/requests';
import { withCountryCode } from '@/lib/phone';

type Stage = 'checking' | 'ask' | 'locating' | 'ready' | 'unavailable';

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60_000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export const directionsUrl = (latitude: number, longitude: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

/** One open blood request, with the two things a donor needs: call and directions. */
export function BloodRequestCard({ request }: { request: BloodRequest }) {
  const distance = formatDistance(request.distanceKm);
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 px-2 text-sm font-extrabold text-red-600">
          {request.bloodGroup}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">
            Blood needed · {request.unitsNeeded} unit{request.unitsNeeded === 1 ? '' : 's'}
          </p>
          <p className="truncate text-xs font-semibold text-red-600">
            {distance ? `${distance} · ` : ''}
            {relativeTime(request.createdAt)}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-700">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{request.location}</span>
      </p>
      <p className="mt-1 line-clamp-2 min-h-4 text-xs text-slate-500">
        {request.note || `Requested by ${request.requesterName}`}
      </p>

      <div className="mt-3 flex gap-2">
        <a
          href={`tel:${withCountryCode(request.contactPhone)}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
        >
          <Phone className="h-3.5 w-3.5" /> Call
        </a>
        <a
          href={directionsUrl(request.latitude, request.longitude)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-ink transition hover:border-slate-300"
        >
          <Navigation className="h-3.5 w-3.5" /> Directions
        </a>
      </div>
    </div>
  );
}

/**
 * "Near you": open blood requests and ragging reports pinned close to the reader. The two
 * come from separate endpoints, because a blood request is not a post.
 *
 * It never triggers the browser's location prompt by itself. When permission was already
 * granted it loads quietly; otherwise it shows a card the reader can choose to act on.
 */
export function NearbyRequests({ className = '' }: { className?: string }) {
  const [stage, setStage] = useState<Stage>('checking');
  const [blood, setBlood] = useState<BloodRequest[]>([]);
  const [ragging, setRagging] = useState<BackendPost[]>([]);

  const load = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStage('unavailable');
      return;
    }
    setStage('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const at = { lat: coarse(pos.coords.latitude), lng: coarse(pos.coords.longitude) };
        // Independent lookups: one failing must not hide the other.
        const [bloodRes, raggingRes] = await Promise.all([
          api.getNearbyBloodRequests(at).catch(() => null),
          api.getNearbyRequests(at).catch(() => null),
        ]);
        // The API already leaves out the reader's own requests; this keeps that true against an
        // older server too.
        setBlood(bloodRes?.ok && Array.isArray(bloodRes.data) ? bloodRes.data.filter((b) => !b.isMine) : []);
        setRagging(raggingRes?.ok && Array.isArray(raggingRes.data) ? raggingRes.data : []);
        setStage('ready');
      },
      () => setStage('unavailable'),
      // A cached fix up to five minutes old is plenty for a 25 km search.
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await navigator.permissions?.query({ name: 'geolocation' as PermissionName });
        if (cancelled) return;
        if (status?.state === 'granted') load();
        else if (status?.state === 'denied') setStage('unavailable');
        else setStage('ask');
      } catch {
        // Permissions API not available (older Safari): let the reader opt in.
        if (!cancelled) setStage('ask');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  if (stage === 'ask') {
    return (
      <section className={`rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}>
        <span className="h-10 w-10 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <Droplet className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-ink">See requests near you</h2>
          <p className="text-sm text-slate-500">Turn on location to see blood requests and ragging alerts close by.</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Navigation className="h-4 w-4" /> Use my location
        </button>
      </section>
    );
  }

  const total = blood.length + ragging.length;
  if (stage !== 'ready' || total === 0) return null;

  return (
    <section className={className} aria-label="Requests near you">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-red-600" />
        <h2 className="text-lg font-bold text-ink">Near you</h2>
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">{total}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {blood.map((request) => (
          <BloodRequestCard key={`b-${request.uuid}`} request={request} />
        ))}

        {ragging.map((post) => {
          const distance = formatDistance(post.distanceKm);
          return (
            <Link
              key={`r-${post.uuid || post.id}`}
              href={`/posts/${post.uuid || post.id}`}
              className="block rounded-2xl border border-amber-200 bg-white p-4 transition hover:border-amber-300"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">Ragging reported</p>
                  <p className="truncate text-xs font-semibold text-amber-700">
                    {distance ? `${distance} · ` : ''}
                    {relativeTime(post.createdAt)}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-snug text-slate-700">{post.content}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{post.location || 'Location shared'}</span>
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
