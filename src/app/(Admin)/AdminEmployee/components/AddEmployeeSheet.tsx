"use client";

import { Eye, EyeOff, UserPlus, X } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { PasswordChecklist } from "@/app/(Authentication)/components/PasswordChecklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
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

const FIELD_INPUT = "mt-2 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!";

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm! font-semibold text-navy">
      {children} {required && <span className="text-amber">*</span>}
    </Label>
  );
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
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-110! max-w-[92vw]! gap-0 overflow-y-auto border-line bg-white p-8 text-sm!"
      >
        <div className="flex items-start gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-xs">
            <UserPlus className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl! text-navy!">Add employee</SheetTitle>
            <SheetDescription className="text-sm!">Add a coordinator or grantor account.</SheetDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-5 text-[#9a9a94]" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="add-first-name" required>
                First name
              </FieldLabel>
              <Input
                id="add-first-name"
                value={fields.first_name}
                onChange={(e) => set({ first_name: e.target.value })}
                required
                className={FIELD_INPUT}
              />
            </div>
            <div>
              <FieldLabel htmlFor="add-last-name" required>
                Last name
              </FieldLabel>
              <Input
                id="add-last-name"
                value={fields.last_name}
                onChange={(e) => set({ last_name: e.target.value })}
                required
                className={FIELD_INPUT}
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="add-email" required>
              Email
            </FieldLabel>
            <Input
              id="add-email"
              type="email"
              value={fields.email}
              onChange={(e) => set({ email: e.target.value })}
              required
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <FieldLabel htmlFor="add-password" required>
              Password
            </FieldLabel>
            <div className="relative">
              <Input
                id="add-password"
                type={showPw ? "text" : "password"}
                placeholder="At least 8 characters"
                value={fields.password}
                onChange={(e) => set({ password: e.target.value })}
                required
                className={`${FIELD_INPUT} pr-11`}
              />
              <button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-navy"
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              8+ characters with an uppercase, a lowercase, a number, and a special character.
            </p>
            <div className="mt-2">
              <PasswordChecklist password={fields.password} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="add-role" required>
                Role
              </FieldLabel>
              <Select value={fields.role} onValueChange={(v) => set({ role: v })}>
                <SelectTrigger id="add-role" size="lg" className={FIELD_INPUT} aria-label="Role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COORDINATOR" className="text-sm!">
                    Coordinator
                  </SelectItem>
                  <SelectItem value="GRANTOR" className="text-sm!">
                    Grantor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="add-department">Department</FieldLabel>
              <Input
                id="add-department"
                value={fields.department}
                onChange={(e) => set({ department: e.target.value })}
                className={FIELD_INPUT}
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="add-title">Title</FieldLabel>
            <Input
              id="add-title"
              placeholder="e.g. Scholarship Coordinator"
              value={fields.title}
              onChange={(e) => set({ title: e.target.value })}
              className={FIELD_INPUT}
            />
          </div>

          {addError && (
            <div className="rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
              {addError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 text-sm! text-navy"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-6 text-sm!" disabled={adding}>
              {adding ? "Adding..." : "Add employee"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
