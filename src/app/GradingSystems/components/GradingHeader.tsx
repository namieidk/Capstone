"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GradingHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

export function GradingHeader({ searchQuery, onSearchChange, onAdd }: GradingHeaderProps) {
  return (
    <PageHeader
      title="Grading Systems"
      subtitle="School grading scales used for scholarship evaluation."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search grading systems..."
      actions={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" onClick={onAdd} size="icon" className="h-9 w-9 rounded-full">
              <Plus className="size-4" />
              <span className="sr-only">Add grading system</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add grading system</TooltipContent>
        </Tooltip>
      }
    />
  );
}
