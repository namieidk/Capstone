"use client";

import { PageHeader } from "@/components/PageHeader";

interface CoordinatorMonitorHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CoordinatorMonitorHeader({ searchQuery, onSearchChange }: CoordinatorMonitorHeaderProps) {
  return (
    <PageHeader
      title="Scholar Monitor"
      subtitle="Track scholar standing, curriculum baseline reviews, and grading standards."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search scholar or course..."
    />
  );
}
