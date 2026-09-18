"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { ADMIN } from "@/components/Adminshared";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_SIDEBAR_CONFIG } from "./nav-admin";
import { APPLICANT_SIDEBAR_CONFIG } from "./nav-applicant";
import { COORDINATOR_SIDEBAR_CONFIG } from "./nav-coordinator";
import { GRANTOR_SIDEBAR_CONFIG } from "./nav-grantor";
import { SCHOLAR_SIDEBAR_CONFIG } from "./nav-scholar";
import type { SidebarRole } from "./types";
import { useStaffBadges } from "./useStaffBadges";

const ROLE_CONFIG = {
  admin: ADMIN_SIDEBAR_CONFIG,
  applicant: APPLICANT_SIDEBAR_CONFIG,
  coordinator: COORDINATOR_SIDEBAR_CONFIG,
  grantor: GRANTOR_SIDEBAR_CONFIG,
  scholar: SCHOLAR_SIDEBAR_CONFIG,
} as const;

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0] ?? "";
  const l = lastName?.[0] ?? "";
  return (f + l).toUpperCase() || ADMIN.initials || "RC";
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  // Required on purpose: layouts must declare their role so the correct
  // menu renders. There is no default — a forgotten role previously fell
  // back to the wrong menu.
  role: SidebarRole;
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const config = ROLE_CONFIG[role];
  const isStaffRole = role === "admin" || role === "coordinator" || role === "grantor";
  const badges = useStaffBadges({ includeApplicants: isStaffRole, role });

  const displayName = user ? `${user.first_name} ${user.last_name}` : "Guest";
  const displayInitials = user ? getInitials(user.first_name, user.last_name) : "G";

  const isFooterItem = (key: string) => key === "settings" || key === "profile";
  const mainItems = config.items.filter((item) => !item.hidden && !isFooterItem(item.key));
  const footerNavItems = config.items.filter((item) => !item.hidden && isFooterItem(item.key));

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-navy text-white [--sidebar:var(--navy)] [--sidebar-foreground:#ffffff] [--sidebar-border:rgba(255,255,255,0.1)] **:data-[slot=sidebar-inner]:bg-navy **:data-[slot=sidebar-container]:bg-navy **:data-[mobile=true]:bg-navy"
      {...props}
    >
      {/* Sidebar Header: Logo & Branding */}
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link
          href={config.homeHref}
          className="flex items-center gap-2.5 overflow-hidden rounded-lg p-1 transition-colors hover:bg-white/10"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Image
              src="/logo_cropped_2656.png"
              alt="ViaScholar logo"
              width={32}
              height={32}
              unoptimized
              className="size-6 object-contain drop-shadow"
            />
          </span>
          <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
            <span className="text-[1.05rem] font-bold tracking-tight text-white leading-tight">ViaScholar</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content: Main Navigation Items */}
      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== config.homeHref && pathname.startsWith(item.href));
                const itemBadge =
                  item.key === "applicants"
                    ? badges.applicants
                    : item.key === "meeting"
                      ? badges.meetings
                      : item.key === "scholars" || item.key === "monitor"
                        ? badges.scholars
                        : item.key === "disbursements" || item.key === "payments" || item.key === "payment"
                          ? badges.disbursements
                          : item.badge;

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`h-9.5 rounded-lg px-2.5 text-[0.92rem] font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-amber! text-navy! data-[active=true]:bg-amber! data-[active=true]:text-white! hover:bg-amber! hover:text-navy! [--sidebar-accent:var(--amber)] [--sidebar-accent-foreground:var(--navy)] font-semibold shadow-xs"
                          : "text-white/80 hover:bg-white/10! hover:text-white!"
                      }`}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon
                          className={`size-4.5 shrink-0 transition-colors ${isActive ? "text-white!" : "text-white/80"}`}
                        />
                        <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {itemBadge !== undefined && (
                      <SidebarMenuBadge
                        className={`top-1/2! right-2! -translate-y-1/2 font-bold text-[0.7rem] px-1.5 py-0.5 rounded-full group-data-[collapsible=icon]:hidden transition-colors ${
                          itemBadge === "!"
                            ? "bg-amber-400! text-navy! font-black! animate-pulse shadow-xs"
                            : isActive
                              ? "bg-navy! text-white/80!"
                              : "bg-amber text-navy"
                        }`}
                      >
                        {itemBadge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: Profile & Settings Navigation + User Card & Logout */}
      <SidebarFooter className="border-t border-white/10 p-2.5 gap-2">
        {footerNavItems.length > 0 && (
          <SidebarMenu className="gap-1">
            {footerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== config.homeHref && pathname.startsWith(item.href));

              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className={`h-9 rounded-lg px-2.5 text-[0.88rem] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-amber! text-navy! data-[active=true]:bg-amber! data-[active=true]:text-white! hover:bg-amber! hover:text-navy! [--sidebar-accent:var(--amber)] [--sidebar-accent-foreground:var(--navy)] font-semibold shadow-xs"
                        : "text-white/80 hover:bg-white/10! hover:text-white!"
                    }`}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <Icon
                        className={`size-4.5 shrink-0 transition-colors ${isActive ? "text-white!" : "text-white/80"}`}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge !== undefined && (
                    <SidebarMenuBadge
                      className={`top-1/2! right-2! -translate-y-1/2 font-bold text-[0.7rem] px-1.5 py-0.5 rounded-full group-data-[collapsible=icon]:hidden transition-colors ${
                        isActive ? "bg-navy! text-white/80!" : "bg-amber text-navy"
                      }`}
                    >
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}

        <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-2 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <Link
            href={config.profileHref}
            className="flex min-w-0 flex-1 items-center gap-2.5 group-data-[collapsible=icon]:justify-center"
            title="View Profile"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white shadow-inner">
              {displayInitials}
            </span>
            <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-[0.84rem] font-semibold text-white leading-snug">{displayName}</span>
              <span className="truncate text-[0.72rem] text-white/60 leading-tight">{config.roleLabel}</span>
            </div>
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={logout}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white group-data-[collapsible=icon]:hidden"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>

      {/* Expand/Collapse Rail on Desktop */}
      <SidebarRail className="hover:bg-white/10" />
    </Sidebar>
  );
}
