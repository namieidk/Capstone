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
  type EditStudentProfileValues,
  editStudentProfileSchema,
  formatPhilippinePhoneNumber,
  getZodFieldErrors,
  preventDisallowedNameKey,
  SEX_OPTIONS,
  SUFFIX_OPTIONS,
  sanitizePersonName,
} from "@/lib/validation";

export interface EditScholarProfileValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  sex: string;
  phone_number: string;
  student_address: string;
  bio: string;
}

export interface EditScholarProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<EditScholarProfileValues>;
  saving?: boolean;
  error?: string;
  onSave: (values: EditScholarProfileValues) => void;
}

const FIELD_INPUT = "mt-1.5 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!";

export function EditScholarProfileDrawer({
  open,
  onClose,
  initialValues,
  saving = false,
  error,
  onSave,
}: EditScholarProfileDrawerProps) {
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? "");
  const [middleName, setMiddleName] = useState(initialValues?.middle_name ?? "");
  const [lastName, setLastName] = useState(initialValues?.last_name ?? "");
  const [suffix, setSuffix] = useState(initialValues?.suffix ?? "");
  const [sex, setSex] = useState(initialValues?.sex ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phone_number ?? "");
  const [studentAddress, setStudentAddress] = useState(initialValues?.student_address ?? "");
  const [bio, setBio] = useState(initialValues?.bio ?? "");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EditStudentProfileValues, string>>>({});

  useEffect(() => {
    if (open) {
      setFirstName(initialValues?.first_name ?? "");
      setMiddleName(initialValues?.middle_name ?? "");
      setLastName(initialValues?.last_name ?? "");
      setSuffix(initialValues?.suffix ?? "");
      setSex(initialValues?.sex ?? "");
      setPhoneNumber(formatPhilippinePhoneNumber(initialValues?.phone_number ?? ""));
      setStudentAddress(initialValues?.student_address ?? "");
      setBio(initialValues?.bio ?? "");
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const clearFieldError = (field: keyof EditStudentProfileValues) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = editStudentProfileSchema.safeParse({
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      suffix,
      sex,
      phone_number: phoneNumber,
      student_address: studentAddress,
      bio,
    });
    if (!parsed.success) {
      setFieldErrors(getZodFieldErrors<keyof EditStudentProfileValues>(parsed.error.issues));
      return;
    }
    setFieldErrors({});
    onSave({
      first_name: parsed.data.first_name,
      middle_name: parsed.data.middle_name ?? "",
      last_name: parsed.data.last_name,
      suffix: parsed.data.suffix ?? "",
      sex: parsed.data.sex ?? "",
      phone_number: parsed.data.phone_number,
      student_address: parsed.data.student_address,
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
            <SheetTitle className="text-xl! font-bold text-navy!">Edit Scholar Profile</SheetTitle>
            <SheetDescription className="text-sm!">Update your contact details and bio.</SheetDescription>
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
              <Label htmlFor="scholar-first-name" className="text-sm! font-semibold text-navy">
                First name <span className="text-amber">*</span>
              </Label>
              <Input
                id="scholar-first-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(sanitizePersonName(e.target.value));
                  clearFieldError("first_name");
                }}
                onKeyDown={preventDisallowedNameKey}
                aria-invalid={Boolean(fieldErrors.first_name)}
                className={`${FIELD_INPUT} ${fieldErrors.first_name ? "border-destructive!" : ""}`}
              />
              {fieldErrors.first_name && (
                <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.first_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="scholar-last-name" className="text-sm! font-semibold text-navy">
                Last name <span className="text-amber">*</span>
              </Label>
              <Input
                id="scholar-last-name"
                value={lastName}
                onChange={(e) => {
                  setLastName(sanitizePersonName(e.target.value));
                  clearFieldError("last_name");
                }}
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
            <Label htmlFor="scholar-middle-name" className="text-sm! font-semibold text-navy">
              Middle name
            </Label>
            <Input
              id="scholar-middle-name"
              placeholder="Optional"
              value={middleName}
              onChange={(e) => {
                setMiddleName(sanitizePersonName(e.target.value));
                clearFieldError("middle_name");
              }}
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
              <Label htmlFor="scholar-suffix" className="text-sm! font-semibold text-navy">
                Suffix
              </Label>
              <Select value={suffix || "__NONE__"} onValueChange={(v) => setSuffix(v === "__NONE__" ? "" : v)}>
                <SelectTrigger id="scholar-suffix" className={FIELD_INPUT}>
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
              <Label htmlFor="scholar-sex" className="text-sm! font-semibold text-navy">
                Sex
              </Label>
              <Select value={sex || "__NONE__"} onValueChange={(v) => setSex(v === "__NONE__" ? "" : v)}>
                <SelectTrigger id="scholar-sex" className={FIELD_INPUT}>
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
            <Label htmlFor="scholar-phone" className="text-sm! font-semibold text-navy">
              Mobile phone number <span className="text-amber">*</span>
            </Label>
            <Input
              id="scholar-phone"
              type="tel"
              placeholder="0917 123 4567"
              maxLength={13}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(formatPhilippinePhoneNumber(e.target.value));
                clearFieldError("phone_number");
              }}
              aria-invalid={Boolean(fieldErrors.phone_number)}
              className={`${FIELD_INPUT} ${fieldErrors.phone_number ? "border-destructive!" : ""}`}
            />
            {fieldErrors.phone_number ? (
              <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.phone_number}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">Philippine mobile format (e.g. 0917 123 4567)</p>
            )}
          </div>

          <div>
            <Label htmlFor="scholar-address" className="text-sm! font-semibold text-navy">
              Permanent residence address <span className="text-amber">*</span>
            </Label>
            <Input
              id="scholar-address"
              placeholder="Street, Barangay, City, Province"
              value={studentAddress}
              onChange={(e) => {
                setStudentAddress(e.target.value);
                clearFieldError("student_address");
              }}
              aria-invalid={Boolean(fieldErrors.student_address)}
              className={`${FIELD_INPUT} ${fieldErrors.student_address ? "border-destructive!" : ""}`}
            />
            {fieldErrors.student_address && (
              <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.student_address}</p>
            )}
          </div>

          <div>
            <Label htmlFor="scholar-bio" className="text-sm! font-semibold text-navy">
              Bio & Personal Statement
            </Label>
            <Textarea
              id="scholar-bio"
              rows={4}
              placeholder="Tell us about yourself, your university track, and scholarship goals..."
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                clearFieldError("bio");
              }}
              aria-invalid={Boolean(fieldErrors.bio)}
              className={`mt-1.5 resize-none border-line bg-[#f7f9fb]! text-sm! ${fieldErrors.bio ? "border-destructive!" : ""}`}
            />
            {fieldErrors.bio && <p className="mt-1 text-xs font-medium text-destructive">{fieldErrors.bio}</p>}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end gap-3 pt-6 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="border-line font-medium text-navy hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2 bg-navy hover:bg-navy/90 text-white font-bold">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
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
