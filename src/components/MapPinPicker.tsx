'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { reverseGeocodeCoords, searchIndianLocation } from '@/lib/location';
import type { RequestPin } from '@/lib/requests';

interface MapPinPickerProps {
  value: RequestPin | null;
  onChange: (pin: RequestPin) => void;
  /** Where to open the map when nothing is pinned yet, e.g. the user's own position. */
  initialCenter?: { latitude: number; longitude: number } | null;
}

/** Centre of India, used when there is neither a pin nor a known position. */
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];

const PIN_HTML = `
  <div style="position:relative;width:30px;height:30px;transform:translate(-50%,-100%);">
    <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:#e11d48;border:3px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.35);"></div>
  </div>`;

async function labelFor(latitude: number, longitude: number): Promise<string> {
  const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  const address = await reverseGeocodeCoords(latitude, longitude);
  if (!address) return fallback;
  const short = [address.suburb, address.city].filter(Boolean).join(', ');
  return short || address.displayName || fallback;
}

/**
 * Lets the author choose a place by clicking the map (or searching for it), instead of
 * sharing their own position. Used for requests that should reach people near that place.
 */
export function MapPinPicker({ value, onChange, initialCenter }: MapPinPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  // The map's click handler is registered once; it reads the latest callback from here.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const placeMarker = (latitude: number, longitude: number) => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      markerRef.current = L.marker([latitude, longitude], {
        icon: L.divIcon({ html: PIN_HTML, className: '', iconSize: [0, 0] }),
        keyboard: false,
      }).addTo(map);
    }
  };

  const choose = async (latitude: number, longitude: number) => {
    placeMarker(latitude, longitude);
    // Report the pin immediately so the form is valid, then improve its name.
    onChangeRef.current({ latitude, longitude, label: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
    const label = await labelFor(latitude, longitude);
    onChangeRef.current({ latitude, longitude, label });
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    let mounted = true;

    (async () => {
      const L = (await import('leaflet')).default;
      if (!mounted || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const start: [number, number] = value
        ? [value.latitude, value.longitude]
        : initialCenter
        ? [initialCenter.latitude, initialCenter.longitude]
        : INDIA_CENTER;

      const map = L.map(containerRef.current, {
        center: start,
        zoom: value || initialCenter ? 14 : 5,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on('click', (e: any) => void choose(e.latlng.lat, e.latlng.lng));
      mapRef.current = map;

      if (value) placeMarker(value.latitude, value.longitude);
      // The container is often revealed by a state change; Leaflet needs to re-measure it.
      setTimeout(() => map.invalidateSize(), 250);
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // Initialised once; later pin changes are applied by the handlers above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    const term = query.trim();
    if (!term || searching) return;
    setSearching(true);
    setSearchError(null);
    try {
      const hit = await searchIndianLocation(term);
      if (!hit) {
        setSearchError('No place found with that name. Try a nearby landmark, or click the map.');
        return;
      }
      mapRef.current?.setView([hit.lat, hit.lng], 15);
      placeMarker(hit.lat, hit.lng);
      // Keep the name the user searched for at the front: "Apollo Hospital, Jubilee Hills".
      const label = hit.displayName.split(',').slice(0, 3).join(',').trim() || term;
      onChangeRef.current({ latitude: hit.lat, longitude: hit.lng, label });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSearch();
              }
            }}
            placeholder="Search a hospital, college or area"
            aria-label="Search for a place on the map"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleSearch()}
          disabled={searching || !query.trim()}
          className="h-11 shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {searching ? 'Searching…' : 'Find'}
        </button>
      </div>
      {searchError && <p className="text-xs text-red-600">{searchError}</p>}

      <div
        ref={containerRef}
        role="application"
        aria-label="Map. Click a spot to pin the location."
        className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 sm:h-72"
        // Leaflet panes use z-indexes up to 1000; isolate them so they stay under the page chrome.
        style={{ isolation: 'isolate', zIndex: 0 }}
      />

      <p className="flex items-start gap-2 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
        {value ? (
          <span>
            Pinned: <strong className="text-ink">{value.label}</strong>
          </span>
        ) : (
          <span>Click the map to drop a pin on the exact place.</span>
        )}
      </p>
    </div>
  );
}
