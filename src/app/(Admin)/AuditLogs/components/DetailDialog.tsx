"use client";

import { FileText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import type { AuditLogEntry as AuditLog } from "@/lib/api/users";
import {
  formatActionLabel,
  formatDateTime,
  getActionVariant,
  getDisplayName,
  getRoleVariant,
} from "./audit-helpers";

interface DetailDialogProps {
  log: AuditLog | null;
  onClose: () => void;
}

const SECTION_LABEL =
  "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80";

function InfoCard({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border/70 bg-card px-4 py-3.5 ${span ? "col-span-2" : ""}`}
    >
      <p className="text-left text-[11px] font-medium text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 truncate text-sm font-medium text-foreground ${span ? "" : "text-center"}`}
      >
        {value}
      </p>
    </div>
  );
}

export function DetailDialog({ log, onClose }: DetailDialogProps) {
  return (
    <Sheet open={!!log} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg! overflow-y-auto p-0"
        showCloseButton={false}
      >
        {log && (
          <div className="space-y-7 px-6 py-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-6" />
                </span>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-base font-semibold leading-tight text-foreground">
                    Log #{log.log_id} — {formatActionLabel(log.action)}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
              </div>

              <SheetClose asChild>
                <button
                  type="button"
                  className="shrink-0 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4.5" />
                </button>
              </SheetClose>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={getActionVariant(log.action)}
                className="h-6 rounded-full px-2.5 text-xs! font-medium"
              >
                {formatActionLabel(log.action)}
              </Badge>
              <Badge
                variant={getRoleVariant(log.user.role)}
                className="h-6 rounded-full px-2.5 text-xs! font-medium"
              >
                {log.user.role}
              </Badge>
            </div>

            {/* Event Info */}
            <div className="space-y-3">
              <p className={SECTION_LABEL}>Event Information</p>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="User" value={getDisplayName(log)} />
                <InfoCard label="User ID" value={String(log.user_id)} />
                <InfoCard label="Email" value={log.user.email} span />
                <InfoCard label="Timestamp (UTC)" value={log.created_at} span />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <p className={SECTION_LABEL}>Details</p>
              <p className="rounded-xl border border-border/70 bg-card p-4 text-sm leading-relaxed text-foreground wrap-break-word">
                {log.details}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
