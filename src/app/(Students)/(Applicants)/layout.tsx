"use client";

import React, { useState } from "react";
import { GlobalStyles, s } from "../../../components/StudentShared";
import { Sidebar, TopBar } from "../../../components/StudentSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <Sidebar mobileOpen={mobileOpen} />

        <main className="vd-main" style={s.main}>
          <TopBar onMenuClick={() => setMobileOpen((v) => !v)} />
          <div style={s.mainContent}>{children}</div>
        </main>
      </div>
    </div>
  );
}