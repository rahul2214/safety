'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminFetch } from './api';
import { clearSession, getStoredUser, getToken, saveSession, saveUser } from './session';

/** What the admin needs to add Sabhijude to an authenticator app. */
export interface MfaSetupData {
  secret: string;
  qrCodeUri: string;
  recoveryCodes: string[];
}

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  lastLoginAt?: string | null;
  mfaEnabled?: boolean;
  createdAt: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; mfaRequired?: boolean; mfaSetupRequired?: boolean; challengeToken?: string; error?: string }>;
  verifyMfa: (challengeToken: string, code: string) => Promise<{ success: boolean; error?: string }>;
  beginMfaSetup: (setupToken: string) => Promise<{ data?: MfaSetupData; error?: string }>;
  completeMfaSetup: (setupToken: string, setup: MfaSetupData, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
  login: async () => ({ success: false }),
  verifyMfa: async () => ({ success: false }),
  beginMfaSetup: async () => ({}),
  completeMfaSetup: async () => ({ success: false }),
  logout: () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshProfile = async () => {
    const res = await adminFetch<AdminUser>('/api/admin/auth/me');
    if (res.ok && res.data) {
      setAdmin(res.data);
      saveUser(res.data);
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
  }, []);

  useEffect(() => {
    if (!loading) {
      const isLogin = pathname === '/admin/login';
      if (!admin && !isLogin) {
        router.push('/admin/login');
      } else if (admin && isLogin) {
        router.push('/admin/dashboard');
      }
    }
  }, [admin, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await adminFetch<{ token?: string; admin?: AdminUser; mfaRequired?: boolean; challengeToken?: string }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok && res.data) {
      const payload = (res.data as any).data || res.data;
      if (payload.mfaRequired && payload.challengeToken) {
        return {
          success: false,
          mfaRequired: true,
          challengeToken: payload.challengeToken,
        };
      }
      // Correct password, but two-step verification must be set up before any session.
      if (payload.mfaSetupRequired && payload.challengeToken) {
        return {
          success: false,
          mfaSetupRequired: true,
          challengeToken: payload.challengeToken,
        };
      }

      const token = (payload as any).token;
      const adminUser = (payload as any).admin;

      if (token && adminUser) {
        saveSession(token, adminUser);
        setAdmin(adminUser);
        return { success: true };
      }
    }

    return {
      success: false,
      error: res.error?.message || 'Login failed. Please check your credentials.',
    };
  };

  const verifyMfa = async (challengeToken: string, code: string) => {
    const res = await adminFetch<{ token: string; admin: AdminUser }>('/api/admin/auth/verify-mfa', {
      method: 'POST',
      body: JSON.stringify({ challengeToken, code }),
    });

    if (res.ok && res.data) {
      const payload = (res.data as any).data || res.data;
      const token = (payload as any).token;
      const adminUser = (payload as any).admin;

      if (token && adminUser) {
        saveSession(token, adminUser);
        setAdmin(adminUser);
        return { success: true };
      }
    }

    return {
      success: false,
      error: res.error?.message || 'Invalid two-factor authentication code.',
    };
  };

  const beginMfaSetup = async (setupToken: string) => {
    const res = await adminFetch<MfaSetupData>('/api/admin/auth/mfa/setup-challenge', {
      method: 'POST',
      body: JSON.stringify({ challengeToken: setupToken }),
    });
    const payload: any = res.ok && res.data ? (res.data as any).data || res.data : null;
    if (payload?.secret && payload?.qrCodeUri) {
      return { data: { secret: payload.secret, qrCodeUri: payload.qrCodeUri, recoveryCodes: payload.recoveryCodes ?? [] } };
    }
    return { error: res.error?.message || 'Could not start two-step verification setup. Please sign in again.' };
  };

  const completeMfaSetup = async (setupToken: string, setup: MfaSetupData, code: string) => {
    const res = await adminFetch<{ token: string; admin: AdminUser }>('/api/admin/auth/mfa/complete-setup', {
      method: 'POST',
      body: JSON.stringify({ challengeToken: setupToken, secret: setup.secret, code, recoveryCodes: setup.recoveryCodes }),
    });
    const payload: any = res.ok && res.data ? (res.data as any).data || res.data : null;
    if (payload?.token && payload?.admin) {
      saveSession(payload.token, payload.admin);
      setAdmin(payload.admin);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'That code did not match. Check your authenticator app and try again.' };
  };

  const logout = () => {
    adminFetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
    clearSession();
    setAdmin(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, verifyMfa, beginMfaSetup, completeMfaSetup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AuthContext);

