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
