"use client";

import type React from "react";
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import { RoleGuard } from "@/components/RoleGuard";
import { GlobalStyles, s } from "@/components/ScholarShared";
import { SidebarContext } from "@/components/SidebarContext";
import { SidebarInset, SidebarProvider, useSidebar as useShadcnSidebar } from "@/components/ui/sidebar";

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
    <RoleGuard allowedRoles={["SCHOLAR"]}>
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
    </RoleGuard>
  );
}
