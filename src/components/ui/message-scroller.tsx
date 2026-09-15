"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

interface MessageScrollerContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  isScrollable: boolean;
  setIsAtBottom: (val: boolean) => void;
  setIsScrollable: (val: boolean) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

export function useMessageScroller() {
  const context = React.useContext(MessageScrollerContext);
  if (!context) {
    throw new Error("useMessageScroller must be used within a MessageScrollerProvider");
  }
  return context;
}

export function MessageScrollerProvider({ children }: { children: React.ReactNode }) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const [isScrollable, setIsScrollable] = React.useState(false);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior,
      });
      setIsAtBottom(true);
    }
  }, []);

  return (
    <MessageScrollerContext.Provider
      value={{
        viewportRef,
        isAtBottom,
        isScrollable,
        setIsAtBottom,
        setIsScrollable,
        scrollToBottom,
      }}
    >
      {children}
    </MessageScrollerContext.Provider>
  );
}

export function MessageScroller({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-scroller"
      className={cn("relative flex h-full w-full flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function MessageScrollerViewport({
  className,
  children,
  onScroll,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(MessageScrollerContext);
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const ref = context?.viewportRef || localRef;

  const updateScrollState = React.useCallback(() => {
    if (!ref.current || !context) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    const scrollable = scrollHeight > clientHeight + 15;
    const atBottom = !scrollable || scrollHeight - scrollTop - clientHeight <= 30;

    context.setIsScrollable(scrollable);
    context.setIsAtBottom(atBottom);
  }, [context, ref]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    updateScrollState();
    onScroll?.(e);
  };

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [ref, updateScrollState]);

  return (
    <div
      ref={ref}
      data-slot="message-scroller-viewport"
      onScroll={handleScroll}
      className={cn("flex-1 overflow-y-auto overscroll-contain", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function MessageScrollerContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-scroller-content"
      className={cn("flex flex-col gap-3 p-4 md:p-6", className)}
      {...props}
    />
  );
}

export function MessageScrollerItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-scroller-item"
      className={cn("w-full transition-opacity duration-200", className)}
      {...props}
    />
  );
}

export function MessageScrollerButton({
  className,
  unreadCount,
  ...props
}: React.ComponentProps<typeof Button> & { unreadCount?: number }) {
  const context = React.useContext(MessageScrollerContext);
  
  if (!context || !context.isScrollable || context.isAtBottom) {
    return null;
  }

  return (
    <Button
      data-slot="message-scroller-button"
      type="button"
      size="icon"
      variant="secondary"
      onClick={() => context.scrollToBottom("smooth")}
      className={cn(
        "absolute bottom-4 right-4 z-20 size-8 rounded-full shadow-md border border-border/80 bg-white/95 text-navy hover:bg-white dark:bg-card dark:text-foreground transition-all duration-200 animate-in fade-in zoom-in-90",
        className,
      )}
      {...props}
    >
      <ArrowDown className="size-4" />
      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy px-1 text-[9px] font-bold text-white">
          {unreadCount}
        </span>
      )}
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}

