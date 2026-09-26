"use client";

import { Activity, ArrowRight, ScrollText } from "lucide-react";
import Link from "next/link";
import { formatActionLabel, getActionColors, getDisplayName } from "@/app/(Admin)/AuditLogs/components/audit-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AuditLogEntry } from "@/lib/api/users";

interface AdminRecentAuditFeedProps {
  logs: AuditLogEntry[];
}

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "Recently";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "Recently";
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export function AdminRecentAuditFeed({ logs }: AdminRecentAuditFeedProps) {
  return (
    <Card className="rounded-[16px]! border-line bg-white shadow-va-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden sm:flex size-7 items-center justify-center rounded-lg bg-[#ddeee3] text-[#0a4f42] shrink-0">
              <Activity className="size-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-bold text-foreground truncate">Live System Activity Stream</h3>
              <p className="text-xs text-muted-foreground truncate sm:whitespace-normal">
                Real-time security and operational events logged across the organization.
              </p>
            </div>
          </div>
          <Link href="/AuditLogs" className="shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#0a4f42] hover:bg-[#0a4f42]/10 gap-1.5 h-8 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="mt-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-115 sm:min-w-0 divide-y divide-line">
            {logs.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                <ScrollText className="size-7 mx-auto mb-1.5 text-muted-foreground/50" />
                No recent audit activity recorded.
              </div>
            ) : (
              logs.map((log) => {
                const { background, color } = getActionColors(log.action);
                const displayName = getDisplayName(log);
                const timeString = formatRelativeTime(log.created_at);
                return (
                  <div
                    key={log.log_id}
                    className="py-2.5 flex items-center justify-between gap-3 -mx-2 px-2 rounded-lg hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Equal Size Action Badge */}
                      <span
                        className="w-32 sm:w-36 text-center justify-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight shrink-0 truncate"
                        style={{ background, color }}
                        title={formatActionLabel(log.action)}
                      >
                        {formatActionLabel(log.action)}
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs text-foreground font-medium truncate">{log.details}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                          <span className="font-semibold text-slate-700 truncate">{displayName}</span>
                          <span>•</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            {log.user?.role || "SYSTEM"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right pl-2">
                      <span className="text-[11px] text-muted-foreground font-medium block tabular-nums">
                        {timeString}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
