"use client";

import * as React from "react";
import { cn } from "cn";

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "muted" | "outline";
  align?: "start" | "end";
}

export function Bubble({
  className,
  variant = "default",
  align = "start",
  ...props
}: BubbleProps) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        "relative w-fit max-w-full rounded-2xl px-4 py-2.5 text-xs leading-relaxed transition-all",
        align === "end" ? "rounded-tr-xs" : "rounded-tl-xs",
        variant === "primary" && "bg-navy text-white shadow-2xs",
        variant === "default" &&
          "bg-white text-navy border border-border/70 shadow-2xs dark:bg-card dark:text-foreground",
        variant === "muted" && "bg-muted/80 text-foreground border border-border/40",
        variant === "outline" && "bg-transparent border border-border text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function BubbleContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="bubble-content"
      className={cn("whitespace-pre-wrap [overflow-wrap:anywhere]", className)}
      {...props}
    />
  );
}

export function BubbleHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="bubble-header"
      className={cn("mb-1 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground", className)}
      {...props}
    />
  );
}

export function BubbleFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="bubble-footer"
      className={cn("mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/80", className)}
      {...props}
    />
  );
}

export function BubbleTyping({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="bubble-typing"
      className={cn(
        "flex items-center gap-1 rounded-2xl rounded-tl-xs border border-border/70 bg-white px-3.5 py-2.5 shadow-2xs dark:bg-card",
        className,
      )}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
      <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.2s]" />
      <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}
