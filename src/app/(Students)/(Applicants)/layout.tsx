"use client";

import React from "react";
import { GlobalStyles, s } from "../../../components/StudentShared";
import { Sidebar } from "../../../components/Sidebar";
import { SidebarProvider, useSidebar } from "../../../components/SidebarContext";

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebar();

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <Sidebar mobileOpen={mobileOpen} role="student" />

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