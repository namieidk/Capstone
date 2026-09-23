import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandSide } from "./BrandSide";
import type { AuthMode } from "./ModeTabs";

interface AuthShellProps {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ mode, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="auth-theme auth-page-bg relative min-h-svh lg:h-svh">
      <div className="relative z-10 flex min-h-svh items-center justify-center px-4 py-3 md:px-8 lg:h-full lg:min-h-0 lg:py-4">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-20px_rgba(10,79,66,0.22)] ring-1 ring-navy/5 lg:h-172 lg:max-h-[92svh] lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)]">
          <ScrollArea className="h-full w-full">
            <div className="relative flex min-h-full flex-col px-8 py-5 md:px-12">
              <header className="shrink-0">
                <Link href="/" className="flex w-fit items-center gap-2.5 text-base font-semibold text-navy">
                  <span className="flex size-8 items-center justify-center overflow-hidden rounded-xl bg-[#F8F4EA]">
                    <Image
                      src="/logo_cropped.png"
                      alt="ViaScholar logo"
                      width={32}
                      height={32}
                      unoptimized
                      priority
                      className="size-5 object-contain"
                    />
                  </span>
                  ViaScholar
                </Link>
              </header>

              <div className="mx-auto mt-7 w-full max-w-sm pb-6">
                <div className="mb-4">
                  <span className="mb-2.5 block h-1 w-9 rounded-full bg-amber" />
                  <h1 className="font-serif text-[1.6rem] font-medium tracking-tight text-navy">{title}</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
                </div>
                {children}
              </div>

              <div className="flex-1" />
            </div>
          </ScrollArea>

          <BrandSide mode={mode} />
        </div>
      </div>
    </div>
  );
}
