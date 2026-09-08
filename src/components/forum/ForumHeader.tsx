"use client";

import { Menu, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ForumHeaderProps {
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleMobile: () => void;
  onStartDiscussion: () => void;
}

export function ForumHeader({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onToggleMobile,
  onStartDiscussion,
}: ForumHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-line bg-white/95 px-4 py-4 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleMobile}
          className="size-9 rounded-lg border-line bg-tint/60 text-navy md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="size-4.5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-navy sm:text-xl">{title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Search Bar & New Thread Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-44 sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-full border-line bg-tint/40 pl-9 pr-8 text-xs placeholder:text-muted-foreground/80 focus-visible:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Button
          type="button"
          onClick={onStartDiscussion}
          className="h-9 gap-1.5 rounded-full bg-navy px-3 text-xs font-semibold text-white shadow-xs hover:bg-navy/90 sm:px-4"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Thread</span>
        </Button>
      </div>
    </header>
  );
}
