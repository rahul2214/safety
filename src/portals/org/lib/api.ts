import { clearSession, getToken, isTokenExpired, touchSession } from './session';

const DEFAULT_PROD_API = 'https://safecircle-api-752721321209.asia-south1.run.app';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_API : 'http://localhost:5000');

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface OrgCacheEntry {
  data: any;
  timestamp: number;
}
const orgCache = new Map<string, OrgCacheEntry>();
const ORG_CACHE_TTL = 30 * 1000; // 30 seconds

export async function adminFetch<T = any>(
  endpoint: string,
  options: RequestInit & { forceRefresh?: boolean } = {}
): Promise<{ data?: T; error?: { code: string; message: string }; ok: boolean; cached?: boolean }> {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET' || method === 'HEAD';

  // Return cached result if available and fresh
  if (isGet && !options.forceRefresh) {
    const cached = orgCache.get(endpoint);
    if (cached && Date.now() - cached.timestamp <= ORG_CACHE_TTL) {
      return { data: cached.data as T, ok: true, cached: true };
    }
  }

  const token = getToken();

  // Drop a token that has already expired instead of sending it. Saves a round trip and
  // gets the user to the login screen immediately; the server still verifies every token
  // it does receive.
  if (token && isTokenExpired(token)) {
    clearSession();
    if (typeof window !== 'undefined' && window.location.pathname !== '/org/login') {
      window.location.href = '/org/login';
    }
    return { error: { code: 'SESSION_EXPIRED', message: 'Your session has expired.' }, ok: false };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        clearSession();
        if (window.location.pathname !== '/org/login') {
          window.location.href = '/org/login';
        }
      }

      const errMsg = json?.error?.message || json?.message || `HTTP error ${res.status}`;
      const errCode = json?.error?.code || 'HTTP_ERROR';
      return { error: { code: errCode, message: errMsg }, ok: false };
    }

    touchSession();

    let resultData: any = json;

    // Backend wraps response in ApiResponse<T> where body.data contains the payload
    if (json && typeof json === 'object') {
      if ('success' in json) {
        if (json.success) {
          resultData = json.data;
        } else {
          return { error: json.error || { code: 'API_ERROR', message: 'Request was not successful.' }, ok: false };
        }
      } else if ('data' in json) {
        if (json.error) {
          return { error: json.error, ok: false };
        }
        resultData = json.data;
      }
    }

    if (isGet) {
      orgCache.set(endpoint, { data: resultData, timestamp: Date.now() });
    } else {
      // Mutations clear the org cache
      orgCache.clear();
    }

    return { data: resultData as T, ok: true };
  } catch (err: any) {
    return {
      error: { code: 'NETWORK_ERROR', message: err?.message || 'Could not connect to the backend server.' },
      ok: false,
    };
  }
}

// â”€â”€â”€ Organization Types & Client â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface Organization {
  id: number;
  name: string;
  slug: string;
  type: 'UNIVERSITY' | 'CORPORATE' | 'RESIDENTIAL' | 'COMMUNITY' | string;
  domain?: string;
  logoUrl?: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE' | string;
  isActive: boolean;
  memberCount: number;
  activeIncidentsCount: number;
  safetyScore: number;
  createdAt: string;
}

export interface OrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'OWNER' | 'ORG_ADMIN' | 'SECURITY_OFFICER' | 'MEMBER' | string;
  department?: string;
  title?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface OrgDashboardStats {
  totalMembers: number;
  activeIncidents: number;
  resolvedIncidentsThisMonth: number;
  sosAlertsToday: number;
  safetyScore: number;
  avgResolutionTimeHours: number;
  incidentsByCategory: { category: string; count: number }[];
  weeklyTrends: { date: string; total: number; resolved: number; sos: number }[];
  recentIncidents: {
    id: number;
    title: string;
    severity: string;
    status: string;
    location?: string;
    authorName: string;
    createdAt: string;
  }[];
}

export interface OrgIncidentEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  notes?: string;
}

export interface OrgIncident {
  id: number;
  organizationId: number;
  title: string;
  description: string;
  severity: 'IMMEDIATE_DANGER' | 'CRITICAL' | 'CONCERNING' | 'SERIOUS' | 'LOW' | string;
  status: 'PENDING' | 'INVESTIGATING' | 'DISPATCHED' | 'RESOLVED' | 'FALSE_ALARM' | string;
  location: string;
  latitude?: number;
  longitude?: number;
  reporterName: string;
  reporterContact: string;
  reporterId?: number;
  assignedOfficerName?: string;
  assignedOfficerId?: number;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  dispatchTimeline: OrgIncidentEvent[];
}

export interface OrgAnalyticsOverview {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  sosEvents: number;
  avgResolutionTimeMinutes: number;
  resolutionRate: number;
  safetyOperationsScore: number;
}

export interface OrgAnalyticsCategoryItem {
  category: string;
  count: number;
  percentage: number;
}

