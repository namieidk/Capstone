"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { DASHBOARD_MAP } from "@/app/(Authentication)/components/data";
import { useAuth } from "@/contexts/AuthContext";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const userRole = user?.role?.toUpperCase();
  const isAuthorized = userRole ? allowedRoles.some((r) => r.toUpperCase() === userRole) : false;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAuthorized) {
      const fallback = DASHBOARD_MAP[user.role.toUpperCase()] ?? "/login";
      router.replace(fallback);
    }
  }, [user, loading, isAuthorized, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-amber border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">Verifying permissions…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
