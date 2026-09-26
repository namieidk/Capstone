"use client";

import { Building2, KeyRound, Power } from "lucide-react";
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
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
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

function EmployeeSheetBody({
  employee,
  onOpenResetPassword,
  onConfirmToggleStatus,
  acting,
  actionError,
}: {
  employee: StaffRow;
  onOpenResetPassword: () => void;
  onConfirmToggleStatus: () => void;
  acting: boolean;
  actionError: string;
}) {
  return (
    <div className="space-y-6 px-6 pt-3 pb-9 sm:py-7">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 border border-border">
          <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
            {employee.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-base font-semibold leading-tight text-foreground">{employee.name}</p>
          <p className="text-xs text-muted-foreground">{employee.title || employee.type}</p>
        </div>
      </div>

      {/* Consolidated Single Information Card */}
      <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
        <p className={`${SECTION_LABEL} flex items-center gap-1.5`}>
          <Building2 className="size-3.5" />
          Employee Information
        </p>
        <div className="space-y-3.5 divide-y divide-border/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Role</span>
            <span className="text-sm font-semibold text-foreground">{employee.type}</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-muted-foreground">Status</span>
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
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-muted-foreground">Department</span>
            <span className="text-sm font-semibold text-foreground truncate max-w-50">
              {employee.department || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-muted-foreground">Date Joined</span>
            <span className="text-sm font-semibold text-foreground">{employee.joined}</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-muted-foreground">Email Address</span>
            <span className="text-sm font-semibold text-foreground truncate max-w-50">{employee.email}</span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
          {actionError}
        </div>
      )}

      {/* Account Actions - Centered on mobile */}
      <div className="space-y-3">
        <p className={SECTION_LABEL}>Account Actions</p>
        <div className="flex flex-col gap-2.5">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center rounded-xl text-sm font-medium sm:justify-start"
            onClick={onOpenResetPassword}
          >
            <KeyRound className="mr-2.5 size-4 text-primary" />
            Reset Password
          </Button>

          <Button
            type="button"
            variant={employee.user.is_active ? "destructive" : "default"}
            className="h-11 w-full justify-center rounded-xl text-sm font-medium sm:justify-start"
            onClick={onConfirmToggleStatus}
            disabled={acting}
          >
            <Power className="mr-2.5 size-4" />
            {employee.user.is_active ? "Deactivate Account" : "Activate Account"}
          </Button>
        </div>
      </div>
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
  const isMobile = useIsMobile();
  const [cachedEmployee, setCachedEmployee] = useState<StaffRow | null>(employee);
  const [confirmToggleStatus, setConfirmToggleStatus] = useState(false);

  useEffect(() => {
    if (employee) {
      setCachedEmployee(employee);
    } else {
      setConfirmToggleStatus(false);
    }
  }, [employee]);

  const activeEmployee = employee ?? cachedEmployee;

  if (!activeEmployee) return null;

  const confirmationDialog = (
    <AlertDialog open={confirmToggleStatus} onOpenChange={setConfirmToggleStatus}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {activeEmployee.user.is_active ? "Deactivate employee account?" : "Activate employee account?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {activeEmployee.user.is_active
              ? `${activeEmployee.name} will immediately lose access to the portal until reactivated.`
              : `${activeEmployee.name} will regain access to login and manage scholarship workflows.`}
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
              activeEmployee.user.is_active ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            }
          >
            {acting ? "Updating..." : activeEmployee.user.is_active ? "Deactivate" : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={employee !== null} onOpenChange={(open) => !open && onClose()}>
          <DrawerContent className="flex h-[80vh] max-h-[92vh] min-h-[75vh] flex-col p-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <EmployeeSheetBody
                employee={activeEmployee}
                onOpenResetPassword={onOpenResetPassword}
                onConfirmToggleStatus={() => setConfirmToggleStatus(true)}
                acting={acting}
                actionError={actionError}
              />
            </div>
          </DrawerContent>
        </Drawer>
        {confirmationDialog}
      </>
    );
  }

  return (
    <>
      <Sheet open={employee !== null} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
          <EmployeeSheetBody
            employee={activeEmployee}
            onOpenResetPassword={onOpenResetPassword}
            onConfirmToggleStatus={() => setConfirmToggleStatus(true)}
            acting={acting}
            actionError={actionError}
          />
        </SheetContent>
      </Sheet>
      {confirmationDialog}
    </>
  );
}
