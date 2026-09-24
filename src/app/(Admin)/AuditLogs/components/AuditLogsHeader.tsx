"use client";

import { type HeaderFilterProps, PageHeader } from "@/components/PageHeader";

interface AuditLogsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter?: HeaderFilterProps;
}

export function AuditLogsHeader({ searchQuery, onSearchChange, filter }: AuditLogsHeaderProps) {
  return (
    <PageHeader
      title="Audit Logs"
      subtitle="System activity across the platform, served live from the backend."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search logs..."
      filter={filter}
    />
  );
}
