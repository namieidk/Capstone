"use client";

import { PageHeader } from "@/components/PageHeader";

interface AuditLogsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AuditLogsHeader({ searchQuery, onSearchChange }: AuditLogsHeaderProps) {
  return (
    <PageHeader
      title="Audit Logs"
      subtitle="System activity across the platform, served live from the backend."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search logs..."
    />
  );
}
