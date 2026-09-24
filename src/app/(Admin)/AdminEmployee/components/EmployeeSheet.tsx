"use client";

import { KeyRound, Mail, Power } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { StaffRow } from "./employee-helpers";

interface EmployeeSheetProps {
  employee: StaffRow | null;
  onClose: () => void;
  onOpenResetPassword: () => void;
  acting: boolean;
  actionError: string;
  onToggleStatus: () => void;
}

const SECTION_LABEL = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80";

function MetricCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3.5">
      <p className="text-left text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function EmployeeSheet({
  employee,
  onClose,
  onOpenResetPassword,
  acting,
  actionError,
  onToggleStatus,
}: EmployeeSheetProps) {
  const [confirmToggleStatus, setConfirmToggleStatus] = useState(false);

  useEffect(() => {
    if (!employee) setConfirmToggleStatus(false);
  }, [employee]);

  return (
    <>
      <Sheet open={employee !== null} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
          {employee && (
            <div className="space-y-7 px-6 py-7">
              <SheetHeader className="space-y-0">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 border border-border">
                    <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <SheetTitle className="text-base font-semibold leading-tight">{employee.name}</SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">
                      {employee.title || employee.type}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Role">
                  <p className="text-sm font-medium text-foreground">{employee.type}</p>
                </MetricCard>
                <MetricCard label="Status">
                  <Badge
                    className={`gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      employee.status === "Active"
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {employee.status}
                  </Badge>
                </MetricCard>
                <MetricCard label="Department">
                  <p className="text-sm font-medium text-foreground truncate">{employee.department || "—"}</p>
                </MetricCard>
                <MetricCard label="Joined">
                  <p className="text-sm font-medium text-foreground">{employee.joined}</p>
                </MetricCard>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
                <p className={`${SECTION_LABEL} flex items-center gap-1.5`}>
                  <Mail className="size-3.5" />
                  Contact Information
                </p>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium text-foreground">{employee.email}</span>
                </div>
              </div>

              {actionError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
                  {actionError}
                </div>
              )}

              {/* Account Actions */}
              <div className="space-y-3">
                <p className={SECTION_LABEL}>Account Actions</p>
                <div className="flex flex-col gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full justify-start rounded-xl text-sm font-medium"
                    onClick={onOpenResetPassword}
                  >
                    <KeyRound className="size-4 mr-2.5 text-primary" />
                    Reset Password
                  </Button>

                  <Button
                    type="button"
                    variant={employee.user.is_active ? "destructive" : "default"}
                    className="h-11 w-full justify-start rounded-xl text-sm font-medium"
                    onClick={() => setConfirmToggleStatus(true)}
                    disabled={acting}
                  >
                    <Power className="size-4 mr-2.5" />
                    {employee.user.is_active ? "Deactivate Account" : "Activate Account"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Alert Dialog for Status Toggle */}
      <AlertDialog open={confirmToggleStatus} onOpenChange={setConfirmToggleStatus}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {employee?.user.is_active ? "Deactivate employee account?" : "Activate employee account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {employee?.user.is_active
                ? `${employee.name} will immediately lose access to the portal until reactivated.`
                : `${employee?.name} will regain access to login and manage scholarship workflows.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmToggleStatus(false);
                onToggleStatus();
              }}
              disabled={acting}
              className={
                employee?.user.is_active ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
              }
            >
              {acting ? "Updating..." : employee?.user.is_active ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
