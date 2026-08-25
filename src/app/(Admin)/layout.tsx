"use client";

import React from "react";
import { GlobalStyles, s } from "@/components/Adminshared";
import { AdminSidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";

function LayoutBody({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebar();

  return (
    <div className="va">
      <GlobalStyles />
      <div className="va-app-shell">
        <AdminSidebar mobileOpen={mobileOpen} />

        <main className="va-main" style={s.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutBody>{children}</LayoutBody>
    </SidebarProvider>
  );
}