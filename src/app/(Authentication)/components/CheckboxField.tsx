"use client";

import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps extends ComponentProps<typeof Checkbox> {
  id: string;
  label: ReactNode;
  className?: string;
  labelClassName?: string;
}

export function CheckboxField({ id, label, className, labelClassName, ...props }: CheckboxFieldProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Checkbox id={id} {...props} />
      <Label
        htmlFor={id}
        className={cn(
          "text-[0.8rem] sm:text-[0.88rem] font-medium text-foreground cursor-pointer select-none",
          labelClassName,
        )}
      >
        {label}
      </Label>
    </div>
  );
}
