// components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LogoutIcon,
  NAV_ITEMS as adminNav,
  ADMIN,
  s as adminStyles,
} from "@/components/Adminshared";

import {
  NAV_ITEMS as coordinatorNav,
  COORDINATOR,
  s as coordinatorStyles,
} from "@/components/Coordinatorshared";

import {
  NAV_ITEMS as grantorNav,
  GRANTOR,
  s as grantorStyles,
} from "@/components/Grantorshared";

import {
  NAV_ITEMS as scholarNav,
  SCHOLAR,
  s as scholarStyles,
} from "@/components/ScholarShared";

import {
  NAV_ITEMS as studentNav,
  SCHOLAR as studentProfile,
  s as studentStyles,
} from "@/components/StudentShared";

// ============================================================
// SIDEBAR PALETTE — single source of truth for this component's colors.
// Previously AMBER_BG/NAVY were imported from Adminshared alone and reused
// for every role's active-nav highlight (an accidental cross-role
// dependency). Defining the palette locally here fixes that and makes this
// file the one place to touch for sidebar color changes going forward.
//
// This now mirrors the actual ViaScholar mark: navy cap, green figure,
// amber star. Green — not amber — carries the "you are here" state,
// since green is the dominant color in the logo itself. Amber is kept
// down to two jobs only (the logo's star accent, and count badges) so
// it still reads as a highlight instead of a third competing base color.
// ============================================================

const NAVY = "#1E3A5F";
const GREEN = "#0a4f42";
const AMBER = "#F1B71E";
const GREEN_TINT = "#E3F0E8"; // active nav-item background
const WHITE = "#FFFFFF";

type SidebarRole = "admin" | "coordinator" | "grantor" | "scholar" | "student";

type SidebarNavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
};

interface SidebarProps {
  mobileOpen: boolean;
  role?: SidebarRole;
}

type RoleConfig = {
  className: string;
  navItems: SidebarNavItem[];
  profile: typeof ADMIN | typeof COORDINATOR | typeof GRANTOR | typeof SCHOLAR;
  roleLabel: string;
  searchPlaceholder: string;
  styles: typeof adminStyles | typeof coordinatorStyles | typeof grantorStyles | typeof scholarStyles | typeof studentStyles;
};

function getRoleConfig(role: SidebarRole): RoleConfig {
  const normalize = (navItems: Array<{ key: string; label: string; icon: React.ReactNode; href: string; badge?: number }>): SidebarNavItem[] =>
    navItems.map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      href: item.href,
      badge: item.badge,
    }));

  switch (role) {
    case "admin":
      return {
        className: "va-sidebar",
        navItems: normalize(adminNav),
        profile: ADMIN,
        roleLabel: "Main Admin",
        searchPlaceholder: "Search the system...",
        styles: adminStyles,
      };
    case "coordinator":
      return {
        className: "vc-sidebar",
        navItems: normalize(coordinatorNav),
        profile: COORDINATOR,
        roleLabel: "Coordinator",
        searchPlaceholder: "Search applicants...",
        styles: coordinatorStyles,
      };
    case "grantor":
      return {
        className: "vg-sidebar",
        navItems: normalize(grantorNav),
        profile: GRANTOR,
        roleLabel: "Grantor",
        searchPlaceholder: "Search scholars...",
        styles: grantorStyles,
      };
    case "student":
      return {
        className: "vd-sidebar",
        navItems: normalize(studentNav),
        profile: studentProfile,
        roleLabel: "Student",
        searchPlaceholder: "Search...",
        styles: studentStyles,
      };
    case "scholar":
    default:
      return {
        className: "vd-sidebar",
        navItems: normalize(scholarNav),
        profile: SCHOLAR,
        roleLabel: "Scholar",
        searchPlaceholder: "Search...",
        styles: scholarStyles,
      };
  }
}

export function Sidebar({ mobileOpen, role = "scholar" }: SidebarProps) {
  const pathname = usePathname();
  const config = getRoleConfig(role);

  return (
    <aside
      className={`${config.className} ${mobileOpen ? "is-open" : ""}`}
      style={{
        ...config.styles.sidebar,
        background: GREEN,
        borderRight: "1px solid rgba(255,255,255,0.18)",
        // Pin the sidebar to the viewport instead of scrolling with the
        // page: fixed height + sticky positioning at the top, with its own
        // internal flex layout so the logo stays pinned at top and the
        // user card stays pinned at bottom regardless of nav item count.
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          ...config.styles.sidebarLogo,
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 18,
          paddingLeft: 4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 12,
            overflow: "visible",
            flexShrink: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="ViaScholar logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              transform: "scale(1.35)",
              filter: "drop-shadow(0 6px 12px rgba(18,45,39,0.12))",
            }}
          />
        </span>
        <span style={{ ...config.styles.sidebarLogoText, fontSize: "1.2rem", fontWeight: 700, color: WHITE, letterSpacing: "-0.02em" }}>
          ViaScholar
        </span>
      </div>

      {/* Nav list is the only part allowed to scroll, and only if it ever
          overflows the available height — logo and user card never move. */}
      <nav style={{ ...config.styles.sidebarNav, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        {config.navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                ...config.styles.sidebarNavItem,
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
                color: isActive ? WHITE : "rgba(255,255,255,0.82)",
                border: isActive ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
              }}
            >
              <span style={{ ...config.styles.sidebarNavIcon, color: isActive ? WHITE : "rgba(255,255,255,0.8)" }}>{item.icon}</span>
              <span style={config.styles.sidebarNavLabel}>{item.label}</span>
              {item.badge && (
                <span style={{ ...config.styles.sidebarBadge, background: AMBER, color: NAVY }}>{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ ...config.styles.sidebarUserCard, borderTop: "1px solid rgba(255,255,255,0.18)", flexShrink: 0 }}>
        <span style={{ ...config.styles.sidebarAvatar, background: "rgba(255,255,255,0.16)", color: WHITE }}>{config.profile.initials}</span>
        <div style={config.styles.sidebarUserInfo}>
          <p style={{ ...config.styles.sidebarUserName, color: WHITE }}>{config.profile.name}</p>
          <p style={{ ...config.styles.sidebarUserRole, color: "rgba(255,255,255,0.76)" }}>{config.roleLabel}</p>
        </div>
        <button style={{ ...config.styles.sidebarLogoutBtn, color: "rgba(255,255,255,0.8)" }} title="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

export function AdminSidebar(props: Omit<SidebarProps, "role">) {
  return <Sidebar {...props} role="admin" />;
}

export function CoordinatorSidebar(props: Omit<SidebarProps, "role">) {
  return <Sidebar {...props} role="coordinator" />;
}

export function GrantorSidebar(props: Omit<SidebarProps, "role">) {
  return <Sidebar {...props} role="grantor" />;
}

export function ScholarSidebar(props: Omit<SidebarProps, "role">) {
  return <Sidebar {...props} role="scholar" />;
}