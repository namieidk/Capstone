"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { SchoolVerificationCard } from "@/components/coordinator/baseline/SchoolVerificationCard";
import { Button } from "@/components/ui/button";

interface GradingScalesTabProps {
  onScaleUpdated: () => void;
}

export function GradingScalesTab({ onScaleUpdated }: GradingScalesTabProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Review and verify school grading scale configurations used in academic baseline calculations.
        </p>
        <Link href="/GradingSystems">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-navy border-line">
            <ExternalLink className="size-3.5" />
            Manage all grading systems
          </Button>
        </Link>
      </div>
      <SchoolVerificationCard onScaleUpdated={onScaleUpdated} />
    </div>
  );
}
