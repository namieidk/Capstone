"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CcgOcrScanningProps {
  fileName?: string | null;
  discarding: boolean;
  onDiscard: () => void;
}

export function CcgOcrScanning({ fileName, discarding, onDiscard }: CcgOcrScanningProps) {
  return (
    <div className="p-8 rounded-2xl border border-teal-200 bg-teal-50/70 text-center space-y-3">
      <Loader2 className="size-8 text-[#0a4f42] animate-spin mx-auto" />
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-navy">Reading Grades & Academic Period...</h4>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Reading course codes, credit units, grades, and semester details from {fileName || "your CCG"}.
          This usually takes a few seconds.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={discarding}
        onClick={onDiscard}
        className="text-xs border-line text-rose-700 hover:bg-rose-50 font-semibold mt-2"
      >
        Cancel & Discard Upload
      </Button>
    </div>
  );
}
