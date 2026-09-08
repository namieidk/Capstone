"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import { SidebarContext } from "@/components/SidebarContext";
import { GlobalStyles, s } from "@/components/StudentShared";
import { SidebarProvider, useSidebar as useShadcnSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

function SidebarBridge({ children }: { children: React.ReactNode }) {
  const { openMobile, toggleSidebar, setOpenMobile } = useShadcnSidebar();
  return (
    <SidebarContext.Provider
      value={{
        mobileOpen: openMobile,
        toggleMobile: toggleSidebar,
        closeMobile: () => setOpenMobile(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarBridge>
        <ApplicantRoleGuard>
          <div className="vd w-full min-w-0">
            <GlobalStyles />
            <div className="vd-app-shell">
              {/* biome-ignore lint/a11y/useValidAriaRole: `role` here is AppSidebar's menu-role prop (admin|applicant), not an ARIA role */}
              <AppSidebar role="applicant" />

              <main className="vd-main" style={s.main}>
                {children}
              </main>
            </div>
          </div>
        </ApplicantRoleGuard>
      </SidebarBridge>
    </SidebarProvider>
  );
}

function ApplicantRoleGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user && user.role === "SCHOLAR") router.replace("/scholardashboard");
  }, [user, loading, router]);
  return <>{children}</>;
}
