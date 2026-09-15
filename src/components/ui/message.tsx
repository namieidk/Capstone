"use client";

import * as React from "react";
import { cn } from "cn";

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
}

export function Message({
  className,
  align = "start",
  ...props
}: MessageProps) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group relative flex w-full flex-col",
        align === "end" ? "items-end" : "items-start",
        className,
      )}
      {...props}
    />
  );
}

export function MessageContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex max-w-[85%] sm:max-w-[75%] md:max-w-[70%] flex-col gap-1 min-w-0",
        className,
      )}
      {...props}
    />
  );
}

export function MessageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex items-center gap-1.5 px-1 text-[11px] font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function MessageFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex items-center gap-1 px-1 text-[10px] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
