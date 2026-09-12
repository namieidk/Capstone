"use client";

import { BookOpen, Calendar, CheckCircle2, GraduationCap, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CurriculumMetricsSummaryProps {
  courseName?: string | null;
  courseCode?: string | null;
  curriculumYear?: string | null;
  metrics: {
    total_subjects: number;
    total_units: number;
    credited_subjects: number;
    credited_units: number;
    untaken_subjects: number;
    remaining_units: number;
    is_baseline_frozen: boolean;
  };
}

export function CurriculumMetricsSummary({
  courseName,
  courseCode,
  curriculumYear,
  metrics,
}: CurriculumMetricsSummaryProps) {
  const percentage =
    metrics.total_units > 0 ? Math.min(100, Math.round((metrics.credited_units / metrics.total_units) * 100)) : 0;

  return (
    <div className="space-y-3">
      {(courseName || curriculumYear) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-primary" />
              {courseName || "Degree Program"}
            </span>
            {courseCode && (
              <Badge variant="outline" className="text-[11px] font-mono py-0">
                {courseCode}
              </Badge>
            )}
          </div>

          {curriculumYear && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Catalog: <strong>{curriculumYear}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Total Curriculum</span>
              <Layers className="w-4 h-4 text-muted-foreground/70" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground">{metrics.total_units}</span>
              <span className="text-xs text-muted-foreground">units</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Across {metrics.total_subjects} required subjects</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <span>Credited / Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {metrics.credited_units}
              </span>
              <span className="text-xs text-muted-foreground">units</span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{percentage}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Remaining Untaken</span>
              <BookOpen className="w-4 h-4 text-muted-foreground/70" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground">{metrics.remaining_units}</span>
              <span className="text-xs text-muted-foreground">units</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{metrics.untaken_subjects} pending courses</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-primary text-xs font-medium">
              <span>Baseline State</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="text-base font-bold text-foreground truncate mt-1">
              {metrics.is_baseline_frozen ? "Frozen & Verified" : "Draft Checklist"}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {metrics.is_baseline_frozen ? "Locked from modifications" : "Awaiting coordinator audit"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
