"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { DASHBOARD_MAP } from "@/app/(Authentication)/components/data";
import { VerifyingPermissionScreen } from "@/components/VerifyingPermissionScreen";
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
    return <VerifyingPermissionScreen />;
  }

  return <>{children}</>;
}
