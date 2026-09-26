"use client";

import { Plus } from "lucide-react";
import { type HeaderFilterProps, PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  filter?: HeaderFilterProps;
}

export function EmployeeHeader({ searchQuery, onSearchChange, onAdd, filter }: EmployeeHeaderProps) {
  return (
    <PageHeader
      title="Employee"
      subtitle="Coordinators, HR staff, and partner-company employees on file."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search employees..."
      filter={filter}
      actions={
        <Button
          type="button"
          size="icon"
          className="size-9 rounded-full bg-navy text-white shadow-xs hover:bg-navy/90"
          onClick={onAdd}
          aria-label="Add employee"
          title="Add employee"
        >
          <Plus className="size-4" strokeWidth={2.5} />
        </Button>
      }
    />
  );
}
