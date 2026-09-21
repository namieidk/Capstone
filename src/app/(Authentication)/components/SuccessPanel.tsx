"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SuccessPanelProps {
  title: string;
  message: ReactNode;
  roleLabel: string;
  continueHref: string;
  continueLabel?: string;
}

export function SuccessPanel({
  title,
  message,
  roleLabel,
  continueHref,
  continueLabel = "Continue to dashboard",
}: SuccessPanelProps) {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-good-bg text-good">
        <CircleCheck className="size-8" />
      </span>
      <h2 className="mt-3 text-xl font-bold text-navy">{title}</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      <span className="mt-1 rounded-full bg-tint px-3 py-1 text-[0.78rem] font-semibold tracking-wide text-navy uppercase">
        {roleLabel}
      </span>
      <div className="mt-4 flex w-full flex-col gap-2">
        <Button
          onClick={() => router.push(continueHref)}
          className="h-11 w-full rounded-full text-[0.96rem] font-semibold"
        >
          {continueLabel} <ArrowRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          type="button"
          className="h-9 text-muted-foreground hover:text-navy"
          onClick={() => logout()}
        >
          Sign in as a different user
        </Button>
      </div>
    </div>
  );
}
