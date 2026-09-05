"use client";

import type React from "react";
import { Sidebar } from "../../../components/Sidebar";
import { SidebarProvider, useSidebar } from "../../../components/SidebarContext";
import { GlobalStyles, s } from "../../../components/StudentShared";

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebar();

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <Sidebar mobileOpen={mobileOpen} />

        <main className="vd-main" style={s.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutShell>{children}</LayoutShell>
    </SidebarProvider>
  );
}
