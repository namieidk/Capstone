"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";

interface AuthContextValue {
  user: authApi.User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<authApi.User>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }) => Promise<authApi.User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<authApi.User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<authApi.User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string, remember?: boolean) => {
      const data = await authApi.login(email, password, remember);
      setUser(data.user);
      if (typeof window !== "undefined") {
        if (remember) {
          localStorage.setItem("vls_remember", "true");
        } else {
          localStorage.removeItem("vls_remember");
          sessionStorage.setItem("vls_session_active", "true");
        }
      }
      refreshUser();
      return data.user;
    },
    [refreshUser],
  );

  const register = useCallback(
    async (data: { email: string; password: string; first_name: string; last_name: string; phone_number: string }) => {
      const res = await authApi.register(data);
      setUser(res.user);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("vls_session_active", "true");
      }
      refreshUser();
      return res.user;
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vls_remember");
      sessionStorage.removeItem("vls_session_active");
    }
    await authApi.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
