"use client";

// Next Imports
import {
  useMemo,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = process.env.NEXT_PUBLIC_ST_KEY || null;

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!TOKEN_KEY) {
      console.error("Failed to login", {
        reason: "Failed to get token",
      });
      return;
    }
    const stored = window.localStorage.getItem(TOKEN_KEY);
    setToken(stored);
    setHydrated(true);
  }, []);

  function login(newToken: string) {
    if (!TOKEN_KEY) {
      console.error("Failed to login", {
        reason: "Failed to strore token",
      });
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY!);
    setToken(null);
    router.push("/login");
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
