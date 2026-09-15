"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import { RoleGuard } from "@/components/RoleGuard";
import { GlobalStyles, s } from "@/components/ScholarShared";
import { SidebarContext } from "@/components/SidebarContext";
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
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const isOnboarding = pathname.startsWith("/scholar-onboarding");

  // Automatically route pending onboarding scholars to the wizard
  useEffect(() => {
    if (user?.role !== "SCHOLAR") return;
    const status = user.scholar_profile?.academic_baseline_status;
    const isPendingSetup =
      !status || ["PENDING_SCHOOL_SELECTION", "PENDING_PROSPECTUS", "PENDING_HISTORICAL_CCG"].includes(status);

    if (isPendingSetup && !isOnboarding) {
      router.replace("/scholar-onboarding");
    }
  }, [user, isOnboarding, router]);

  return (
    <RoleGuard allowedRoles={["SCHOLAR"]}>
      {isOnboarding ? (
        <div className="flex min-h-svh w-full flex-col bg-[#FAF8F5]">
          <GlobalStyles />
          <main className="flex-1 w-full">{children}</main>
        </div>
      ) : (
        <SidebarProvider>
          <SidebarBridge>
            <div className="vd flex min-h-svh w-full bg-[#FAF8F5]">
              <GlobalStyles />
              {/* biome-ignore lint/a11y/useValidAriaRole: `role` is AppSidebar menu role */}
              <AppSidebar role="scholar" />
              <SidebarInset className="flex min-w-0 flex-1 flex-col bg-[#FAF8F5]">
                <main className="vd-main flex-1 overflow-y-auto" style={s.main}>
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarBridge>
        </SidebarProvider>
      )}
    </RoleGuard>
  );
}
