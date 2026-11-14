/**
 * Production-ready API client for Sabhijude User Portal.
 * Handles authentication headers, error normalization, retry logic, and offline caching.
 */

import { apiCache } from './api-cache';

const DEFAULT_PROD_API = 'https://safecircle-api-752721321209.asia-south1.run.app';

const API_BASE =
  typeof window !== 'undefined'
    ? '/api/proxy'
    : process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_API : 'http://127.0.0.1:5000');

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/** The signed-in member's standing, and where any appeal stands. Mirrors AccountStatusDto. */
export interface AccountStatus {
  suspended: boolean;
  /** AUTOMATIC_REPORTS or MODERATOR. Null when in good standing. */
  kind: 'AUTOMATIC_REPORTS' | 'MODERATOR' | null;
  since: string | null;
  appealPending: boolean;
  appealSubmittedAt: string | null;
  appealOutcome: 'UPHELD' | 'REVERSED' | null;
}

export interface DiscoverTopic {
  categoryId: number;
  name: string;
  description?: string | null;
  postCount: number;
}

export interface DiscoverHashtag {
  id: number;
  name: string;
  usageCount: number;
}

/** GET /api/discover. Posts are in the same shape as the feed's. */
export interface DiscoverFeed {
  trending: BackendPost[];
  topics: DiscoverTopic[];
  successStories: BackendPost[];
  trendingHashtags: DiscoverHashtag[];
}

export interface BackendPost {
  id: number;
  uuid?: string;
  content: string;
  severity: string;
  status: string;
  isAnonymous: boolean;
  authorName?: string;
  categoryName?: string;
  categoryId?: number;
  createdAt: string;
  incidentDateTime?: string;
  location?: string;
  /** Distance from the reader in km. Only present on results from the nearby endpoint. */
  distanceKm?: number | null;
  supportCount: number;
  similarCount?: number;
  facedThisCount?: number;
  solutionsCount: number;
  hasSupported?: boolean;
  hasFacedThis?: boolean;
  hasSaved?: boolean;
  safetyAdvice?: string;
  riskScore?: number;
  postSeverityId?: number;
  postStatusId?: number;
  postVisibilityId?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Gender {
  id: number;
  code: string;
  name: string;
  sortOrder: number;
}

export interface PostVisibility {
  id: number;
  name: string;
}

export interface PostSeverityOption {
  id: number;
  code: string;
  name: string;
}

export interface PostStatusOption {
  id: number;
  name: string;
}

/** A request for blood donors. Separate from posts. */
export interface BloodRequest {
  uuid: string;
  bloodGroup: string;
  unitsNeeded: number;
  /** Name of the hospital or place. */
  location: string;
  latitude: number;
  longitude: number;
  /** The number donors should call, with country code. */
  contactPhone: string;
  note?: string | null;
  status: 'OPEN' | 'FULFILLED' | 'CANCELLED';
  requesterName: string;
  /** Whether the signed-in user raised it, and so may close it. */
  isMine: boolean;
  /** Distance from the reader in km. Only present on nearby results. */
  distanceKm?: number | null;
  createdAt: string;
}

export interface CreateBloodRequestPayload {
  bloodGroup: string;
  unitsNeeded: number;
  location: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  note?: string;
}

export interface EmergencyContact {
  id: string | number;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface NotificationItem {
  id: string | number;
  type: string;
  title: string;
  message?: string;
  body?: string;
  timeAgo?: string;
  createdAt?: string;
  isRead: boolean;
  referenceType?: string;
  referenceId?: string | number;
  link?: string;
}

export interface SupportTicket {
  id: number | string;
  ticketCode: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  subject: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  status: 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  description: string;
  lastReply?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolutionReply {
  id: number;
  solutionId: number;
  authorId: number;
  content: string;
  createdAt: string;
  author?: {
    id: number;
    displayName: string;
    isVerifiedExpert?: boolean;
    avatarUrl?: string;
  };
}

export interface Solution {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  isAccepted: boolean;
  helpfulCount: number;
  hasSupported?: boolean;
  replies?: SolutionReply[];
  createdAt: string;
  author?: {
    id: number;
    displayName: string;
    isVerifiedExpert?: boolean;
    avatarUrl?: string;
  };
}

export interface CreateSupportTicketPayload {
  subject: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  description: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export interface SupportConfig {
  helplinePhone: string;
  supportEmail: string;
  emergencyPolice: string;
  womenHelpline: string;
  operatingHours: string;
}

export interface OrgConsentItem {
  scope: string;
  isGranted: boolean;
  grantedAt?: string;
  revokedAt?: string;
  policyVersion: string;
}

export interface UserOrganizationConnection {
  organizationId: number;
  organizationName: string;
  organizationSlug: string;
  organizationType: string;
  orgUuid: string;
  orgStatus: string;
  autoApproveDomain: boolean;
  role: string;
  memberType: string;
  memberCode?: string;
  status: string;
  joinedAt: string;
  consents: OrgConsentItem[];
}

export interface DpdpExportResult {
  userId: number;
  userDisplayName: string;
  orgId: number;
  orgName: string;
  role: string;
  membershipStatus: string;
  joinedAt: string;
  consentsHistory: OrgConsentItem[];
  associatedAuditLogs: Array<{
    id: string;
    actor: string;
    action: string;
    resourceType: string;
    details?: string;
    timestamp: string;
  }>;
  exportedAt: string;
  purpose: string;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('sabhijude_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface RequestCacheOptions {
  skipCache?: boolean;
  forceRefresh?: boolean;
  ttlMs?: number;
}

export const REFRESH_TOKEN_KEY = 'sabhijude_refresh_token';

// Concurrent 401s share one refresh call, since Supabase rotates the refresh token on use
let refreshInFlight: Promise<boolean> | null = null;

/**
 * Swaps the stored refresh token for a new access token (they expire after about an hour).
 * Returns false when there is no refresh token or the session is truly over.
 */
async function refreshSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const json = await res.json().catch(() => null);
        const accessToken: string | undefined = json?.data?.accessToken;
        if (!res.ok || !accessToken) return false;