export interface OrgAnalyticsSeverity {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface OrgAnalyticsResolution {
  avgResolutionMinutes: number;
  medianResolutionMinutes: number;
  resolutionRate: number;
  openIncidentRate: number;
  resolvedCount: number;
  openCount: number;
}

export interface OrgAnalyticsTimeBucket {
  hour: number;
  count: number;
}

export interface OrgAnalyticsLocationItem {
  location: string;
  incidentCount: number;
  latitude?: number;
  longitude?: number;
  riskLevel: string;
}

export interface OrgAuditLog {
  id: string;
  organizationId: number;
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: string;
  timestamp: string;
}

export const organizationsApi = {
  getAll: (search?: string) =>
    adminFetch<Organization[]>(`/api/Organizations${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getByIdOrSlug: (idOrSlug: string | number) =>
    adminFetch<Organization>(`/api/Organizations/${idOrSlug}`),
  create: (data: { name: string; slug?: string; type?: string; domain?: string; plan?: string }) =>
    adminFetch<Organization>('/api/Organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMembers: (id: number) =>
    adminFetch<OrganizationMember[]>(`/api/Organizations/${id}/members`),
  addMember: (id: number, data: { email: string; role?: string; department?: string; title?: string }) =>
    adminFetch<OrganizationMember>(`/api/Organizations/${id}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDashboardStats: (id: number) =>
    adminFetch<OrgDashboardStats>(`/api/Organizations/${id}/dashboard/stats`),
  getIncidents: (id: number, params?: { status?: string; severity?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.severity) q.set('severity', params.severity);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return adminFetch<OrgIncident[]>(`/api/Organizations/${id}/incidents${qs}`);
  },
  getIncidentById: (id: number, incidentId: number) =>
    adminFetch<OrgIncident>(`/api/Organizations/${id}/incidents/${incidentId}`),
  updateIncidentStatus: (id: number, incidentId: number, data: { status: string; assignedOfficerName?: string; notes?: string }) =>
    adminFetch<OrgIncident>(`/api/Organizations/${id}/incidents/${incidentId}/status`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  dispatchPatrol: (id: number, incidentId: number, data: { unitName: string; officerName: string; dispatchPriority?: string; instructions?: string }) =>
    adminFetch<OrgIncident>(`/api/Organizations/${id}/incidents/${incidentId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAnalyticsOverview: (id: number) =>
    adminFetch<OrgAnalyticsOverview>(`/api/Organizations/${id}/analytics/overview`),
  getAnalyticsCategories: (id: number) =>
    adminFetch<OrgAnalyticsCategoryItem[]>(`/api/Organizations/${id}/analytics/categories`),
  getAnalyticsSeverity: (id: number) =>
    adminFetch<OrgAnalyticsSeverity>(`/api/Organizations/${id}/analytics/severity`),
  getAnalyticsResolution: (id: number) =>
    adminFetch<OrgAnalyticsResolution>(`/api/Organizations/${id}/analytics/resolution`),
  getAnalyticsTime: (id: number) =>
    adminFetch<OrgAnalyticsTimeBucket[]>(`/api/Organizations/${id}/analytics/time`),
  getAnalyticsLocations: (id: number) =>
    adminFetch<OrgAnalyticsLocationItem[]>(`/api/Organizations/${id}/analytics/locations`),
  sendBroadcast: (id: number, data: { title: string; message: string; urgency?: string; targetAudience?: string }) =>
    adminFetch<OrgBroadcast>(`/api/Organizations/${id}/broadcast`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAuditLogs: (id: number) =>
    adminFetch<OrgAuditLog[]>(`/api/Organizations/${id}/audit-logs`),
  createInvitation: (id: number, data: { role?: string; email?: string; maxUses?: number; expiresInDays?: number }) =>
    adminFetch<OrgInvitation>(`/api/Organizations/${id}/invitations`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getInvitations: (id: number) =>
    adminFetch<OrgInvitation[]>(`/api/Organizations/${id}/invitations`),
  revokeInvitation: (id: number, invitationUuid: string) =>
    adminFetch<{ revoked: boolean }>(`/api/Organizations/${id}/invitations/${invitationUuid}/revoke`, {
      method: 'POST',
    }),
  getJoinRequests: (id: number) =>
    adminFetch<OrganizationMember[]>(`/api/Organizations/${id}/join-requests`),
  reviewJoinRequest: (id: number, memberId: number, data: { approve: boolean; role?: string }) =>
    adminFetch<OrganizationMember>(`/api/Organizations/${id}/join-requests/${memberId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMemberRole: (id: number, memberId: number, newRole: string) =>
    adminFetch<OrganizationMember>(`/api/Organizations/${id}/members/${memberId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ newRole }),
    }),
  getMembersWithConsents: (id: number) =>
    adminFetch<MemberWithConsents[]>(`/api/Organizations/${id}/members-with-consents`),
};

export interface OrgInvitation {
  token?: string;
  uuid: string;
  orgId: number;
  role: string;
  email?: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  isRevoked: boolean;
  createdAt: string;
}

export interface MemberConsentItem {
  scope: string;
  isGranted: boolean;
  grantedAt?: string;
  revokedAt?: string;
  policyVersion: string;
}

export interface MemberWithConsents extends OrganizationMember {
  consents: MemberConsentItem[];
}

export interface OrgBroadcast {
  id: number;
  organizationId: number;
  organizationName: string;
  title: string;
  message: string;
  urgency: 'CRITICAL' | 'HIGH' | 'INFO' | string;
  targetAudience: 'ALL' | 'STUDENTS' | 'STAFF' | string;
  sentBy: string;
  createdAt: string;
}

export interface UpdateOrgMemberInput {
  role?: string;
  department?: string;
  title?: string;
  memberType?: string;
  memberCode?: string;
  isActive?: boolean;
}

/** Endpoints added alongside the organization access-control work. */
export const organizationMembersApi = {
  update: (orgId: number, memberId: number, data: UpdateOrgMemberInput) =>
    adminFetch<OrganizationMember>(`/api/Organizations/${orgId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (orgId: number, memberId: number) =>
    adminFetch<{ removed: boolean }>(`/api/Organizations/${orgId}/members/${memberId}`, {
      method: 'DELETE',
    }),
};

export const organizationBroadcastsApi = {
  list: (orgId: number) => adminFetch<OrgBroadcast[]>(`/api/Organizations/${orgId}/broadcasts`),
};
