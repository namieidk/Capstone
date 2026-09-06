"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { BAD, BAD_BG } from "@/components/Adminshared";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { StaffRow } from "./employee-helpers";

interface EmployeeSheetProps {
  employee: StaffRow | null;
  onClose: () => void;
  resetOpen: boolean;
  onResetOpenChange: (open: boolean) => void;
  newPassword: string;
  onNewPasswordChange: (value: string) => void;
  acting: boolean;
  actionError: string;
  onResetPassword: () => void;
  onToggleStatus: () => void;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-[#9a9a94]">{label}</p>
      <p className="text-sm font-bold text-navy">{value}</p>
    </div>
  );
}

export function EmployeeSheet({
  employee,
  onClose,
  resetOpen,
  onResetOpenChange,
  newPassword,
  onNewPasswordChange,
  acting,
  actionError,
  onResetPassword,
  onToggleStatus,
}: EmployeeSheetProps) {
  const canConfirmReset = !acting && newPassword.trim().length >= 8;
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  // The page closes the sheet on a successful status change — make sure a
  // lingering confirmation dialog closes with it.
  useEffect(() => {
    if (!employee) setConfirmDeactivate(false);
  }, [employee]);

  return (
    <>
      <Sheet
        open={employee !== null}
        onOpenChange={(open) => !open && onClose()}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-110! max-w-[92vw]! gap-0 overflow-y-auto border-line bg-white p-8 text-sm!"
        >
          {employee && (
            <>
              <div className="flex items-start gap-3.5">
                <Avatar style={{ width: 64, height: 64 }} className="shrink-0">
                  <AvatarFallback className="bg-navy text-xl! font-bold text-white!">
                    {employee.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-xl! text-navy!">
                    {employee.name}
                  </SheetTitle>
                  <SheetDescription className="text-sm!">
                    {employee.title}
                  </SheetDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={onClose}
                  aria-label="Close details"
                >
                  <X className="size-5 text-[#9a9a94]" />
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 rounded-[14px] bg-tint p-5">
                <InfoItem label="Role" value={employee.type} />
                <InfoItem label="Status" value={employee.status} />
                <InfoItem label="Department" value={employee.department} />
                <InfoItem label="Joined" value={employee.joined} />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#9a9a94]">
                Contact
              </p>
              <p className="mt-2 text-sm text-[#2b2b28]">
                <strong>Email:</strong> {employee.email}
              </p>

              {actionError && (
                <div className="mt-4 rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
                  {actionError}
                </div>
              )}

              {resetOpen ? (
                <div className="mt-6">
                  <Label
                    htmlFor="employee-new-password"
                    className="text-sm! font-semibold text-navy"
                  >
                    New password
                  </Label>
                  <Input
                    id="employee-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => onNewPasswordChange(e.target.value)}
                    placeholder="At least 8 characters"
                    className="mt-2 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
                  />
                  <div className="mt-4 flex flex-col gap-2.5">
                    <Button
                      type="button"
                      className="h-11 w-full rounded-full text-sm!"
                      onClick={onResetPassword}
                      disabled={!canConfirmReset}
                    >
                      {acting ? "Resetting..." : "Confirm reset"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full rounded-full text-sm! text-navy"
                      onClick={() => {
                        onResetOpenChange(false);
                        onNewPasswordChange("");
                      }}
                      disabled={acting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-2.5">
                  <Button
                    type="button"
                    className="h-11 w-full rounded-full text-sm!"
                    onClick={() => onResetOpenChange(true)}
                  >
                    Reset password
                  </Button>
                  {employee.user.is_active ? (
                    <Button
                      type="button"
                      className="h-11 w-full rounded-full text-sm!"
                      style={{ background: BAD_BG, color: BAD }}
                      onClick={() => setConfirmDeactivate(true)}
                      disabled={acting}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="h-11 w-full rounded-full text-sm!"
                      onClick={onToggleStatus}
                      disabled={acting}
                    >
                      {acting ? "Updating..." : "Activate"}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog
        open={confirmDeactivate}
        onOpenChange={setConfirmDeactivate}
        title="Deactivate employee?"
        description={
          employee
            ? `${employee.name} will lose access immediately. You can reactivate this account later.`
            : "This employee will lose access immediately."
        }
        confirmLabel="Deactivate"
        acting={acting}
        onConfirm={onToggleStatus}
      />
    </>
  );
}
