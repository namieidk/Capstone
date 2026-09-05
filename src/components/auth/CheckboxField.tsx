"use client";

import { cn } from "cn";
import type { ComponentProps } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps extends ComponentProps<typeof Checkbox> {
  id: string;
  label: string;
  className?: string;
}

export function CheckboxField({ id, label, className, ...props }: CheckboxFieldProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Checkbox id={id} {...props} />
      <Label htmlFor={id} className="text-[0.88rem] font-medium text-foreground">
        {label}
      </Label>
    </div>
  );
}
