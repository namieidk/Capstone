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
  COORDINATOR,
  AMBER_BG,
  NAVY,
  s,
} from "@/components/Coordinatorshared";

interface CoordinatorSidebarProps {
  mobileOpen: boolean;
}

export function CoordinatorSidebar({ mobileOpen }: CoordinatorSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`vc-sidebar ${mobileOpen ? "is-open" : ""}`} style={s.sidebar}>
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
              {item.badge && <span style={s.sidebarBadge}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={s.sidebarUserCard}>
        <span style={s.sidebarAvatar}>{COORDINATOR.initials}</span>
        <div style={s.sidebarUserInfo}>
          <p style={s.sidebarUserName}>{COORDINATOR.name}</p>
          <p style={s.sidebarUserRole}>Coordinator</p>
        </div>
        <button style={s.sidebarLogoutBtn} title="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

interface CoordinatorTopBarProps {
  onMenuClick: () => void;
  title: string;
  subtitle: string;
}

export function CoordinatorTopBar({ onMenuClick, title, subtitle }: CoordinatorTopBarProps) {
  return (
    <header style={s.topbar}>
      <button className="vc-mobile-toggle" onClick={onMenuClick} style={s.mobileToggle}>
        <MenuIcon />
      </button>
      <div>
        <h1 style={s.topbarGreeting}>{title}</h1>
        <p style={s.topbarSub}>{subtitle}</p>
      </div>
      <div style={s.topbarRight}>
        <div className="vc-topbar-search" style={s.searchBox}>
          <SearchIcon />
          <input placeholder="Search applicants..." style={s.searchInput} />
        </div>
        <button style={s.bellBtn}>
          <BellIcon />
          <span style={s.bellDot} />
        </button>
      </div>
    </header>
  );
}