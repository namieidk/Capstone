"use client";

import { AlertCircle, Loader2, UserCog, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  type EditStaffProfileValues,
  editStaffProfileSchema,
  getZodFieldErrors,
  preventDisallowedNameKey,
  SEX_OPTIONS,
  SUFFIX_OPTIONS,
  sanitizePersonName,
} from "@/lib/validation";

export interface EditProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    suffix?: string;
    sex?: string;
    title?: string;
    department?: string;
    bio?: string;
    phone_number?: string;
  };
  saving?: boolean;
  error?: string;
  onSave: (values: {
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    sex: string;
    title: string;
    department: string;
    bio: string;
  }) => void;
}

const FIELD_INPUT = "mt-1.5 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!";

export default function EditProfileDrawer({
  open,
  onClose,
  initialValues,
  saving = false,
  error,
  onSave,
}: EditProfileDrawerProps) {
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? "");
  const [middleName, setMiddleName] = useState(initialValues?.middle_name ?? "");
  const [lastName, setLastName] = useState(initialValues?.last_name ?? "");
  const [suffix, setSuffix] = useState(initialValues?.suffix ?? "");
  const [sex, setSex] = useState(initialValues?.sex ?? "");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [department, setDepartment] = useState(initialValues?.department ?? "");
  const [bio, setBio] = useState(initialValues?.bio ?? "");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EditStaffProfileValues, string>>>({});

  useEffect(() => {
    if (open) {
      setFirstName(initialValues?.first_name ?? "");
      setMiddleName(initialValues?.middle_name ?? "");
      setLastName(initialValues?.last_name ?? "");
      setSuffix(initialValues?.suffix ?? "");
      setSex(initialValues?.sex ?? "");
      setTitle(initialValues?.title ?? "");
      setDepartment(initialValues?.department ?? "");
      setBio(initialValues?.bio ?? "");
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const clearFieldError = (field: keyof EditStaffProfileValues) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleFirstNameChange = (val: string) => {
    setFirstName(sanitizePersonName(val));
    clearFieldError("first_name");
  };

  const handleMiddleNameChange = (val: string) => {
    setMiddleName(sanitizePersonName(val));
    clearFieldError("middle_name");
  };

  const handleLastNameChange = (val: string) => {
    setLastName(sanitizePersonName(val));
    clearFieldError("last_name");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = editStaffProfileSchema.safeParse({
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      suffix,
      sex,
      title,
      department,
      bio,
    });
    if (!parsed.success) {
      setFieldErrors(getZodFieldErrors<keyof EditStaffProfileValues>(parsed.error.issues));
      return;
    }
    setFieldErrors({});
    onSave({
      first_name: parsed.data.first_name,
      middle_name: parsed.data.middle_name ?? "",
      last_name: parsed.data.last_name,
      suffix: parsed.data.suffix ?? "",
      sex: parsed.data.sex ?? "",
      title: parsed.data.title,
      department: parsed.data.department,
      bio: parsed.data.bio ?? "",
    });
  };

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-110! max-w-[92vw]! gap-0 overflow-y-auto border-line bg-white p-8 text-sm!"
      >
        <div className="flex items-start gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-xs">
            <UserCog className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl! font-bold text-navy!">Edit profile</SheetTitle>
            <SheetDescription className="text-sm!">Update your personal information and biography.</SheetDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-muted-foreground hover:text-navy"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-first-name" className="text-sm! font-semibold text-navy">
                First name <span className="text-amber">*</span>
              </Label>
              <Input
                id="edit-first-name"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                onKeyDown={preventDisallowedNameKey}
                aria-invalid={Boolean(fieldErrors.first_name)}
                className={`${FIELD_INPUT} ${fieldErrors.first_name ? "border-destructive!" : ""}`}
              />
              {fieldErrors.first_name && (
                <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.first_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-last-name" className="text-sm! font-semibold text-navy">
                Last name <span className="text-amber">*</span>
              </Label>
              <Input
                id="edit-last-name"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                onKeyDown={preventDisallowedNameKey}
                aria-invalid={Boolean(fieldErrors.last_name)}
                className={`${FIELD_INPUT} ${fieldErrors.last_name ? "border-destructive!" : ""}`}
              />
              {fieldErrors.last_name && (
                <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="edit-middle-name" className="text-sm! font-semibold text-navy">
              Middle name
            </Label>
            <Input
              id="edit-middle-name"
              placeholder="Optional"
              value={middleName}
              onChange={(e) => handleMiddleNameChange(e.target.value)}
              onKeyDown={preventDisallowedNameKey}
              aria-invalid={Boolean(fieldErrors.middle_name)}
              className={`${FIELD_INPUT} ${fieldErrors.middle_name ? "border-destructive!" : ""}`}
            />
            {fieldErrors.middle_name && (
              <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.middle_name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-suffix" className="text-sm! font-semibold text-navy">
                Suffix
              </Label>
              <Select value={suffix || "__NONE__"} onValueChange={(v) => setSuffix(v === "__NONE__" ? "" : v)}>
                <SelectTrigger id="edit-suffix" className={FIELD_INPUT}>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__">None</SelectItem>
                  {SUFFIX_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-sex" className="text-sm! font-semibold text-navy">
                Sex
              </Label>
              <Select value={sex || "__NONE__"} onValueChange={(v) => setSex(v === "__NONE__" ? "" : v)}>
                <SelectTrigger id="edit-sex" className={FIELD_INPUT}>
                  <SelectValue placeholder="Not specified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__">Not specified</SelectItem>
                  {SEX_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-title" className="text-sm! font-semibold text-navy">
              Title <span className="text-amber">*</span>
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearFieldError("title");
              }}
              placeholder="e.g. System Administrator"
              aria-invalid={Boolean(fieldErrors.title)}
              className={`${FIELD_INPUT} ${fieldErrors.title ? "border-destructive!" : ""}`}
            />
            {fieldErrors.title && <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.title}</p>}
          </div>

          <div>
            <Label htmlFor="edit-department" className="text-sm! font-semibold text-navy">
              Department <span className="text-amber">*</span>
            </Label>
            <Input
              id="edit-department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                clearFieldError("department");
              }}
              placeholder="e.g. IT Department"
              aria-invalid={Boolean(fieldErrors.department)}
              className={`${FIELD_INPUT} ${fieldErrors.department ? "border-destructive!" : ""}`}
            />
            {fieldErrors.department && (
              <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.department}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-bio" className="text-sm! font-semibold text-navy">
              Bio
            </Label>
            <Textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                clearFieldError("bio");
              }}
              placeholder="A brief bio about your role and responsibilities..."
              rows={4}
              aria-invalid={Boolean(fieldErrors.bio)}
              className={`mt-1.5 min-h-24! resize-y border-line bg-[#f7f9fb]! text-sm! md:text-sm! ${fieldErrors.bio ? "border-destructive!" : ""}`}
            />
            {fieldErrors.bio && <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.bio}</p>}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-line pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="h-11 border-line px-5 text-sm font-medium text-navy hover:bg-tint"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-11 bg-navy px-6 text-sm font-medium text-white hover:bg-navy/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
