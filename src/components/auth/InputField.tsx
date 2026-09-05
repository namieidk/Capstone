"use client";

import { cn } from "cn";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  id: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  password?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  className?: string;
}

export function InputField({
  id,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  value,
  onChange,
  password = false,
  showPassword,
  onTogglePassword,
  className,
}: InputFieldProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const isPassword = password && type === "password";
  const visible = showPassword ?? internalVisible;
  const toggle = () => {
    if (onTogglePassword) onTogglePassword();
    else setInternalVisible((v) => !v);
  };

  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} className="text-[0.94rem] font-medium text-navy">
        {label}
      </Label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={id}
          type={isPassword && !visible ? "password" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("h-10 pl-9", isPassword && "pr-9")}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={toggle}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-navy"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-[0.8rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}
