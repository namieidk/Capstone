import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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
    <div className="auth-theme grid min-h-svh lg:h-svh lg:grid-cols-2">
      <BrandSide mode={mode} />

      <main className="auth-form-bg flex min-h-svh flex-col overflow-y-auto px-4 py-8 md:px-8 lg:min-h-0">
        {/* my-auto centers when there's room and keeps the top padding when the form is tall */}
        <div className="my-auto flex w-full flex-col items-center gap-6">
          {/* Logo only on mobile, since the brand panel is hidden there */}
          <Link href="/" className="flex items-center gap-2.5 text-base font-semibold text-navy lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-full bg-amber">
              <Image
                src="/logo_cropped.png"
                alt="ViaScholar logo"
                width={32}
                height={32}
                unoptimized
                className="size-5 object-contain"
              />
            </span>
            ViaScholar
          </Link>

          <div className="w-full max-w-md rounded-[2rem] bg-white px-8 py-9 shadow-va-md ring-1 ring-line/60 md:px-10">
            <div className="text-center">
              <h1 className="font-serif text-[1.85rem] leading-tight font-semibold tracking-tight text-navy md:text-[2rem]">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
