import { cn } from "cn";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type AuthMode = "signin" | "signup";

interface ModeTabsProps {
  active: AuthMode;
}

export function ModeTabs({ active }: ModeTabsProps) {
  const pill = "h-9 rounded-full shadow-none";
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-tint p-1">
      <Button
        asChild
        variant={active === "signin" ? "default" : "ghost"}
        className={cn(pill, active !== "signin" && "text-muted-foreground hover:text-navy")}
      >
        <Link href="/login">Sign in</Link>
      </Button>
      <Button
        asChild
        variant={active === "signup" ? "default" : "ghost"}
        className={cn(pill, active !== "signup" && "text-muted-foreground hover:text-navy")}
      >
        <Link href="/signup">Create account</Link>
      </Button>
    </div>
  );
}
