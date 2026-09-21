"use client";

import { ArrowRight, BookOpen, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ScholarCurriculumData } from "@/lib/api/scholar-dashboard";

interface ScholarCurriculumProgressCardProps {
  curriculum: ScholarCurriculumData;
}

export function ScholarCurriculumProgressCard({ curriculum }: ScholarCurriculumProgressCardProps) {
  const remainingUnits = Math.max(0, curriculum.total_units - curriculum.passed_units);

  return (
    <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Academic Prospectus Roadmap</h2>
            <p className="text-xs text-muted-foreground">Degree requirements & credit fulfillment</p>
          </div>
        </div>

        <Badge
          className={`h-5.5 rounded-full px-2.5 text-[11px] font-semibold ${
            curriculum.is_frozen
              ? "border-[#0a4f42]/30 bg-[#ddeee3] text-[#0a4f42]"
              : "border-amber-300 bg-amber-50 text-amber-800"
          }`}
        >
          {curriculum.is_frozen ? (
            <>
              <Lock className="mr-1 size-3" /> Baseline Frozen
            </>
          ) : (
            "Setup In Progress"
          )}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Large Progress bar card */}
        <div className="rounded-xl border border-line/60 bg-[#FAF8F5] p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Curriculum Completion
            </span>
            <span className="text-lg font-bold text-[#0a4f42]">{curriculum.percentage}%</span>
          </div>

          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#dfe4ea]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#0a4f42] via-[#0a4f42] to-[#f1b71e] transition-all duration-700"
              style={{ width: `${curriculum.percentage}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white p-2 border border-line/50">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Cleared</p>
              <p className="text-sm font-bold text-[#0a4f42]">{curriculum.passed_units} Units</p>
            </div>
            <div className="rounded-lg bg-white p-2 border border-line/50">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Remaining</p>
              <p className="text-sm font-bold text-[#14213a]">{remainingUnits} Units</p>
            </div>
            <div className="rounded-lg bg-white p-2 border border-line/50">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Total Program</p>
              <p className="text-sm font-bold text-muted-foreground">{curriculum.total_units} Units</p>
            </div>
          </div>
        </div>

        {/* Informative Checklist Note */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <CheckCircle2 className="size-3.5 text-[#0a4f42]" />
            {curriculum.passed_subjects_count} of {curriculum.total_subjects} subjects credited & passed
          </span>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
          >
            <Link href="/scholarProspectus" className="flex items-center gap-1">
              <span>View Prospectus</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
