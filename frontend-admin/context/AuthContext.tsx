'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const TOKEN_KEY = 'brew-reserve-admin-token';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    setToken(stored);
    setHydrated(true);
  }, []);

  function login(newToken: string) {
    window.localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    router.push('/login');
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token],
  );

  if (!hydrated) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
