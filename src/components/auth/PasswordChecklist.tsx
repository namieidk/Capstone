"use client";

import { cn } from "cn";
import { CheckCircle2, Circle } from "lucide-react";

interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { id: "length", label: "At least 8 characters", met: password.length >= 8 },
    { id: "upper", label: "1 uppercase letter (A–Z)", met: /[A-Z]/.test(password) },
    { id: "lower", label: "1 lowercase letter (a–z)", met: /[a-z]/.test(password) },
    { id: "number", label: "1 number (0–9)", met: /[0-9]/.test(password) },
    { id: "special", label: "1 special character (!@#…)", met: /[^A-Za-z0-9]/.test(password) },
  ];
}

// Live checklist of the shared password policy. Rendered once the user
// starts typing so the pristine form stays clean.
export function PasswordChecklist({ password }: { password: string }) {
  if (password.length === 0) return null;
  const rules = getPasswordRules(password);

  return (
    <ul className="grid gap-1 rounded-lg bg-tint px-3 py-2.5" aria-live="polite">
      {rules.map((rule) => (
        <li key={rule.id} className="flex items-center gap-2">
          {rule.met ? (
            <CheckCircle2 className="size-4 shrink-0 text-good" aria-hidden="true" />
          ) : (
            <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
          <span className={cn("text-[0.8rem]", rule.met ? "font-medium text-good" : "text-muted-foreground")}>
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
