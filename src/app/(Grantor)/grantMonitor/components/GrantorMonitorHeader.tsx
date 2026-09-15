"use client";

import { PageHeader } from "@/components/PageHeader";

interface GrantorMonitorHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function GrantorMonitorHeader({ searchQuery, onSearchChange }: GrantorMonitorHeaderProps) {
  return (
    <PageHeader
      title="Scholars"
      subtitle="Scholars funded by your organization and their current standing."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search scholar or course..."
    />
  );
}
