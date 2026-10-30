'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminFetch } from './api';
import { clearSession, getStoredUser, getToken, saveSession, saveUser } from './session';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
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
      const isLogin = pathname === '/org/login';
      if (!admin && !isLogin) {
        router.push('/org/login');
      } else if (admin && isLogin) {
        router.push('/org/dashboard');
      }
    }
  }, [admin, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await adminFetch<{ token: string; admin: AdminUser }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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
      error: res.error?.message || 'Login failed. Please check your credentials.',
    };
  };

  const logout = () => {
    adminFetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
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

