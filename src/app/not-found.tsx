"use client";

import { Lottie } from "lottie-react";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DASHBOARD_MAP } from "@/app/(Authentication)/components/data";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import searchAnimation from "../../public/lottie_animations/SearchFile.json";

export default function NotFound() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const homeHref = user ? (DASHBOARD_MAP[user.role] ?? "/") : "/";
  const homeLabel = user ? "Go to Dashboard" : "Return to Home";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-[#FAF8F5] p-6 text-foreground selection:bg-amber-bg selection:text-navy">
      {/* Background ambient gradient blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 size-96 rounded-full bg-linear-to-br from-amber/15 via-good-bg/25 to-transparent blur-3xl"
      />

      {/* Header / Brand */}
      <header className="relative z-10 flex w-full max-w-5xl items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy/10">
            <Image
              src="/logo_cropped_2656.png"
              alt="ViaScholar logo"
              width={32}
              height={32}
              unoptimized
              className="size-6 object-contain"
            />
          </span>
          <span className="text-lg font-bold tracking-tight text-navy">
            ViaScholar
          </span>
        </Link>
        <span className="text-xs font-semibold text-muted-foreground/80">
          Status 404
        </span>
      </header>

      {/* Center Card */}
      <main className="relative z-10 my-auto flex w-full max-w-lg flex-col items-center text-center">
        {/* Lottie Animation Display */}
        <div className="relative mb-3 flex size-60 items-center justify-center sm:size-72">
          {mounted ? (
            <Lottie
              src={searchAnimation}
              loop={true}
              autoplay={true}
              className="size-full"
            />
          ) : (
            <div className="size-48 animate-pulse rounded-full bg-line/40" />
          )}
        </div>

        {/* 404 Badge */}
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber-bg px-3.5 py-1 text-[0.76rem] font-bold tracking-wider text-[#8A6410] uppercase shadow-2xs">
          Page Not Found
        </span>

        {/* Heading & Details */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl">
          Searching in vain…
        </h1>
        <p className="mb-8 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground sm:text-[0.98rem]">
          We searched through the records, but the page or document you&apos;re
          looking for couldn&apos;t be found. It may have been moved or removed.
        </p>

        {/* Action Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 w-full rounded-full bg-navy px-6 text-[0.92rem] font-semibold text-white shadow-xs transition-all hover:bg-navy/90 sm:w-auto"
          >
            <Link
              href={homeHref}
              className="flex items-center justify-center gap-2"
            >
              <Home className="size-4" />
              <span>{homeLabel}</span>
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-11 w-full rounded-full border-line bg-white/80 px-6 text-[0.92rem] font-semibold text-navy transition-all hover:bg-tint sm:w-auto"
          >
            <ArrowLeft className="size-4 mr-2" />
            <span>Go Back</span>
          </Button>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 py-4 text-center text-xs text-muted-foreground">
        Need assistance? Contact your ViaScholar coordinator.
      </footer>
    </div>
  );
}
