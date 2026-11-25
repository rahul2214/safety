'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminFetch } from './api';
import {
  clearSession,
  getStoredUser,
  getToken,
  saveRefreshToken,
  saveSession,
  saveUser,
} from './session';

/** Organization roles that may use the portal. Plain members use the mobile app. */
export const STAFF_ROLES = ['OWNER', 'ORG_ADMIN', 'SECURITY_OFFICER'] as const;

/**
 * Whoever is signed in to the portal.
 *
 * Two kinds of account can sign in:
 *  - `staff`: an organization's own login, an ordinary Sabhijude account with an OWNER,
 *    ORG_ADMIN or SECURITY_OFFICER membership. Created for them by a platform admin.
 *  - `admin`: a Sabhijude platform administrator, who can act on every organization.
 */
export interface AdminUser {
  id: number | string;
  email: string;
  fullName: string;
  role: string;
  kind: 'staff' | 'admin';
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  refreshProfile: async () => {},
});

interface StaffMembership {
  organizationId: number;
  organizationName: string;
  role: string;
}

const INVALID_LOGIN = 'Incorrect email or password.';

/** The staff roles this account holds, across all its organizations. */
async function loadStaffMemberships(): Promise<StaffMembership[] | null> {
  const res = await adminFetch<StaffMembership[]>('/api/users/me/organizations', { forceRefresh: true });
  if (!res.ok || !res.data) return null;
  return res.data.filter((m) => STAFF_ROLES.includes(m.role?.toUpperCase() as (typeof STAFF_ROLES)[number]));
}

function roleLabel(memberships: StaffMembership[]): string {
  const order = ['OWNER', 'ORG_ADMIN', 'SECURITY_OFFICER'];
  const best = order.find((r) => memberships.some((m) => m.role?.toUpperCase() === r));
  return best ?? 'ORG_STAFF';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshProfile = async () => {
    const stored = getStoredUser<AdminUser>();

    if (stored?.kind === 'staff') {
      // Confirms the session is alive and the account still holds a staff role.
      const memberships = await loadStaffMemberships();
      if (memberships && memberships.length > 0) {
        const next = { ...stored, role: roleLabel(memberships) };
        setAdmin(next);
        saveUser(next);
      } else if (memberships) {
        // Still signed in, but no longer staff anywhere.
        clearSession();
        setAdmin(null);
      }
      return;
    }

    const res = await adminFetch<Omit<AdminUser, 'kind'>>('/api/admin/auth/me');
    if (res.ok && res.data) {
      const next: AdminUser = { ...res.data, kind: 'admin' };
      setAdmin(next);
      saveUser(next);
    } else if (res.error?.code === 'UNAUTHORIZED' || res.error?.code === 'SESSION_EXPIRED') {
      // The stored profile outlived the session it belonged to.
      clearSession();
      setAdmin(null);
    }
  };

  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser<AdminUser>();

    if (token && stored) {
      setAdmin(stored);
      // Confirm with the server rather than trusting the cached copy: the account may have
      // been deactivated or had its role changed since this tab was opened.
      void refreshProfile();
    } else if (token || stored) {
      // Half a session is not a session.
      clearSession();
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      const isLogin = pathname === '/org/login';
      if (!admin && !isLogin) {
        router.push('/org/login');
      } else if (admin && isLogin) {
        router.push('/org/dashboard');
      }
    }
  }, [admin, loading, pathname, router]);

  /** Organization staff account (the login a platform admin created for them). */
  const loginAsStaff = async (email: string, password: string) => {
    const res = await adminFetch<{
      accessToken: string;
      refreshToken?: string;
      user: { id: string; email: string; displayName?: string };
    }>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok || !res.data?.accessToken) {
      return { success: false as const, error: res.error };
    }

    const { accessToken, refreshToken, user } = res.data;
    const profile: AdminUser = {
      id: user.id,
      email: user.email,
      fullName: user.displayName || user.email.split('@')[0],
      role: 'ORG_STAFF',
      kind: 'staff',
    };

    // The memberships call needs the token, so the session starts first and is dropped
    // again if this account is not staff of any organization.
    saveSession(accessToken, profile);
    saveRefreshToken(refreshToken);

    const memberships = await loadStaffMemberships();
    if (!memberships || memberships.length === 0) {
      clearSession();
      return {
        success: false as const,
        error: {
          code: 'NOT_ORG_STAFF',
          message:
            'This account is not an organization admin. Ask the Sabhijude team to give it portal access.',
        },
      };
    }

    const signedIn = { ...profile, role: roleLabel(memberships) };
    saveUser(signedIn);
    setAdmin(signedIn);
    return { success: true as const };
  };

  /** Sabhijude platform administrator, who can act on every organization. */
  const loginAsPlatformAdmin = async (email: string, password: string) => {
    const res = await adminFetch<{ token: string; admin: Omit<AdminUser, 'kind'> }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const payload: any = res.ok ? (res.data as any)?.data || res.data : null;
    if (payload?.token && payload?.admin) {
      const adminUser: AdminUser = { ...payload.admin, kind: 'admin' };
      saveSession(payload.token, adminUser);
      setAdmin(adminUser);
      return { success: true as const };
    }
    return { success: false as const, error: res.error };
  };

  const login = async (email: string, password: string) => {
    const staff = await loginAsStaff(email, password);
    if (staff.success) return { success: true };

    // Signed in fine but holds no staff role: say so rather than trying the admin login.
    if (staff.error?.code === 'NOT_ORG_STAFF') {
      return { success: false, error: staff.error.message };
    }
    if (staff.error?.code === 'TOO_MANY_ATTEMPTS' || staff.error?.code === 'EMAIL_NOT_VERIFIED') {
      return { success: false, error: staff.error.message };
    }

    const platform = await loginAsPlatformAdmin(email, password);
    if (platform.success) return { success: true };

    return {
      success: false,
      error:
        platform.error?.code === 'NETWORK_ERROR' || staff.error?.code === 'NETWORK_ERROR'
          ? 'Could not reach the server. Check your connection and try again.'
          : INVALID_LOGIN,
    };
  };

  const logout = () => {
    const endpoint = admin?.kind === 'staff' ? '/api/Auth/logout' : '/api/admin/auth/logout';
    adminFetch(endpoint, { method: 'POST' }).catch(() => {});
    clearSession();
    setAdmin(null);
    router.push('/org/login');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AuthContext);
