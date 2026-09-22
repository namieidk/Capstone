"use client";

import { FileText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AuditLogEntry as AuditLog } from "@/lib/api/users";
import { formatActionLabel, formatDateTime, getActionVariant, getDisplayName, getRoleVariant } from "./audit-helpers";

interface DetailDialogProps {
  log: AuditLog | null;
  onClose: () => void;
}

export function DetailDialog({ log, onClose }: DetailDialogProps) {
  if (!log) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-50 h-full flex flex-col shadow-2xl overflow-hidden border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white shadow-xs">
              <FileText className="size-4.5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Log #{log.log_id} — {formatActionLabel(log.action)}
              </h2>
              <p className="text-xs text-slate-500">{formatDateTime(log.created_at)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getActionVariant(log.action)} className="h-6 px-2.5 text-xs!">
              {formatActionLabel(log.action)}
            </Badge>
            <Badge variant={getRoleVariant(log.user.role)} className="h-6 px-2.5 text-xs!">
              {log.user.role}
            </Badge>
          </div>

          <Separator />

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="mb-0.5 text-muted-foreground">User</dt>
              <dd className="font-medium break-all">{getDisplayName(log)}</dd>
            </div>
            <div>
              <dt className="mb-0.5 text-muted-foreground">User ID</dt>
              <dd className="font-medium tabular-nums">{log.user_id}</dd>
            </div>
            <div className="col-span-2">
              <dt className="mb-0.5 text-muted-foreground">Email</dt>
              <dd className="font-medium break-all">{log.user.email}</dd>
            </div>
            <div className="col-span-2">
              <dt className="mb-0.5 text-muted-foreground">Timestamp (UTC)</dt>
              <dd className="font-medium break-all tabular-nums">{log.created_at}</dd>
            </div>
          </dl>

          <Separator />

          <div>
            <p className="mb-1.5 text-sm font-medium text-muted-foreground">Details</p>
            <p className="rounded-md bg-muted p-3.5 text-sm leading-relaxed wrap-break-word">{log.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
}