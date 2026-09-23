"use client";

import { AlertCircle, CheckCircle2, Lightbulb, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { AiExplanationResponse } from "@/lib/api/analytics";

interface AiChartExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  loading: boolean;
  explanation: AiExplanationResponse | null;
  error?: string | null;
}

export function AiChartExplanationModal({
  isOpen,
  onClose,
  title,
  category,
  loading,
  explanation,
  error,
}: AiChartExplanationModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md border-l border-line/80 bg-white p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="border-b border-line/60 px-5 py-4 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42]">
              <Sparkles className="size-4" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-sm font-bold text-[#14213a] flex items-center gap-2">
                <span>What does this mean?</span>
                <Badge className="rounded-full bg-[#ddeee3] text-[#0a4f42] text-[9px] font-semibold border-none">
                  AI Insight
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-[11px] text-muted-foreground">
                Explaining <strong className="text-[#14213a]">{category || title}</strong>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="size-9 animate-spin rounded-full border-3 border-[#0a4f42] border-t-transparent" />
              <p className="text-xs font-semibold text-[#14213a]">Analyzing your data...</p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Generating a plain-language explanation of what the numbers mean for your program.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold">Unable to generate explanation</p>
                <p className="mt-0.5 text-[11px] text-rose-700">{error}</p>
              </div>
            </div>
          ) : explanation ? (
            <div className="space-y-5 text-xs">
              {/* Summary */}
              <div className="rounded-xl border border-[#0a4f42]/20 bg-[#FAF8F5] p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#0a4f42] text-xs">
                  <TrendingUp className="size-3.5" />
                  <span>Summary</span>
                </div>
                <p className="text-[#14213a] leading-relaxed text-[12px]">{explanation.summary}</p>
              </div>

              {/* What the Numbers Mean */}
              <div className="rounded-xl border border-line/70 bg-white p-4 space-y-1.5 shadow-2xs">
                <p className="font-bold text-[#14213a] text-xs">What the numbers mean</p>
                <p className="text-muted-foreground leading-relaxed text-[11.5px]">
                  {explanation.statisticalInterpretation}
                </p>
              </div>

              {/* Key Takeaways */}
              {explanation.keyHighlights?.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-[#14213a] text-xs">Key takeaways</p>
                  <div className="space-y-1.5">
                    {explanation.keyHighlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-2 rounded-lg border border-line/60 bg-[#FAF8F5] p-2.5 text-[11px] font-medium text-[#14213a]"
                      >
                        <CheckCircle2 className="size-3.5 text-[#0a4f42] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What You Can Do */}
              {explanation.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#8a6410] text-xs">
                    <Lightbulb className="size-3.5 text-[#f1b71e]" />
                    <span>What you can do</span>
                  </div>
                  <div className="space-y-1.5">
                    {explanation.recommendations.map((rec, idx) => (
                      <div
                        key={rec}
                        className="flex items-start gap-2.5 rounded-lg border border-[#f1b71e]/30 bg-[#fceec4]/30 p-3 text-[11.5px] text-[#5a420b]"
                      >
                        <span className="font-bold text-[#8a6410] shrink-0">{idx + 1}.</span>
                        <p className="leading-snug">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
