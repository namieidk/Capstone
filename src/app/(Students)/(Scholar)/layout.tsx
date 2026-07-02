"use client";

import React, { useState } from "react";
import { GlobalStyles, s } from "@/components/ScholarShared";
import { ScholarSidebar, ScholarTopBar } from "@/components/scholarsidebar";

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <ScholarSidebar mobileOpen={mobileOpen} />

        <main className="vd-main" style={s.main}>
          <ScholarTopBar onMenuClick={() => setMobileOpen((v) => !v)} />
          <div style={s.mainContent}>{children}</div>
        </main>
      </div>
    </div>
  );
}