        localStorage.setItem('sabhijude_token', accessToken);
        if (json.data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, json.data.refreshToken);
        window.dispatchEvent(new Event('sabhijude_token_refreshed'));
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 1,
  cacheOptions?: RequestCacheOptions,
  isRetryAfterRefresh = false
): Promise<{ ok: boolean; data?: T; error?: string; status: number; cached?: boolean }> {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET' || method === 'HEAD';

  // ─── Cache Read (Instant 0ms retrieval) ──────────────────────────
  if (isGet && !cacheOptions?.skipCache && !cacheOptions?.forceRefresh) {
    const cached = apiCache.get<T>(endpoint);
    if (cached !== null && cached !== undefined) {
      return { ok: true, data: cached, status: 200, cached: true };
    }
  }

  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const status = res.status;

    if (status === 401 && typeof window !== 'undefined' && localStorage.getItem('sabhijude_token')) {
      // Access token expired: renew it once and replay the request before giving up
      if (!isRetryAfterRefresh && !endpoint.startsWith('/api/auth/') && (await refreshSession())) {
        return request<T>(endpoint, options, retries, cacheOptions, true);
      }
      localStorage.removeItem('sabhijude_token');
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('sabhijude_user');
      apiCache.clear();
      window.dispatchEvent(new Event('sabhijude_auth_expired'));
    }

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      // response wasn't JSON
    }

    if (res.ok) {
      const responseData = json?.data ?? json;

      // ─── Cache Write ──────────────────────────────────────────────
      if (isGet && !cacheOptions?.skipCache) {
        apiCache.set(endpoint, responseData, cacheOptions?.ttlMs);
      } else if (!isGet) {
        // Automatically purge related cached data on mutations
        apiCache.invalidateOnMutation(method, endpoint);
      }

      return { ok: true, data: responseData, status };
    }

    // Attempt 1 retry for 502/503/504 cold starts (idempotent GET/HEAD only — SEC-27)
    if (isGet && retries > 0 && (status === 502 || status === 503 || status === 504)) {
      await new Promise((r) => setTimeout(r, 1000));
      return request<T>(endpoint, options, retries - 1, cacheOptions);
    }

