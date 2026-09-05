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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <Link
          href="/"
          className="flex w-fit items-center gap-2.5 text-[1.05rem] font-semibold text-navy"
        >
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-[#F8F4EA]">
            <Image
              src="/logo_cropped.png"
              alt="ViaScholar logo"
              width={36}
              height={36}
              unoptimized
              className="size-6 object-contain"
            />
          </span>
          ViaScholar
        </Link>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h1 className="text-[1.75rem] font-bold tracking-tight text-navy">
                {title}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
      <BrandSide mode={mode} />
    </div>
  );
}
