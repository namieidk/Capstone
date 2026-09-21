import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { AuditLogEntry as AuditLog } from "@/lib/api/users";
import { formatActionLabel, formatDateTime, getActionVariant, getDisplayName, getRoleVariant } from "./audit-helpers";

interface DetailDialogProps {
  log: AuditLog | null;
  onClose: () => void;
}

export function DetailDialog({ log, onClose }: DetailDialogProps) {
  return (
    <Dialog open={log !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-lg!">
        <DialogHeader>
          <DialogTitle className="text-lg!">
            Log #{log?.log_id} — {log ? formatActionLabel(log.action) : ""}
          </DialogTitle>
          <DialogDescription className="text-sm!">{log ? formatDateTime(log.created_at) : ""}</DialogDescription>
        </DialogHeader>
        {log && (
          <div className="flex flex-col gap-4">
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
        )}
      </DialogContent>
    </Dialog>
  );
}
