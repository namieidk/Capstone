"use client";

import { Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/SidebarContext";
import { Button } from "@/components/ui/button";

export function SettingsHeader() {
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
          <h1 className="truncate text-xl font-bold text-navy!">Global Settings</h1>
          <p className="truncate text-sm text-muted-foreground">Platform-wide rules applied to every evaluation.</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
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
