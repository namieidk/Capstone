"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GradCapIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  BellIcon,
  NAV_ITEMS,
  SCHOLAR,
  AMBER_BG,
  NAVY,
  s,
} from "@/components/ScholarShared";

interface ScholarSidebarProps {
  mobileOpen: boolean;
}

export function ScholarSidebar({ mobileOpen }: ScholarSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`vd-sidebar ${mobileOpen ? "is-open" : ""}`} style={s.sidebar}>
      <div style={s.sidebarLogo}>
        <span style={s.sidebarLogoMark}>
          <GradCapIcon />
        </span>
        <span style={s.sidebarLogoText}>ViaScholar</span>
      </div>

      <nav style={s.sidebarNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                ...s.sidebarNavItem,
                background: isActive ? AMBER_BG : "transparent",
                color: isActive ? NAVY : "#55554f",
              }}
            >
              <span style={{ ...s.sidebarNavIcon, color: isActive ? NAVY : "#8a8a84" }}>{item.icon}</span>
              <span style={s.sidebarNavLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={s.sidebarUserCard}>
        <span style={s.sidebarAvatar}>{SCHOLAR.initials}</span>
        <div style={s.sidebarUserInfo}>
          <p style={s.sidebarUserName}>{SCHOLAR.name}</p>
          <p style={s.sidebarUserRole}>Scholar</p>
        </div>
        <button style={s.sidebarLogoutBtn} title="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

interface ScholarTopBarProps {
  onMenuClick: () => void;
}

export function ScholarTopBar({ onMenuClick }: ScholarTopBarProps) {
  return (
    <header style={s.topbar}>
      <button className="vd-mobile-toggle" onClick={onMenuClick} style={s.mobileToggle}>
        <MenuIcon />
      </button>
      <div>
        <h1 style={s.topbarGreeting}>Welcome back, {SCHOLAR.name.split(" ")[0]}.</h1>
        <p style={s.topbarSub}>
          {SCHOLAR.course} · {SCHOLAR.year}
        </p>
      </div>
      <div style={s.topbarRight}>
        <div className="vd-topbar-search" style={s.searchBox}>
          <SearchIcon />
          <input placeholder="Search..." style={s.searchInput} />
        </div>
        <button style={s.bellBtn}>
          <BellIcon />
          <span style={s.bellDot} />
        </button>
      </div>
    </header>
  );
}