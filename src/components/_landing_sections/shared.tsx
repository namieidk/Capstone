"use client";

import { cn } from "cn";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-295 px-6 md:px-8", className)} {...props} />;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 flex items-center gap-2.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-amber">
      <span className="h-px w-6 bg-amber/70" />
      {children}
    </span>
  );
}

export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("mb-5 font-serif text-[2.5rem] font-medium leading-[1.15] text-navy", className)}>
      {children}
    </h2>
  );
}

/**
 * Fades + slides children in the moment they scroll into view. Wrap
 * individual elements (a heading, a card) rather than an entire section so
 * groups of items can stagger via the `delay` prop.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle both ways (instead of disconnecting after the first hit) so
        // the reveal replays every time the element scrolls in or out of
        // view, in either scroll direction.
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out will-change-transform", className)}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

export function SectionGlow({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "warm";
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute -top-32 -left-20 size-96 rounded-full blur-[110px]",
          variant === "warm" ? "bg-amber/25" : "bg-amber/15",
        )}
      />
      <div className="absolute -right-16 -bottom-32 size-96 rounded-full bg-navy/10 blur-[120px]" />
    </div>
  );
}