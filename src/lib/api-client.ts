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

export interface BackendPost {
  id: number;
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
  supportCount: number;
  similarCount?: number;
  facedThisCount?: number;
  solutionsCount: number;
  hasSupported?: boolean;
  hasFacedThis?: boolean;
  hasSaved?: boolean;
  hashtags?: string[];
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

export interface EmergencyContact {
  id: string | number;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface NotificationItem {
  id: string | number;
  type: 'SUPPORT' | 'SOLUTION' | 'RESOLVED' | 'SIMILAR' | 'REVIEW';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
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
  const token = localStorage.getItem('safecircle_token');
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

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 1,
  cacheOptions?: RequestCacheOptions
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

    if (status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('safecircle_token');
        if (token && !token.startsWith('local_')) {
          localStorage.removeItem('safecircle_token');
          localStorage.removeItem('safecircle_user');
          window.dispatchEvent(new Event('safecircle_auth_expired'));
        }
      }
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

    // Attempt 1 retry for 502/503/504 cold starts
    if (retries > 0 && (status === 502 || status === 503 || status === 504)) {
      await new Promise((r) => setTimeout(r, 1000));
      return request<T>(endpoint, options, retries - 1, cacheOptions);
    }

    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${status}`;
    return { ok: false, error: errorMsg, status };
  } catch (err: any) {
    if (retries > 0) {
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
    hashtags?: string[];
    incidentDateTime?: string;
    location?: string;
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
        hashtags: payload.hashtags || [],
        incidentDateTime: payload.incidentDateTime,
        location: payload.location,
      }),
    });
  },

  async getMyPosts(params?: {
    limit?: number;
    postIds?: (string | number)[];
    authorId?: number;
    authorName?: string;
    forceRefresh?: boolean;
  }) {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', params.limit.toString());
    if (params?.postIds && params.postIds.length > 0) {
      qs.set('postIds', params.postIds.join(','));
    }
    if (params?.authorId) qs.set('authorId', params.authorId.toString());
    if (params?.authorName) qs.set('authorName', params.authorName);
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

  async supportPost(postId: number) {
    return request<{ success: boolean; supportCount: number }>(`/api/posts/${postId}/support`, {
      method: 'POST',
    });
  },

  async facedThisPost(postId: number) {
    return request<{ success: boolean; count?: number }>(`/api/posts/${postId}/similar-experience`, {
      method: 'POST',
    });
  },

  async savePost(postId: number) {
    return request<{ saved: boolean }>(`/api/posts/${postId}/save`, {
      method: 'POST',
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

  async deleteEmergencyContact(phoneOrId: string | number) {
    return request(`/api/emergencycontacts/${encodeURIComponent(phoneOrId.toString())}`, {
      method: 'DELETE',
    });
  },

  // Notifications
  async getNotifications(forceRefresh = false) {
    return request<NotificationItem[]>('/api/notifications', {}, 1, { forceRefresh });
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
  async getSolutions(postId: number, forceRefresh = false) {
    return request<Array<{
      id: number;
      postId: number;
      authorId: number;
      content: string;
      isAccepted: boolean;
      helpfulCount: number;
      createdAt: string;
      author?: {
        id: number;
        displayName: string;
        isVerifiedExpert?: boolean;
      };
    }>>(`/api/posts/${postId}/solutions`, {}, 1, { forceRefresh });
  },

  async createSolution(postId: number, content: string) {
    return request(`/api/posts/${postId}/solutions`, {
      method: 'POST',
      body: JSON.stringify({ content: content.trim() }),
    });
  },

  // Live Emergency SOS Broadcast
  async triggerSosBroadcast(payload: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    message?: string;
  }) {
    return request('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        content: payload.message || 'EMERGENCY SOS: User has activated panic button.',
        categoryId: 1, // Harassment / Emergency
        severity: 'IMMEDIATE_DANGER',
        isAnonymous: false,
        visibility: 'PUBLIC',
        hashtags: ['emergency', 'sos'],
      }),
    });
  },

  // Support & Help Desk Tickets
  async getSupportConfig(forceRefresh = false) {
    return request<SupportConfig>('/api/support/config', {}, 1, { forceRefresh });
  },

  async getSupportTickets(email?: string, forceRefresh = false) {
    const q = email ? `?email=${encodeURIComponent(email)}` : '';
    return request<SupportTicket[]>(`/api/support/tickets/mine${q}`, {}, 1, { forceRefresh });
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

