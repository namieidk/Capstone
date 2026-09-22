"use client";

import { PageHeader } from "@/components/PageHeader";

interface EmployeeHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function EmployeeHeader({ searchQuery, onSearchChange }: EmployeeHeaderProps) {
  return (
    <PageHeader
      title="Employee"
      subtitle="Coordinators, HR staff, and partner-company employees on file."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search employees..."
    />
  );
}
