"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { GlobalStyles, s } from "@/components/ScholarShared";
import { SidebarContext } from "@/components/SidebarContext";
import { ScholarSidebar } from "@/components/scholar/ScholarSidebar";
import { SidebarInset, SidebarProvider, useSidebar as useShadcnSidebar } from "@/components/ui/sidebar";
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

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarBridge>
        <ScholarRoleGuard>
          <div className="vd flex min-h-svh w-full bg-[#FAF8F5]">
            <GlobalStyles />
            <ScholarSidebar />
            <SidebarInset className="flex min-w-0 flex-1 flex-col bg-[#FAF8F5]">
              <main className="vd-main flex-1 overflow-y-auto" style={s.main}>
                {children}
              </main>
            </SidebarInset>
          </div>
        </ScholarRoleGuard>
      </SidebarBridge>
    </SidebarProvider>
  );
}

function ScholarRoleGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user && user.role === "APPLICANT") router.replace("/ApplicantsDashboard");
  }, [user, loading, router]);
  return <>{children}</>;
}
