"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GlobalStyles, TITLES, s } from "@/components/AdminShared";
import { AdminSidebar, AdminTopBar } from "@/components/Adminsidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const [title, subtitle] = TITLES[pathname] ?? ["ViaScholar", ""];
  const isWideContent = pathname === "/adminProfile" || pathname === "/adminMessage";

  return (
    <div className="va">
      <GlobalStyles />
      <div className="va-app-shell">
        <AdminSidebar mobileOpen={mobileOpen} />

        <main className="va-main" style={s.main}>
          <AdminTopBar onMenuClick={() => setMobileOpen((v) => !v)} title={title} subtitle={subtitle} />
          <div style={{ ...s.mainContent, padding: isWideContent ? "32px 40px 48px" : s.mainContent.padding }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}