"use client";

import { FileSpreadsheet, HelpCircle, Layers, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EnrollmentModeToggleProps {
  isConsolidated: boolean;
  onChange: (consolidated: boolean) => void;
  disabled?: boolean;
}

export function EnrollmentModeToggle({ isConsolidated, onChange, disabled }: EnrollmentModeToggleProps) {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:w-auto">
      <Tabs
        value={isConsolidated ? "consolidated" : "dual"}
        onValueChange={(val) => onChange(val === "consolidated")}
        className="w-full sm:w-auto"
      >
        <TabsList
          className="grid! h-auto! w-full! grid-cols-1! gap-1.5! border border-border/80 bg-muted/60 p-1.5
            sm:h-10! sm:w-auto! sm:grid-cols-2! sm:gap-0! sm:p-1"
        >
          <TabsTrigger
            value="dual"
            disabled={disabled}
            className="h-auto! min-h-9 w-full! gap-2 whitespace-normal! px-3 py-2 text-center text-xs leading-snug font-semibold data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-xs"
          >
            <Layers className="size-3.5 shrink-0" />
            <span>Dual Documents (COR + SOA)</span>
          </TabsTrigger>

          <TabsTrigger
            value="consolidated"
            disabled={disabled}
            className="h-auto! min-h-9 w-full! gap-2 whitespace-normal! px-3 py-2 text-center text-xs leading-snug font-semibold data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-xs"
          >
            <FileSpreadsheet className="size-3.5 shrink-0" />
            <span>Single Consolidated Form</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-emerald-50/60 hover:text-emerald-800 cursor-help"
            >
              <HelpCircle className="size-3.5 shrink-0 text-emerald-700" />
              <span>Which should I choose?</span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            className="max-w-xs space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-100 shadow-xl"
          >
            <p className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Sparkles className="size-3.5" /> Document Submission Guide
            </p>
            <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-200">
              <p>
                <strong className="text-white">Dual Documents:</strong> Choose this if your school gives you a separate
                Certificate of Registration (COR/Form 1) for subjects, and a separate Statement of Account (SOA) for
                tuition.
              </p>
              <p>
                <strong className="text-white">Single Consolidated Form:</strong> Choose this if your school (e.g. UM)
                issues a single Certificate of Matriculation showing both enrolled subjects AND tuition fees on one
                page.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
