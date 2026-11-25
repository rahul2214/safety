'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminFetch, organizationsApi, type Organization } from './api';
import { STAFF_ROLES, useAdminAuth } from './auth-context';

const SELECTED_ORG_KEY = 'sabhijude_selected_org';

interface OrgContextValue {
  /** The organization every dashboard screen is currently scoped to. */
  organization: Organization | null;
  /** Every organization this account may act on. */
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  selectOrganization: (id: number) => void;
  refresh: () => Promise<void>;
}

const OrgContext = createContext<OrgContextValue>({
  organization: null,
  organizations: [],
  loading: true,
  error: null,
  selectOrganization: () => {},
  refresh: async () => {},
});

/**
 * Resolves which organization the portal is looking at.
 *
 * Every dashboard page used to hardcode `orgId = 1`, so an operator signed in to one
 * institution was shown a different one's incidents, roster and analytics. The id now comes
 * from the API, scoped to what the signed-in account is actually allowed to see.
 */
export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { admin } = useAdminAuth();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await organizationsApi.getAll();

    if (!res.ok || !res.data) {
      setOrganizations([]);
      setError(res.error?.message ?? 'Could not load your organizations.');
      setLoading(false);
      return;
    }

    let visible = res.data;

    // An organization's own login sees only the organizations where it is staff. The API
    // also returns ones it merely belongs to as a member, whose dashboards it cannot open.
    if (admin?.kind === 'staff') {
      const mine = await adminFetch<{ organizationId: number; role: string }[]>('/api/users/me/organizations');
      const staffOrgIds = new Set(
        (mine.data ?? [])
          .filter((m) => STAFF_ROLES.includes(m.role?.toUpperCase() as (typeof STAFF_ROLES)[number]))
          .map((m) => m.organizationId)
      );
      visible = visible.filter((o) => staffOrgIds.has(o.id));
    }

    setOrganizations(visible);

    // Restore the last choice when it is still one this account can see; otherwise fall
    // back to the first available organization rather than a fixed id.
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(SELECTED_ORG_KEY) : null;
    const storedId = stored ? Number(stored) : NaN;
    const restorable = res.data.find((o) => o.id === storedId);

    setSelectedId(restorable?.id ?? res.data[0]?.id ?? null);
    setLoading(false);
  }, [admin?.kind]);

  useEffect(() => {
    if (!admin) return;
    void load();
  }, [admin, load]);

  const selectOrganization = useCallback((id: number) => {
    setSelectedId(id);
    try {
      window.localStorage.setItem(SELECTED_ORG_KEY, String(id));
    } catch {
      // A blocked storage API is not a reason to fail the switch.
    }
  }, []);

  const organization = useMemo(
    () => organizations.find((o) => o.id === selectedId) ?? null,
    [organizations, selectedId]
  );

  const value = useMemo<OrgContextValue>(
    () => ({ organization, organizations, loading, error, selectOrganization, refresh: load }),
    [organization, organizations, loading, error, selectOrganization, load]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export const useOrg = () => useContext(OrgContext);

/**
 * The current organization's id, or null while it is still resolving. Pages should skip
 * their data fetch until this is a number.
 */
export function useOrgId(): number | null {
  return useOrg().organization?.id ?? null;
}
