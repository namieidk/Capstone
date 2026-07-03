"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GlobalStyles, TITLES, s } from "@/components/Coordinatorshared";
import { CoordinatorSidebar, CoordinatorTopBar } from "@/components/Coordinatorsidebar";

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const [title, subtitle] = TITLES[pathname] ?? ["ViaScholar", ""];
  const isWideContent = pathname === "/coorProfile" || pathname === "/coorMessage";

  return (
    <div className="vc">
      <GlobalStyles />
      <div className="vc-app-shell">
        <CoordinatorSidebar mobileOpen={mobileOpen} />

        <main className="vc-main" style={s.main}>
          <CoordinatorTopBar onMenuClick={() => setMobileOpen((v) => !v)} title={title} subtitle={subtitle} />
          <div style={{ ...s.mainContent, padding: isWideContent ? "32px 40px 48px" : s.mainContent.padding }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}