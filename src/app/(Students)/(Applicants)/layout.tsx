"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GlobalStyles, MenuIcon, s } from "../../../components/StudentShared";
import { Sidebar, TopBar } from "../../../components/StudentSidebar";

// Routes that should render without the top navbar.
const NO_TOPBAR_ROUTES = ["/applicationss", "/applicantsettings", "/Profile"];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const hideTopbar = NO_TOPBAR_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  return (
    <div className="vd">
      <GlobalStyles />
      <div className="vd-app-shell">
        <Sidebar mobileOpen={mobileOpen} />

        <main className="vd-main" style={s.main}>
          {hideTopbar ? (
            <button
              className="vd-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              style={s.floatingMobileToggle}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
          ) : (
            <TopBar onMenuClick={() => setMobileOpen((v) => !v)} />
          )}
          <div style={{ ...s.mainContent, paddingTop: hideTopbar ? 40 : 0 }}>{children}</div>
        </main>
      </div>
    </div>
  );
}