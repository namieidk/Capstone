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
  ADMIN,
  AMBER_BG,
  NAVY,
  s,
} from "@/components/AdminShared";

interface AdminSidebarProps {
  mobileOpen: boolean;
}

export function AdminSidebar({ mobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`va-sidebar ${mobileOpen ? "is-open" : ""}`} style={s.sidebar}>
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
        <span style={s.sidebarAvatar}>{ADMIN.initials}</span>
        <div style={s.sidebarUserInfo}>
          <p style={s.sidebarUserName}>{ADMIN.name}</p>
          <p style={s.sidebarUserRole}>Main Admin</p>
        </div>
        <button style={s.sidebarLogoutBtn} title="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

interface AdminTopBarProps {
  onMenuClick: () => void;
  title: string;
  subtitle: string;
}

export function AdminTopBar({ onMenuClick, title, subtitle }: AdminTopBarProps) {
  return (
    <header style={s.topbar}>
      <button className="va-mobile-toggle" onClick={onMenuClick} style={s.mobileToggle}>
        <MenuIcon />
      </button>
      <div>
        <h1 style={s.topbarGreeting}>{title}</h1>
        <p style={s.topbarSub}>{subtitle}</p>
      </div>
      <div style={s.topbarRight}>
        <div className="va-topbar-search" style={s.searchBox}>
          <SearchIcon />
          <input placeholder="Search the system..." style={s.searchInput} />
        </div>
        <button style={s.bellBtn}>
          <BellIcon />
          <span style={s.bellDot} />
        </button>
      </div>
    </header>
  );
}