"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GlobalStyles, TITLES, s } from "@/components/Grantorshared";
import { GrantorSidebar, GrantorTopBar } from "@/components/Grantorsidebar";

export default function GrantorLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const [title, subtitle] = TITLES[pathname] ?? ["ViaScholar", ""];
  const isWideContent = pathname === "/grantorProfile" || pathname === "/grantorMessage";

  return (
    <div className="vg">
      <GlobalStyles />
      <div className="vg-app-shell">
        <GrantorSidebar mobileOpen={mobileOpen} />

        <main className="vg-main" style={s.main}>
          <GrantorTopBar onMenuClick={() => setMobileOpen((v) => !v)} title={title} subtitle={subtitle} />
          <div style={{ ...s.mainContent, padding: isWideContent ? "32px 40px 48px" : s.mainContent.padding }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}