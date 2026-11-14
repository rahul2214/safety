'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Compass, Droplet, Map as MapIcon, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/lib/auth-context';
import { api, type BloodRequest } from '@/lib/api-client';
import { getCurrentCoordinates, reverseGeocodeCoords } from '@/lib/location';
import { BLOOD_GROUPS, type RequestPin } from '@/lib/requests';
import { COUNTRY_CODE, isCallableIndianNumber, nationalDigits } from '@/lib/phone';
import { MapPinPicker } from '@/components/MapPinPicker';
import { NearbyRequests, relativeTime } from '@/components/NearbyRequests';

const MAX_NOTE = 500;
const MAX_UNITS = 20;

type PlaceMode = 'gps' | 'map';
type Errors = Partial<Record<'group' | 'place' | 'phone', string>>;

const sectionLabel = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2';
const inputClass =
  'w-full h-11 px-3 rounded-xl border bg-white text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand';

/**
 * Request blood from donors nearby.
 *
 * A page of its own, not part of incident reporting: there is no category, severity or
 * anonymity here. The request is shown under "Near you" to people close to the pinned place.
 */
export default function BloodRequestPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bloodGroup, setBloodGroup] = useState<string | null>(null);
  const [units, setUnits] = useState(1);
  const [placeMode, setPlaceMode] = useState<PlaceMode | null>(null);
  const [pin, setPin] = useState<RequestPin | null>(null);
  const [placeName, setPlaceName] = useState('');
  const [locating, setLocating] = useState(false);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const [mine, setMine] = useState<BloodRequest[]>([]);
  // Remounts the nearby list after a change, so a new request shows up straight away.
  const [nearbyKey, setNearbyKey] = useState(0);

  // Prefill the contact number from the profile once it is known; the user can change it.
  useEffect(() => {
    const own = nationalDigits(String((user as any)?.phoneNumber ?? ''));
    if (own) setPhone((current) => current || own);
  }, [user]);

  const loadMine = useCallback(async () => {
    const res = await api.getMyBloodRequests();
    if (res.ok && Array.isArray(res.data)) setMine(res.data);
  }, []);

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  const applyPin = (next: RequestPin) => {
    setPin(next);
    setPlaceName(next.label);
    setErrors((e) => ({ ...e, place: undefined }));
  };

  const useMyLocation = async () => {
    setPlaceMode('gps');
    setLocating(true);
    try {
      const coords = await getCurrentCoordinates();
      const fallback = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      applyPin({ latitude: coords.latitude, longitude: coords.longitude, label: fallback });
      const address = await reverseGeocodeCoords(coords.latitude, coords.longitude);
      const name = address ? [address.suburb, address.city].filter(Boolean).join(', ') : '';
      if (name) applyPin({ latitude: coords.latitude, longitude: coords.longitude, label: name });
    } catch (err: any) {
      setPin(null);
      setErrors((e) => ({
        ...e,
        place: `${err?.message || 'Could not get your location.'} You can pick the place on the map instead.`,
      }));
    } finally {
      setLocating(false);
    }
  };

  const validate = (): Errors => {
    const found: Errors = {};
    if (!bloodGroup) found.group = 'Choose the blood group that is needed.';
    if (!pin) found.place = 'Share your location or pin the hospital on the map, so nearby donors can see the request.';
    else if (!placeName.trim()) found.place = 'Enter the name of the hospital or place.';
    if (phone.length < 10) {
      found.phone = `Enter all 10 digits of the number donors should call (${phone.length} entered).`;
    } else if (!isCallableIndianNumber(phone)) {
      found.phone = 'A phone number cannot start with 0. Enter it without the leading 0.';
    }
    return found;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0 || !bloodGroup || !pin) return;

    setSubmitting(true);
    try {
      const res = await api.createBloodRequest({
        bloodGroup,
        unitsNeeded: units,
        location: placeName.trim(),
        latitude: pin.latitude,
        longitude: pin.longitude,
        contactPhone: `${COUNTRY_CODE}${phone}`,
        note: note.trim() || undefined,
      });

      if (!res.ok) {
        showToast(res.error || 'Could not send the request. Please try again.', 'error');
        return;
      }

      showToast('Request sent. People near that place can now see it.', 'success');
      setBloodGroup(null);
      setUnits(1);
      setPin(null);
      setPlaceMode(null);
      setPlaceName('');
      setNote('');
      setErrors({});
      void loadMine();
      setNearbyKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const closeRequest = async (req: BloodRequest, status: 'FULFILLED' | 'CANCELLED') => {
    const question =
      status === 'FULFILLED'
        ? 'Mark this request as fulfilled? It will stop being shown to people nearby.'
        : 'Cancel this request? It will stop being shown to people nearby.';
    if (!window.confirm(question)) return;

    const res = await api.setBloodRequestStatus(req.uuid, status);
    if (!res.ok) {
      showToast(res.error || 'Could not update the request.', 'error');
      return;
    }
    setMine((prev) => prev.map((r) => (r.uuid === req.uuid ? { ...r, status } : r)));
    setNearbyKey((k) => k + 1);
  };

  const placeOption = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition ${
      active ? 'border-brand bg-brand-tint text-brand' : 'border-slate-200 bg-white text-ink hover:border-slate-300'
    }`;

  const errorText = (message?: string) =>
    message ? (
      <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
        {message}
      </p>
    ) : null;

  const visibleMine = [...mine.filter((r) => r.status === 'OPEN'), ...mine.filter((r) => r.status !== 'OPEN').slice(0, 5)];

  return (
    <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-5">
      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Droplet className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">Request blood</h1>
            <p className="text-sm text-slate-500">Shown to people near the place you choose. They can call the number you give.</p>
          </div>
        </div>

        {/* Blood group */}
        <div>
          <span className={sectionLabel}>
            Blood group needed <span className="text-red-600">*</span>
          </span>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Blood group needed">
            {BLOOD_GROUPS.map((group) => {
              const selected = bloodGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setBloodGroup(group);
                    setErrors((e) => ({ ...e, group: undefined }));
                  }}
                  className={`h-11 rounded-xl border text-sm font-extrabold transition ${
                    selected
                      ? 'border-red-600 bg-red-600 text-white'
                      : `bg-white text-ink hover:border-red-300 ${errors.group ? 'border-red-400' : 'border-slate-200'}`
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
          {errorText(errors.group)}
        </div>

        {/* Units */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">Units needed</p>
            <p className="text-xs text-slate-500">One unit is one donation</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Fewer units"
              disabled={units <= 1}
              onClick={() => setUnits((u) => Math.max(1, u - 1))}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-ink disabled:opacity-40 hover:border-slate-300"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-11 text-center text-lg font-extrabold text-ink" aria-live="polite">
              {units}
            </span>
            <button
              type="button"
              aria-label="More units"
              disabled={units >= MAX_UNITS}
              onClick={() => setUnits((u) => Math.min(MAX_UNITS, u + 1))}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-ink disabled:opacity-40 hover:border-slate-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Place */}
        <div>
          <span className={sectionLabel}>
            Where is it needed? <span className="text-red-600">*</span>
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={useMyLocation} disabled={locating} className={placeOption(placeMode === 'gps')}>
              {locating ? (
                <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
              My location
            </button>
            <button type="button" onClick={() => setPlaceMode('map')} className={placeOption(placeMode === 'map')}>
              <MapIcon className="h-4 w-4" /> Pick on map
            </button>
          </div>

          {placeMode === 'map' && (
            <div className="mt-3">
              <MapPinPicker value={pin} onChange={applyPin} />
            </div>
          )}

          {pin && (
            <div className="mt-3">
              <label htmlFor="blood-place" className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Location set. Name the hospital or place:
              </label>
              <input
                id="blood-place"
                type="text"
                value={placeName}
                maxLength={250}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Hospital or place name"
                className={`${inputClass} ${errors.place ? 'border-red-400' : 'border-slate-200'}`}
              />
            </div>
          )}
          {errorText(errors.place)}
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="blood-phone" className={sectionLabel}>
            Number donors should call <span className="text-red-600">*</span>
          </label>
          <div
            className={`flex h-11 rounded-xl border bg-white overflow-hidden focus-within:ring-4 focus-within:ring-brand/10 focus-within:border-brand ${
              errors.phone ? 'border-red-400' : 'border-slate-200'
            }`}
          >
            <span className="flex items-center px-3 bg-slate-50 border-r border-slate-200 text-sm font-bold text-slate-700 select-none">
              {COUNTRY_CODE}
            </span>
            <input
              id="blood-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => {
                setPhone(nationalDigits(e.target.value));
                setErrors((er) => ({ ...er, phone: undefined }));
              }}
              placeholder="98765 43210"
              className="flex-1 min-w-0 px-3 text-sm text-ink bg-white focus:outline-none"
            />
          </div>
          {errorText(errors.phone)}
          <p className="mt-1.5 text-xs text-slate-500">Shown to signed-in people nearby until you close the request.</p>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="blood-note" className={sectionLabel}>
            Details (optional)
          </label>
          <textarea
            id="blood-note"
            value={note}
            maxLength={MAX_NOTE}
            rows={3}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Surgery tomorrow 9 am, ward 4. Ask for the attendant at reception."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand resize-y"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
          Send request
        </Button>
      </form>

      {/* My requests */}
      <aside className="lg:col-span-2 space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Your requests</h2>
        {visibleMine.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            You have not requested blood yet.
          </p>
        ) : (
          <ul className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
            {visibleMine.map((req) => {
              const isOpen = req.status === 'OPEN';
              const tone = isOpen
                ? 'bg-red-50 text-red-600'
                : req.status === 'FULFILLED'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-500';
              return (
                <li key={req.uuid} className="p-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-lg px-1.5 text-sm font-extrabold ${tone}`}>
                      {req.bloodGroup}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {req.unitsNeeded} unit{req.unitsNeeded === 1 ? '' : 's'} · {req.location}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isOpen ? 'Open' : req.status === 'FULFILLED' ? 'Fulfilled' : 'Cancelled'} · {relativeTime(req.createdAt)}
                      </p>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => closeRequest(req, 'FULFILLED')}
                        className="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        Mark fulfilled
                      </button>
                      <button
                        type="button"
                        onClick={() => closeRequest(req, 'CANCELLED')}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Requests from other people nearby */}
      <NearbyRequests key={nearbyKey} className="lg:col-span-5" />
    </div>
  );
}
