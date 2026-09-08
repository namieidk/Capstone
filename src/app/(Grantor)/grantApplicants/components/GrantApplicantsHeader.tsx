"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useSidebar } from "@/components/SidebarContext";
import { Button } from "@/components/ui/button";

interface GrantApplicantsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function GrantApplicantsHeader({ searchQuery, onSearchChange }: GrantApplicantsHeaderProps) {
  const { toggleMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3.5 md:px-8">
      <div className="flex min-w-0 items-center">
        <Button
          type="button"
          variant="outline"
          className="mr-2 h-11 w-11 shrink-0 md:hidden"
          onClick={toggleMobile}
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-navy!">Applicants</h1>
          <p className="truncate text-sm text-muted-foreground">Review applicants and schedule interviews.</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden h-10 w-[220px] items-center gap-2 rounded-full border border-line bg-tint px-3.5 md:flex">
          <Search className="size-4 shrink-0 text-[#9a9a94]" />
          <input
            type="text"
            placeholder="Search name, track, stage..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-[0.82rem] text-[#2b2b28] outline-none placeholder:text-[#9a9a94]"
            aria-label="Search applicants"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-full bg-tint hover:bg-tint"
          aria-label="Notifications"
        >
          <Bell className="size-4 text-navy" />
          <span className="absolute top-2 right-2 size-[7px] rounded-full border-2 border-tint bg-amber" />
        </Button>
      </div>
    </header>
  );
}
