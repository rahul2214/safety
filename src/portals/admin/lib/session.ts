const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';
const LAST_SEEN_KEY = 'admin_last_seen';

/**
 * How long a portal tab may sit untouched before the session is dropped.
 *
 * An administrator console left open on an unattended machine is a standing invitation.
 * The server-side token lifetime is the hard limit; this is the softer one that logs out a
 * forgotten tab well before it.
 */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Session storage for the portal.
 *
 * Deliberately `sessionStorage`, not `localStorage`: the token dies with the tab, so a shared
 * or borrowed machine does not keep an administrator session alive after the browser closes,
 * and a token cannot be lifted from a long-lived origin store days later.
 *
 * This is a mitigation, not a cure. A bearer token held anywhere JavaScript can read is
 * exposed to script injection; the real fix is an httpOnly, SameSite cookie issued by the
 * API, which needs CSRF protection on the server side to go with it. Until then the Content
 * Security Policy in middleware.ts is what keeps injected script from running at all.
 */
function store(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    // Storage can be blocked entirely (private mode, enterprise policy).
    return null;
  }
}

export function getToken(): string | null {
  const s = store();
  if (!s) return null;

  if (isIdle()) {
    clearSession();
    return null;
  }

  return s.getItem(TOKEN_KEY);
}

export function getStoredUser<T>(): T | null {
  const s = store();
  if (!s) return null;

  const raw = s.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    // A corrupt entry is worse than none: drop it rather than crashing the app shell.
    s.removeItem(USER_KEY);
    return null;
  }
}

export function saveSession(token: string, user: unknown) {
  const s = store();
  if (!s) return;

  s.setItem(TOKEN_KEY, token);
  s.setItem(USER_KEY, JSON.stringify(user));
  touchSession();

  if (typeof document !== 'undefined') {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `admin_session=1; path=/admin; max-age=28800; SameSite=Lax${secureFlag}`;
  }
}

export function saveUser(user: unknown) {
  store()?.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  const s = store();
  if (!s) return;

  s.removeItem(TOKEN_KEY);
  s.removeItem(USER_KEY);
  s.removeItem(LAST_SEEN_KEY);

  if (typeof document !== 'undefined') {
    document.cookie = 'admin_session=; path=/admin; max-age=0; SameSite=Lax';
  }
}

/** Records activity. Called on every successful API call. */
export function touchSession() {
  store()?.setItem(LAST_SEEN_KEY, String(Date.now()));
}

export function isIdle(): boolean {
  const s = store();
  if (!s) return false;

  const lastSeen = Number(s.getItem(LAST_SEEN_KEY));
  if (!lastSeen) return false;

  return Date.now() - lastSeen > IDLE_TIMEOUT_MS;
}

/**
 * Reads the expiry out of the session token without trusting it for anything else.
 *
 * Used only to drop an obviously dead token before making a pointless request. The server
 * verifies the signature on every call; nothing here is a security decision.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    if (!payload) return true;

    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof decoded.exp !== 'number') return false;

    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
