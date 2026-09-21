"use client";

import { Eye, EyeOff, UserPlus } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { PasswordChecklist } from "@/app/(Authentication)/components/PasswordChecklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { AddEmployeeFields } from "./employee-helpers";

interface AddEmployeeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: AddEmployeeFields;
  onFieldsChange: (fields: AddEmployeeFields) => void;
  adding: boolean;
  addError: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function AddEmployeeSheet({
  open,
  onOpenChange,
  fields,
  onFieldsChange,
  adding,
  addError,
  onSubmit,
}: AddEmployeeSheetProps) {
  const set = (patch: Partial<AddEmployeeFields>) => onFieldsChange({ ...fields, ...patch });
  const [showPw, setShowPw] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </span>
            <div>
              <SheetTitle className="text-lg font-semibold">Add Employee</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Create a coordinator or grantor account.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-first-name" className="text-xs font-semibold">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-first-name"
                value={fields.first_name}
                onChange={(e) => set({ first_name: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-last-name" className="text-xs font-semibold">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-last-name"
                value={fields.last_name}
                onChange={(e) => set({ last_name: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-email" className="text-xs font-semibold">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-email"
              type="email"
              value={fields.email}
              onChange={(e) => set({ email: e.target.value })}
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-password" className="text-xs font-semibold">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="add-password"
                type={showPw ? "text" : "password"}
                placeholder="At least 8 characters"
                value={fields.password}
                onChange={(e) => set({ password: e.target.value })}
                required
                className="h-9 pr-9 text-xs"
              />
              <button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              8+ characters with uppercase, lowercase, number, and special character.
            </p>
            <div className="mt-1">
              <PasswordChecklist password={fields.password} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-role" className="text-xs font-semibold">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select value={fields.role} onValueChange={(v) => set({ role: v })}>
                <SelectTrigger id="add-role" className="h-9 text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COORDINATOR" className="text-xs">
                    Coordinator
                  </SelectItem>
                  <SelectItem value="GRANTOR" className="text-xs">
                    Grantor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-department" className="text-xs font-semibold">
                Department
              </Label>
              <Input
                id="add-department"
                value={fields.department}
                onChange={(e) => set({ department: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-title" className="text-xs font-semibold">
              Job Title
            </Label>
            <Input
              id="add-title"
              placeholder="e.g. Scholarship Coordinator"
              value={fields.title}
              onChange={(e) => set({ title: e.target.value })}
              className="h-9 text-xs"
            />
          </div>

          {addError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {addError}
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-4">
            <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="text-xs font-semibold" disabled={adding}>
              {adding ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
