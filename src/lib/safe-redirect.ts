/**
 * Validate a user-supplied redirect target (e.g. `?redirect=`) so it can only
 * point at a same-origin path (SEC-17). Anything else falls back to `fallback`.
 *
 * Accepted: "/", "/posts/123?x=1#y"
 * Rejected: "//evil.com", "/\evil.com", "https://evil.com", "javascript:...",
 *           relative paths, and anything containing control characters or backslashes.
 */
export function safeRedirect(target: string | null | undefined, fallback: string = '/'): string {
  if (typeof target !== 'string' || target.length === 0 || target.length > 2048) return fallback;
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(target)) return fallback;
  if (target.includes('\\')) return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;

  // Final guard: resolving against a dummy origin must not change the origin.
  try {
    const base = 'http://safe-redirect.invalid';
    const url = new URL(target, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
