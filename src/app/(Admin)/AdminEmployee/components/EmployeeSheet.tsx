"use client";

import { KeyRound, Power } from "lucide-react";
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
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
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6 space-y-6">
          {employee && (
            <>
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="size-14 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <SheetTitle className="text-base font-semibold">{employee.name}</SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">
                      {employee.title || employee.type}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-2.5">
                <InfoCard label="Role" value={employee.type} />
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <p className="text-[11px] font-medium text-muted-foreground">Status</p>
                  <div className="pt-0.5">
                    <Badge
                      variant={employee.status === "Active" ? "default" : "secondary"}
                      className={`text-[10px] px-2 py-0.5 font-medium ${
                        employee.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current mr-1.5" />
                      {employee.status}
                    </Badge>
                  </div>
                </div>
                <InfoCard label="Department" value={employee.department || "—"} />
                <InfoCard label="Joined" value={employee.joined} />
              </div>

              <div className="rounded-lg border border-border bg-card p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </p>
                <div className="text-xs space-y-1">
                  <p className="text-foreground">
                    <span className="text-muted-foreground font-medium">Email: </span>
                    <strong>{employee.email}</strong>
                  </p>
                </div>
              </div>

              {actionError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                  {actionError}
                </div>
              )}

              <div className="space-y-2 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account Actions</p>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-xs font-medium h-9"
                    onClick={onOpenResetPassword}
                  >
                    <KeyRound className="size-3.5 mr-2 text-primary" />
                    Reset Password
                  </Button>

                  <Button
                    type="button"
                    variant={employee.user.is_active ? "destructive" : "default"}
                    className="w-full justify-start text-xs font-medium h-9"
                    onClick={() => setConfirmToggleStatus(true)}
                    disabled={acting}
                  >
                    <Power className="size-3.5 mr-2" />
                    {employee.user.is_active ? "Deactivate Account" : "Activate Account"}
                  </Button>
                </div>
              </div>
            </>
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
