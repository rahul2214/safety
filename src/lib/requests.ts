import { withCountryCode } from './phone';

/**
 * The Ragging category: its reports may carry a map pin and are shown to people nearby.
 * The id mirrors PostCategory.Ragging in the API and migration 00030.
 *
 * Blood requests are not a category. They have their own table, API and page (/blood).
 */
export const RAGGING_CATEGORY_ID = 11;

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

/** A place a request is pinned to: the author's own position, or one chosen on the map. */
export interface RequestPin {
  latitude: number;
  longitude: number;
  /** Human-readable name of the place, shown on the request. */
  label: string;
}

/**
 * Rounds a coordinate before it is sent as the reader's position.
 *
 * Two decimals is roughly a kilometre: ample for "within 25 km", and it keeps an exact
 * position out of request URLs and server logs.
 */
export const coarse = (n: number) => Math.round(n * 100) / 100;

export function formatDistance(km?: number | null): string | null {
  if (km == null || Number.isNaN(km)) return null;
  if (km < 1) return 'Under 1 km away';
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`;
}

/** Volume of one unit of whole blood, as collected in India. */
export const ML_PER_UNIT = 450;

/** "1 unit (~450 ml)", "2 units (~900 ml)". */
export function formatUnits(units: number): string {
  return `${units} unit${units === 1 ? '' : 's'} (~${units * ML_PER_UNIT} ml)`;
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sabhijude.veltria.in').replace(/\/+$/, '');

/** The public page for one request: live status, call and directions, and a join prompt. */
export const bloodRequestUrl = (uuid: string) => `${SITE_URL}/blood/${encodeURIComponent(uuid)}`;

/**
 * The message used when a blood request is shared (WhatsApp, SMS, and so on).
 *
 * Kept short on purpose: what is needed, who to call, directions, and the live status page
 * (which has the place, the note and the invitation to join). It carries the contact number
 * because a share is always started by a person who chose to pass the request on.
 */
export function bloodRequestShareText(req: {
  uuid: string;
  bloodGroup: string;
  unitsNeeded: number;
  location: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  note?: string | null;
}): string {
  return [
    `🩸 Urgent: ${req.bloodGroup} blood needed · ${formatUnits(req.unitsNeeded)}`,
    `📞 Call: ${withCountryCode(req.contactPhone)}`,
    `🗺️ Directions: https://www.google.com/maps/dir/?api=1&destination=${req.latitude},${req.longitude}`,
    `🔗 Live status: ${bloodRequestUrl(req.uuid)}`,
    '',
    '🙏 Please share with anyone who can donate.',
  ].join('\n');
}
