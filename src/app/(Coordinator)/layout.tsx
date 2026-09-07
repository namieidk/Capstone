"use client";

import type React from "react";
import { GlobalStyles, s } from "@/components/Coordinatorshared";
import { CoordinatorSidebar } from "@/components/coordinator/CoordinatorSidebar";
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

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarBridge>
        <div className="vc flex min-h-svh w-full bg-[#FAF8F5]">
          <GlobalStyles />
          <CoordinatorSidebar />
          <SidebarInset className="flex min-w-0 flex-1 flex-col bg-[#FAF8F5]">
            <main className="vc-main flex-1 overflow-y-auto" style={s.main}>
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarBridge>
    </SidebarProvider>
  );
}
