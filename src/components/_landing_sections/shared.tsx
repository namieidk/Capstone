"use client";

import { cn } from "cn";
import type React from "react";

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-295 px-6 md:px-8", className)} {...props} />;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="block text-[0.78rem] font-bold uppercase tracking-[0.12em] text-amber">{children}</span>;
}

export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("mt-4 mb-5 text-[2.4rem] font-bold leading-[1.18] text-navy", className)}>{children}</h2>;
}
