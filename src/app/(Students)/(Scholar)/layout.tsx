"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GlobalStyles, MenuIcon, s } from "@/components/ScholarShared";
import { ScholarSidebar, ScholarTopBar } from "@/components/scholarsidebar";

// The topbar (greeting, search, bell) only renders on the dashboard home route.
// Every other scholar page renders without it.
const TOPBAR_ROUTES = ["/scholardashboard"];

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const showTopbar = TOPBAR_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <ScholarSidebar mobileOpen={mobileOpen} />

        <main className="vd-main" style={s.main}>
          {showTopbar ? (
            <ScholarTopBar onMenuClick={() => setMobileOpen((v) => !v)} />
          ) : (
            <button
              className="vd-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              style={s.floatingMobileToggle}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
          )}
          <div style={{ ...s.mainContent, paddingTop: showTopbar ? 0 : 40 }}>{children}</div>
        </main>
      </div>
    </div>
  );
}