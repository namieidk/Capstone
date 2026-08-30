"use client";

import React from "react";
import { GlobalStyles, s } from "@/components/ScholarShared";
import { ScholarSidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";

function ScholarLayoutInner({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebar();

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <ScholarSidebar mobileOpen={mobileOpen} />
        <main className="vd-main" style={s.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ScholarLayoutInner>{children}</ScholarLayoutInner>
    </SidebarProvider>
  );
}