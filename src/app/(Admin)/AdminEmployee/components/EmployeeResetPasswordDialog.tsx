"use client";

import { KeyRound, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import { PasswordChecklist } from "@/app/(Authentication)/components/PasswordChecklist";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPasswordError } from "@/lib/validation";
import type { StaffRow } from "./employee-helpers";

interface EmployeeResetPasswordDialogProps {
  employee: StaffRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDirectReset: (employeeId: number, newPass: string) => Promise<void>;
  onSendResetEmail: (email: string) => Promise<void>;
  acting: boolean;
  actionError: string;
}

export function EmployeeResetPasswordDialog({
  employee,
  open,
  onOpenChange,
  onDirectReset,
  onSendResetEmail,
  acting,
  actionError,
}: EmployeeResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState<"DIRECT" | "EMAIL" | null>(null);

  if (!employee) return null;

  const handleOpenDirectConfirm = (e: FormEvent) => {
    e.preventDefault();
    const err = getPasswordError(newPassword);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    setPendingAction("DIRECT");
    setShowConfirmAlert(true);
  };

  const handleOpenEmailConfirm = () => {
    setLocalError("");
    setPendingAction("EMAIL");
    setShowConfirmAlert(true);
  };

  const handleConfirmAction = async () => {
    setShowConfirmAlert(false);
    if (pendingAction === "DIRECT") {
      await onDirectReset(employee.id, newPassword);
      setNewPassword("");
      onOpenChange(false);
    } else if (pendingAction === "EMAIL") {
      await onSendResetEmail(employee.email);
      setEmailSent(true);
    }
    setPendingAction(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) {
            setNewPassword("");
            setLocalError("");
            setEmailSent(false);
          }
          onOpenChange(v);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="size-5" />
              </span>
              <div>
                <DialogTitle className="text-base font-semibold">Reset Password</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground pt-0.5">
                  Manage login credentials for <strong>{employee.name}</strong> ({employee.type})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {emailSent ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center space-y-2">
              <Mail className="size-6 text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-emerald-700">Password Reset Email Dispatched</p>
              <p className="text-[11px] text-muted-foreground">
                A secure password reset link has been sent to <strong>{employee.email}</strong>.
              </p>
              <div className="pt-2">
                <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Option 1: Send Reset Link via Email */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Send Reset Link via Email</p>
                    <p className="text-[11px] text-muted-foreground">
                      Sends a secure 30-minute self-service password reset email.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs shrink-0"
                    onClick={handleOpenEmailConfirm}
                    disabled={acting}
                  >
                    <Mail className="size-3.5 mr-1" />
                    Send Email
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-border w-full" />
                <span className="bg-background px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground absolute">
                  Or Direct Admin Override
                </span>
              </div>

              {/* Option 2: Set New Password Manually */}
              <form onSubmit={handleOpenDirectConfirm} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="emp-new-password" className="text-xs font-semibold">
                    New Temporary Password
                  </Label>
                  <Input
                    id="emp-new-password"
                    type="password"
                    placeholder="Enter temporary password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <div className="mt-2">
                    <PasswordChecklist password={newPassword} />
                  </div>
                </div>

                {(localError || actionError) && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                    {localError || actionError}
                  </div>
                )}

                <DialogFooter className="mt-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    disabled={acting}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={acting || newPassword.trim().length < 8}
                    className="text-xs font-semibold"
                  >
                    {acting ? "Resetting..." : "Set Password"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={showConfirmAlert} onOpenChange={setShowConfirmAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === "EMAIL" ? "Send password reset email?" : "Reset employee password?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "EMAIL"
                ? `A password reset link will be emailed to ${employee.email}. They will be able to choose a new password.`
                : `Are you sure you want to set a new password for ${employee.name}? Their existing password will be overridden immediately.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} disabled={acting}>
              {acting ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
