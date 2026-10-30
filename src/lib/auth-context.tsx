'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    displayName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setAnonymousMode: (anon: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE =
  typeof window !== 'undefined'
    ? '/api/proxy'
    : process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://127.0.0.1:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('safecircle_token');
      const storedUser = localStorage.getItem('safecircle_user');
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
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

        setToken(accessToken);
        setUser(userData);
        localStorage.setItem('safecircle_token', accessToken);
        localStorage.setItem('safecircle_user', JSON.stringify(userData));
        return { success: true };
      } else {
        const errorMsg =
          (typeof data.error?.message === 'string' && data.error.message) ||
          (typeof data.message === 'string' && data.message) ||
          (typeof data.error === 'string' && data.error) ||
          'Invalid email or password. Please verify your credentials.';
        return { success: false, error: errorMsg };
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
  ): Promise<{ success: boolean; error?: string }> => {
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

        if (accessToken) {
          setToken(accessToken);
          localStorage.setItem('safecircle_token', accessToken);
        }
        setUser(userData);
        localStorage.setItem('safecircle_user', JSON.stringify(userData));
        return { success: true };
      } else {
        const errorMsg =
          (typeof data.error?.message === 'string' && data.error.message) ||
          (typeof data.message === 'string' && data.message) ||
          (typeof data.error === 'string' && data.error) ||
          'Registration could not be completed. Please verify your details.';
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Unable to connect to the safety server. Please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('safecircle_token');
    localStorage.removeItem('safecircle_user');
  };

  const setAnonymousMode = (anon: boolean) => {
    if (user) {
      const updated = { ...user, isAnonymous: anon };
      setUser(updated);
      localStorage.setItem('safecircle_user', JSON.stringify(updated));
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