    // An account can be suspended mid-session. The first refusal tells the app shell to
    // re-check standing and show the suspension screen.
    if (status === 403 && json?.error?.code === 'ACCOUNT_SUSPENDED' && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sabhijude_account_suspended'));
    }

    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${status}`;
    return { ok: false, error: errorMsg, status };
  } catch (err: any) {
    if (isGet && retries > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return request<T>(endpoint, options, retries - 1, cacheOptions);
    }
    return { ok: false, error: err.message || 'Network connection unavailable', status: 0 };
  }
}

export const api = {
  // Manual cache invalidation trigger
  invalidateCache(pattern?: string | RegExp) {
    apiCache.invalidate(pattern);
  },

  // Feed & Posts
  async getFeed(params?: { category?: number; limit?: number; cursor?: string; forceRefresh?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.cursor) query.set('cursor', params.cursor);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<any>(`/api/posts${qs}`, {}, 1, { forceRefresh: params?.forceRefresh });
    if (res.ok && res.data) {
      // Backend returns PaginatedResult<PostDetailDto>: { data: [...], hasMore: bool, nextCursor: string }
      const items: BackendPost[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      return { ok: true, data: items, hasMore: res.data.hasMore, nextCursor: res.data.nextCursor, status: res.status };
    }
    return { ok: false, error: res.error, status: res.status, data: [] };
  },

  async searchPosts(query: string, params?: { category?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (query) qs.set('query', query.trim());
    if (params?.category) qs.set('category', params.category.toString());
    if (params?.limit) qs.set('limit', params.limit.toString());
    const res = await request<any>(`/api/search?${qs.toString()}`);
    if (res.ok && res.data) {
      const items: BackendPost[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      return { ok: true, data: items, hasMore: res.data?.hasMore ?? false, status: res.status };
    }
    return { ok: false, error: res.error, status: res.status, data: [] };
  },

  async createPost(payload: {
    content: string;
    categoryId: number;
    severity?: string;
    postSeverityId?: number;
    postStatusId?: number;
    isAnonymous?: boolean;
    visibility?: string;
    postVisibilityId?: number;
    audienceGenderId?: number | null;
    incidentDateTime?: string;
    location?: string;
    /** The pinned place. Optional, and only kept for a Ragging report. */
    latitude?: number;
    longitude?: number;
  }) {
    const derivedSeverityId =
      payload.postSeverityId ||
      (payload.severity === 'ADVICE_NEEDED'
        ? 1
        : payload.severity === 'CONCERNING'
        ? 2
        : payload.severity === 'SERIOUS'
        ? 3
        : payload.severity === 'IMMEDIATE_DANGER'
        ? 4
        : 2);

    return request<BackendPost>('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        content: payload.content,
        categoryId: payload.categoryId,
        severity: payload.severity || 'CONCERNING',
        postSeverityId: derivedSeverityId,
        postStatusId: payload.postStatusId || 1,
        isAnonymous: payload.isAnonymous ?? true,
        visibility: payload.visibility || 'PUBLIC',
        postVisibilityId: payload.postVisibilityId || 1,
        audienceGenderId: payload.audienceGenderId !== undefined ? payload.audienceGenderId : -1,
        incidentDateTime: payload.incidentDateTime,
        location: payload.location,
        latitude: payload.latitude,
        longitude: payload.longitude,
      }),
    });
  },

  /**
   * Open ragging reports pinned near a position, nearest first.
   * Pass a coarse position (see `coarse` in lib/requests.ts); the API does not store it.
   * Never served from the client cache: it has to reflect a request posted a moment ago.
   */
  async getNearbyRequests(params: { lat: number; lng: number; radiusKm?: number; limit?: number }) {
    const q = new URLSearchParams();
    q.set('lat', String(params.lat));
    q.set('lng', String(params.lng));
    if (params.radiusKm) q.set('radiusKm', String(params.radiusKm));
    if (params.limit) q.set('limit', String(params.limit));
    return request<BackendPost[]>(`/api/posts/nearby?${q.toString()}`, {}, 1, { skipCache: true });
  },

  /** The signed-in user's own posts. The server identifies the user from the session token. */
  async getMyPosts(params?: { limit?: number; forceRefresh?: boolean }) {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', params.limit.toString());
    const queryStr = qs.toString() ? `?${qs.toString()}` : '';
    const res = await request<any>(`/api/posts/mine${queryStr}`, {}, 1, { forceRefresh: params?.forceRefresh });
    if (res.ok && res.data) {
      const items: BackendPost[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      return { ok: true, data: items, status: res.status };
    }
    return { ok: false, error: res.error, status: res.status, data: [] };
  },

  /** One post by uuid. Authors can read their own posts in any moderation state. */
  async getPost(uuid: string, forceRefresh = false) {
    return request<BackendPost & { similarExperienceCount?: number; hasFacedThisToo?: boolean; solutionCount?: number; author?: { displayName?: string }; category?: { name?: string } }>(
      `/api/posts/${encodeURIComponent(uuid)}`,
      {},
      1,
      { forceRefresh }
    );
  },

  async supportPost(uuid: string) {
    return request<{ success: boolean; supportCount: number }>(`/api/posts/${encodeURIComponent(uuid)}/support`, {
      method: 'POST',
    });
  },

  async facedThisPost(uuid: string) {
    return request<{ success: boolean; count?: number }>(`/api/posts/${encodeURIComponent(uuid)}/similar-experience`, {
      method: 'POST',
    });
  },

  async savePost(uuid: string) {
    return request<{ saved: boolean }>(`/api/posts/${encodeURIComponent(uuid)}/save`, {
      method: 'POST',
    });
  },

  /** Trending posts, topics with live counts, resolved stories and trending hashtags. */
  async getDiscover() {
    return request<DiscoverFeed>('/api/discover', {}, 1, { skipCache: true });
  },

  async getAccountStatus() {
    return request<AccountStatus>('/api/account/status', {}, 1, { skipCache: true });
  },

  async submitAppeal(message: string) {
    return request<AccountStatus>('/api/account/appeal', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /** Reports the post itself to moderators. */
  async reportPost(uuid: string, reason: string, details?: string) {
    return request<{ reported: boolean }>(`/api/posts/${encodeURIComponent(uuid)}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    });
  },

