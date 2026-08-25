"use client";

import React from "react";
import { GlobalStyles, s } from "@/components/Coordinatorshared";
import { CoordinatorSidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";

function LayoutBody({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebar();

  return (
    <div className="vc">
      <GlobalStyles />
      <div className="vc-app-shell">
        <CoordinatorSidebar mobileOpen={mobileOpen} />

        <main className="vc-main" style={s.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutBody>{children}</LayoutBody>
    </SidebarProvider>
  );
}