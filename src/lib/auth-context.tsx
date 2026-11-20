'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { REFRESH_TOKEN_KEY } from '@/lib/api-client';
import { apiCache } from '@/lib/api-cache';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isAnonymous?: boolean;
}

export interface AuthResultInfo {
  success: boolean;
  error?: string;
  /** The API's error code, e.g. EMAIL_NOT_VERIFIED, INVALID_CODE. */
  code?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResultInfo>;
  register: (
    displayName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<AuthResultInfo & { requiresEmailVerification?: boolean }>;
  /** Signs in (creating the account on first use) with a Google ID token. */
  loginWithGoogle: (idToken: string) => Promise<AuthResultInfo & { needsProfile?: boolean }>;
  /** Confirms a new account's email with the emailed code, and signs it in. */
  verifyEmail: (email: string, code: string) => Promise<AuthResultInfo>;
  logout: () => void;
  setAnonymousMode: (anon: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PROD_API = 'https://safecircle-api-752721321209.asia-south1.run.app';

const API_BASE =
  typeof window !== 'undefined'
    ? '/api/proxy'
    : process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_API : 'http://127.0.0.1:5000');

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('sabhijude_token');
      const storedUser = localStorage.getItem('sabhijude_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // api-client renews expired tokens and ends dead sessions; keep React state in step with it
  useEffect(() => {
    const onRefreshed = () => setToken(localStorage.getItem('sabhijude_token'));
    const onExpired = () => {
      apiCache.clear();
      setToken(null);
      setUser(null);
    };
    window.addEventListener('sabhijude_token_refreshed', onRefreshed);
    window.addEventListener('sabhijude_auth_expired', onExpired);
    return () => {
      window.removeEventListener('sabhijude_token_refreshed', onRefreshed);
      window.removeEventListener('sabhijude_auth_expired', onExpired);
    };
  }, []);

  const storeRefreshToken = (data: any) => {
    const refreshToken = data.data?.refreshToken || data.data?.refresh_token || data.refreshToken || data.refresh_token;
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  };

  /** Pulls the message and code out of an API error body. */
  const readError = (data: any, fallback: string): AuthResultInfo => ({
    success: false,
    error:
      (typeof data?.error?.message === 'string' && data.error.message) ||
      (typeof data?.message === 'string' && data.message) ||
      (typeof data?.error === 'string' && data.error) ||
      fallback,
    code: typeof data?.error?.code === 'string' ? data.error.code : undefined,
  });

  /** Stores a session returned by verify-email or google, and signs its user in. */
  const adoptSession = (data: any, fallbackEmail: string): boolean => {
    const accessToken = data?.data?.accessToken;
    if (!accessToken) return false;
    const u = data.data.user || {};
    const email = u.email || fallbackEmail;
    const userData: AuthUser = {
      id: u.id?.toString() || u.authId || 'user',
      email,
      displayName: u.displayName || email.split('@')[0],
      phoneNumber: u.phoneNumber || '',
      isAnonymous: false,
    };
    apiCache.clear();
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('sabhijude_token', accessToken);
    storeRefreshToken(data);
    localStorage.setItem('sabhijude_user', JSON.stringify(userData));
    return true;
  };

  const postAuth = async (path: string, body: unknown) => {
    const res = await fetch(`${API_BASE}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const { res, data } = await postAuth('google', { idToken });
      if (!res.ok || !adoptSession(data, '')) {
        return readError(data, 'Google sign-in did not work. Please try again.');
      }
      const u = data.data.user || {};
      // A brand-new Google account has no profile details yet.
      return { success: true, needsProfile: !u.genderId && !u.dob };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unable to connect to the safety server.' };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResultInfo> => {
    try {
      const { res, data } = await postAuth('verify-email', { email: email.trim(), code });
      if (!res.ok || !adoptSession(data, email.trim())) {
        return readError(data, 'That code is wrong or has expired.');
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unable to connect to the safety server.' };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResultInfo> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      const accessToken =
        data.data?.accessToken ||
        data.data?.access_token ||
        data.accessToken ||
        data.access_token ||
        data.data?.token ||
        data.token;

      if (res.ok && accessToken) {
        const userPayload = data.data?.user || data.user || {};
        const userData: AuthUser = {
          id: userPayload.id?.toString() || userPayload.authId || userPayload.auth_id || 'user',
          email: userPayload.email || email.trim(),
          displayName:
            userPayload.displayName ||
            userPayload.display_name ||
            userPayload.name ||
            email.split('@')[0],
          phoneNumber: userPayload.phoneNumber || userPayload.phone_number || '',
          isAnonymous: false,
        };

        // Drop any cached responses from a previous (possibly different) user.
        apiCache.clear();
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem('sabhijude_token', accessToken);
        storeRefreshToken(data);
        localStorage.setItem('sabhijude_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return readError(data, 'Invalid email or password. Please verify your credentials.');
      }
    } catch (err: any) {
      console.error('Error during login verification:', err);
      return { success: false, error: err.message || 'Unable to connect to the safety server. Please try again.' };
    }
  };

  const register = async (
    displayName: string,
    email: string,
    phoneNumber: string,
    password: string
  ): Promise<AuthResultInfo & { requiresEmailVerification?: boolean }> => {
    try {
      const digits = phoneNumber.replace(/\D/g, '');
      const last10 = digits.slice(-10);
      const standardPhone = last10.length === 10 ? `+91${last10}` : phoneNumber.trim();

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          phoneNumber: standardPhone,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // With email confirmation on, the account exists but no session is issued until the
      // emailed code is entered. Nobody is signed in yet.
      if (res.ok && (data.data?.requiresEmailVerification || (data.data && !data.data.accessToken))) {
        return { success: true, requiresEmailVerification: true };
      }

      if (res.ok && (data.data || data.accessToken || data.access_token || data.success)) {
        const accessToken =
          data.data?.accessToken ||
          data.data?.access_token ||
          data.accessToken ||
          data.access_token;
        const userPayload = data.data?.user || data.user || {};
        const userData: AuthUser = {
          id: userPayload.id?.toString() || userPayload.authId || userPayload.auth_id || 'user',
          email: userPayload.email || email.trim(),
          displayName:
            userPayload.displayName ||
            userPayload.display_name ||
            displayName.trim() ||
            email.split('@')[0],
          phoneNumber: userPayload.phoneNumber || userPayload.phone_number || standardPhone,
          isAnonymous: false,
        };

        apiCache.clear();
        if (accessToken) {
          setToken(accessToken);
          localStorage.setItem('sabhijude_token', accessToken);
          storeRefreshToken(data);
        }
        setUser(userData);
        localStorage.setItem('sabhijude_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return readError(data, 'Registration could not be completed. Please verify your details.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Unable to connect to the safety server. Please try again.' };
    }
  };

  const logout = () => {
    // Stop Google from signing this browser straight back in with the same account.
    try {
      (window as any).google?.accounts?.id?.disableAutoSelect?.();
    } catch {
      // Google's script is not loaded; nothing to do.
    }
    apiCache.clear();
    setToken(null);
    setUser(null);
    localStorage.removeItem('sabhijude_token');
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('sabhijude_user');
  };

  const setAnonymousMode = (anon: boolean) => {
    if (user) {
      const updated = { ...user, isAnonymous: anon };
      setUser(updated);
      localStorage.setItem('sabhijude_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        verifyEmail,
        logout,
        setAnonymousMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