  /**
   * Reports whoever wrote the post. Addressed to the post, not a user id, so the author of an
   * anonymous post is never revealed to the reporter.
   */
  async reportPostAuthor(uuid: string, reason: string, details?: string) {
    return request<{ reported: boolean }>(`/api/posts/${encodeURIComponent(uuid)}/report-author`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    });
  },

  async getSavedPosts(limit = 50) {
    return request<BackendPost[]>(`/api/posts/saved?limit=${limit}`);
  },

  // Post Severities
  async getPostSeverities(forceRefresh = false) {
    return request<PostSeverityOption[]>('/api/postseverities', {}, 1, { forceRefresh });
  },

  // Post Statuses
  async getPostStatuses(forceRefresh = false) {
    return request<PostStatusOption[]>('/api/poststatuses', {}, 1, { forceRefresh });
  },

  // Post Visibilities
  async getPostVisibilities(forceRefresh = false) {
    return request<PostVisibility[]>('/api/postvisibilities', {}, 1, { forceRefresh });
  },

  // Categories
  async getCategories(forceRefresh = false) {
    return request<Category[]>('/api/categories', {}, 1, { forceRefresh });
  },

  // Blood requests — separate from posts: own table, own page, never in the report flow.
  async createBloodRequest(payload: CreateBloodRequestPayload) {
    return request<BloodRequest>('/api/bloodrequests', { method: 'POST', body: JSON.stringify(payload) });
  },

  /** Pass a coarse position (see `coarse` in lib/requests.ts); the API does not store it. */
  async getNearbyBloodRequests(params: { lat: number; lng: number; radiusKm?: number }) {
    const q = new URLSearchParams();
    q.set('lat', String(params.lat));
    q.set('lng', String(params.lng));
    if (params.radiusKm) q.set('radiusKm', String(params.radiusKm));
    return request<BloodRequest[]>(`/api/bloodrequests/nearby?${q.toString()}`, {}, 1, { skipCache: true });
  },

  async getMyBloodRequests() {
    return request<BloodRequest[]>('/api/bloodrequests/mine', {}, 1, { skipCache: true });
  },

  async setBloodRequestStatus(uuid: string, status: 'FULFILLED' | 'CANCELLED') {
    return request<BloodRequest>(`/api/bloodrequests/${encodeURIComponent(uuid)}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  // Emergency Contacts
  async getEmergencyContacts(forceRefresh = false) {
    return request<EmergencyContact[]>('/api/emergencycontacts', {}, 1, { forceRefresh });
  },

  async createEmergencyContact(payload: {
    name: string;
    phoneNumber: string;
    relationship?: string;
    isPrimary?: boolean;
  }) {
    return request<EmergencyContact>('/api/emergencycontacts', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        relationshipName: payload.relationship || 'Parent',
        isPrimary: payload.isPrimary ?? false,
      }),
    });
  },

  async updateEmergencyContact(phoneNumber: string, payload: {
    name?: string;
    phoneNumber?: string;
    relationshipName?: string;
    isPrimary?: boolean;
  }) {
    return request<EmergencyContact>(`/api/emergencycontacts/${encodeURIComponent(phoneNumber)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /** Permanently deletes one of the signed-in user's own posts by uuid. */
  async deletePost(uuid: string) {
    return request(`/api/posts/${encodeURIComponent(uuid)}`, { method: 'DELETE' });
  },

  /** Sets the status of one of the signed-in user's own posts by uuid (e.g. 'RESOLVED'). */
  async updatePostStatus(uuid: string, status: string) {
    return request<{ status: string; postStatusId: number }>(`/api/posts/${encodeURIComponent(uuid)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteEmergencyContact(phoneOrId: string | number) {
    return request(`/api/emergencycontacts/${encodeURIComponent(phoneOrId.toString())}`, {
      method: 'DELETE',
    });
  },

  // Notifications
  async getNotifications(forceRefresh = false) {
    const res = await request<any[]>('/api/notifications', {}, 1, { forceRefresh });
    if (res.ok && Array.isArray(res.data)) {
      const normalized: NotificationItem[] = res.data.map((n: any) => {
        const dateStr = n.createdAt;
        let timeAgoStr = 'Recently';
        if (dateStr) {
          const diff = Date.now() - new Date(dateStr).getTime();
          if (!Number.isNaN(diff)) {
            const m = Math.floor(diff / 60000);
            if (m < 1) timeAgoStr = 'Just now';
            else if (m < 60) timeAgoStr = `${m} min ago`;
            else {
              const h = Math.floor(m / 60);
              if (h < 24) timeAgoStr = `${h} h ago`;
              else timeAgoStr = `${Math.floor(h / 24)} d ago`;
            }
          }
        }
        return {
          id: n.id?.toString() || `n-${Math.random()}`,
          type: n.type || 'SYSTEM',
          title: n.title || 'Notification',
          body: n.body || n.message || '',
          message: n.body || n.message || '',
          createdAt: dateStr || new Date().toISOString(),
          timeAgo: timeAgoStr,
          isRead: Boolean(n.isRead),
          referenceType: n.referenceType,
          referenceId: n.referenceId,
          // Post routes accept only the public uuid, so an alert opens the post it is about
          // when the API supplies one, and is not a link otherwise.
          link:
            n.referenceType === 'CONTACTS'
              ? '/contacts'
              : String(n.referenceType || '').toUpperCase() === 'POST' && n.referenceUuid
              ? `/posts/${n.referenceUuid}`
              : undefined,
        };
      });
      return { ...res, data: normalized };
    }
    return res as { ok: boolean; data?: NotificationItem[]; error?: string; status: number };
  },

  async markNotificationRead(id: string | number) {
    return request(`/api/notifications/${encodeURIComponent(String(id))}/read`, { method: 'POST' });
  },

  async markAllNotificationsRead() {
    return request('/api/notifications/read-all', {
      method: 'POST',
    });
  },

  // User Profile & Stats from Database
  async getMyProfile(forceRefresh = false) {
    return request<{ user: any }>('/api/users/me', {}, 1, { forceRefresh });
  },

  async updateProfile(data: {
    genderId?: number;
    dob?: string;
    occupationStatusId?: number;
    occupationStatus?: string;
    /** Empty string clears it. */
    bloodGroup?: string;
    displayName?: string;
    bio?: string;
  }) {
    return request('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getMyOrganizations(forceRefresh = false) {
    return request<UserOrganizationConnection[]>('/api/users/me/organizations', {}, 1, { forceRefresh });
  },

  async joinOrganizationByCode(code: string, consents?: string[]) {
    return request<{ status?: string; isPendingApproval?: boolean; message?: string }>('/api/users/me/organizations/join-code', {
      method: 'POST',
      body: JSON.stringify({ code, consents }),
    });
  },

  async joinOrganizationByInvite(token: string, consents?: string[]) {
    return request('/api/users/me/organizations/join-invite', {
      method: 'POST',
      body: JSON.stringify({ token, consents }),
    });
  },

  async getOrganizationConsents(organizationId: number) {
    return request<OrgConsentItem[]>(`/api/users/me/organizations/${organizationId}/consents`);
  },

  async updateOrganizationConsents(
    organizationId: number,
    consents: Array<{ scope: string; granted: boolean }>
  ) {
    return request<OrgConsentItem[]>(`/api/users/me/organizations/${organizationId}/consents`, {
      method: 'PUT',
      body: JSON.stringify({ consents }),
    });
  },

  async exportOrganizationData(organizationId: number) {
    return request<DpdpExportResult>(`/api/users/me/organizations/${organizationId}/export`);
  },

  async eraseOrganizationData(organizationId: number) {
    return request(`/api/users/me/organizations/${organizationId}/erase`, {
      method: 'POST',
    });
  },

  async leaveOrganization(organizationId: number) {
    return request(`/api/users/me/organizations/${organizationId}/leave`, {
      method: 'POST',
    });
  },

  async exportAccountData() {
    return request<any>('/api/account/export');
  },

  async deleteAccount() {
    return request('/api/account', {
      method: 'DELETE',
    });
  },

  async getMyStats(forceRefresh = false) {
    return request<{
      postCount: number;
      solutionCount: number;
      supportGivenCount: number;
      supportReceivedCount: number;
      resolvedPostCount: number;
    }>('/api/users/me/stats', {}, 1, { forceRefresh });
  },

  // Blocked Users
  async getBlockedUsers(forceRefresh = false) {
    return request<Array<{
      userId: number;
      blockedUserId: number;
      createdAt: string;
    }>>('/api/users/blocked', {}, 1, { forceRefresh });
  },

  async unblockUser(userId: number) {
    return request(`/api/users/${userId}/block`, {
      method: 'DELETE',
    });
  },

  async blockUser(userId: number) {
    return request(`/api/users/${userId}/block`, {
      method: 'POST',
    });
  },

  // Lookup Tables
  async getGenders(forceRefresh = false) {
    return request<Gender[]>('/api/genders', {}, 1, { forceRefresh });
  },

  async getOccupationStatuses(forceRefresh = false) {
    return request<Array<{ id: number; name: string }>>('/api/occupationstatuses', {}, 1, { forceRefresh });
  },

  // Solutions & Community Advice
  async getSolutions(uuid: string, forceRefresh = false) {
    return request<Solution[]>(`/api/posts/${encodeURIComponent(uuid)}/solutions`, {}, 1, { forceRefresh });
  },

  async createSolution(uuid: string, content: string) {
    return request<Solution>(`/api/posts/${encodeURIComponent(uuid)}/solutions`, {
      method: 'POST',
      body: JSON.stringify({ content: content.trim() }),
    });
  },

  async supportSolution(uuid: string, solutionId: number) {
    return request<{ success: boolean; supported: boolean; helpfulCount: number }>(
      `/api/posts/${encodeURIComponent(uuid)}/solutions/${solutionId}/support`,
      { method: 'POST' }
    );
  },

  async deleteSolution(uuid: string, solutionId: number) {
    return request<{ success: boolean; message?: string }>(
      `/api/posts/${encodeURIComponent(uuid)}/solutions/${solutionId}`,
      { method: 'DELETE' }
    );
  },

  async createSolutionReply(uuid: string, solutionId: number, content: string) {
    return request<SolutionReply>(
      `/api/posts/${encodeURIComponent(uuid)}/solutions/${solutionId}/replies`,
      {
        method: 'POST',
        body: JSON.stringify({ content: content.trim() }),
      }
    );
  },

  async deleteSolutionReply(uuid: string, solutionId: number, replyId: number) {
    return request<{ success: boolean; message?: string }>(
      `/api/posts/${encodeURIComponent(uuid)}/solutions/${solutionId}/replies/${replyId}`,
      { method: 'DELETE' }
    );
  },

  /**
   * Records an SOS and alerts the member's emergency contacts — the same endpoint the
   * mobile app uses. This used to publish a PUBLIC feed post instead, which told strangers
   * and nobody who could help, and carried no location.
   *
   * Null coordinates mean "location unavailable"; never send 0,0. Retries reuse one
   * Idempotency-Key, so a retry can never create a second incident.
   */
  async triggerSos(payload: {
    latitude: number | null;
    longitude: number | null;
    accuracy?: number | null;
    note?: string | null;
  }): Promise<{ ok: boolean; message?: string; contactsCount?: number; error?: string }> {
    const idempotencyKey =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

    const delays = [0, 2000, 5000];
    let lastError = 'Could not reach the server.';

    for (const delay of delays) {
      if (delay) await new Promise((r) => setTimeout(r, delay));

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);
      const res = await request<{ message?: string; contactsCount?: number }>(
        '/api/emergencycontacts/sos',
        {
          method: 'POST',
          headers: { 'Idempotency-Key': idempotencyKey },
          body: JSON.stringify({
            latitude: payload.latitude,
            longitude: payload.longitude,
            accuracy: payload.accuracy == null ? null : Math.round(payload.accuracy),
            note: payload.note ?? null,
          }),
          signal: controller.signal,
        },
        0
      ).finally(() => clearTimeout(timer));

      if (res.ok) {
        return { ok: true, message: res.data?.message, contactsCount: res.data?.contactsCount };
      }
      lastError = res.error || lastError;
      // Only a network failure or a server error is worth repeating.
      if (res.status !== 0 && res.status < 500) break;
    }

    return { ok: false, error: lastError };
  },

  // Support & Help Desk Tickets
  async getSupportConfig(forceRefresh = false) {
    return request<SupportConfig>('/api/support/config', {}, 1, { forceRefresh });
  },

  // Requires authentication; the backend identifies the user from the JWT only.
  async getSupportTickets(forceRefresh = false) {
    return request<SupportTicket[]>('/api/support/tickets/mine', {}, 1, { forceRefresh });
  },

  async createSupportTicket(payload: CreateSupportTicketPayload) {
    return request<SupportTicket>('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Organization Onboarding Requests
  async submitOrganizationRequest(payload: CreateOrganizationRequestPayload) {
    return request<OrganizationRequestResult>('/api/organizations/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const apiClient = api;

export interface CreateOrganizationRequestPayload {
  organizationName: string;
  organizationType: string;
  domain?: string;
  contactName: string;
  contactTitle?: string;
  contactEmail: string;
  contactPhone: string;
  memberCountEstimate: string;
  address?: string;
  city?: string;
  state?: string;
  safetyRequirements?: string;
  notes?: string;
}

export interface OrganizationRequestResult {
  id: number;
  requestReference: string;
  organizationName: string;
  organizationType: string;
  contactName: string;
  contactEmail: string;
  status: string;
  createdAt: string;
}

