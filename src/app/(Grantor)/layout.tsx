"use client";

import React from "react";
import { GlobalStyles, s } from "@/components/Grantorshared";
import { GrantorSidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";

function GrantorLayoutInner({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebar();

  return (
    <div className="vg">
      <GlobalStyles />
      <div className="vg-app-shell">
        <GrantorSidebar mobileOpen={mobileOpen} />
        <main className="vg-main" style={s.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function GrantorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <GrantorLayoutInner>{children}</GrantorLayoutInner>
    </SidebarProvider>
  );
}