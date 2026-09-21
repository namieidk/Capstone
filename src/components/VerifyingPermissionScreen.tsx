"use client";

import { Lottie } from "lottie-react";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import searchingAnimation from "../../public/lottie_animations/SearchingFile.json";

interface VerifyingPermissionScreenProps {
  message?: string;
  subMessage?: string;
}

export function VerifyingPermissionScreen({
  message = "Verifying Permissions",
  subMessage = "Validating your security credentials and role access clearance...",
}: VerifyingPermissionScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between bg-[#FAF8F5] p-6 text-foreground select-none overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 size-96 rounded-full bg-linear-to-br from-[#f1b71e]/15 via-[#ddeee3]/30 to-transparent blur-3xl"
      />

      {/* Top Header / Brand */}
      <header className="relative z-10 flex w-full max-w-5xl items-center justify-center pt-2">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo_cropped_2656.png"
            alt="ViaScholar logo"
            width={28}
            height={28}
            unoptimized
            className="size-5 object-contain"
          />
          <span className="text-base font-bold tracking-tight text-[#0a4f42]">
            ViaScholar
          </span>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 my-auto flex w-full max-w-md flex-col items-center text-center px-4">
        {/* Lottie Animation Display */}
        <div className="relative mb-2 flex size-52 sm:size-60 items-center justify-center">
          {mounted ? (
            <Lottie
              src={searchingAnimation}
              loop={true}
              autoplay={true}
              className="size-full"
            />
          ) : (
            <div className="size-44 animate-pulse rounded-full bg-[#dfe4ea]/40" />
          )}
        </div>

        {/* Main Heading */}
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#14213a]">
          {message}
        </h2>

        {/* Subtitle */}
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
          {subMessage}
        </p>

        {/* Animated Progress Bar Indicator */}
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-[#dfe4ea]">
          <div className="h-full w-full bg-linear-to-r from-[#0a4f42] via-[#f1b71e] to-[#0a4f42] animate-[indeterminate_1.5s_infinite_linear]" />
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 text-center pb-2">
        <p className="text-[11px] font-medium text-muted-foreground/80">
          ViaScholar Scholarship Management Platform
        </p>
      </footer>
    </div>
  );
}
