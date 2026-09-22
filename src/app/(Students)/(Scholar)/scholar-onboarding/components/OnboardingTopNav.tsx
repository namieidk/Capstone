"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

export function OnboardingTopNav() {
  const { user, logout } = useAuth();

  const displayName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email : "Scholar";
  const displayInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "SC"
    : "SC";

  return (
    <TooltipProvider delayDuration={150}>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-white/95 px-4 sm:px-8 backdrop-blur-md">
        {/* Left: Landing Page Logo & Name */}
        <div className="flex items-center gap-3">
          <Link href="/scholar-onboarding" className="flex items-center gap-2.5 group">
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-[#F8F4EA] transition-transform group-hover:scale-105 shadow-2xs">
              <Image
                src="/logo_cropped.png"
                alt="ViaScholar logo"
                width={200}
                height={200}
                unoptimized
                className="size-[72%] object-contain"
              />
            </span>
            <span className="text-lg font-bold text-navy">ViaScholar</span>
          </Link>
        </div>

        {/* Center: Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-sm sm:text-base font-bold text-navy tracking-tight">Onboarding</h1>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground hidden xs:block">Academic Baseline Setup</p>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-secondary py-1 pl-1.5 pr-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white shadow-2xs">
              {displayInitials}
            </span>
            <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-semibold text-navy">
              {displayName}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="size-9 rounded-full text-muted-foreground hover:bg-bad-bg hover:text-bad"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Log out</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
