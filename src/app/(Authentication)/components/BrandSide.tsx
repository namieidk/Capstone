import Image from "next/image";
import type { AuthMode } from "./ModeTabs";

interface BrandSideProps {
  mode: AuthMode;
}

const COPY: Record<AuthMode, { headline: string; sub: string }> = {
  signin: {
    headline: "Find the scholarship\nthat fits you.",
    sub: "Sign in to track your application, message your coordinator, and manage your scholar profile.",
  },
  signup: {
    headline: "Apply for scholarships\nin minutes.",
    sub: "Create your student account to start matching with partner-company scholarships.",
  },
};

export function BrandSide({ mode }: BrandSideProps) {
  const copy = COPY[mode];

  return (
    <aside className="auth-brand-bg relative hidden overflow-hidden lg:block">
      <div aria-hidden="true" className="auth-brand-scatter" />

      <div className="relative flex h-full flex-col px-10 pt-9 pb-0">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-navy/10 bg-white/50 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-navy/70">
          <span className="size-1.5 rounded-full bg-amber" />
          Davao City student portal
        </span>

        <div className="mx-auto mt-8 max-w-sm text-center">
          <h2 className="whitespace-pre-line font-serif text-[1.85rem] leading-[1.15] font-medium tracking-tight text-navy">
            {copy.headline}
          </h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
            {copy.sub}
          </p>
        </div>

        <div className="relative mt-auto flex justify-center">
          <div className="relative w-[185%] max-w-3xl -mb-4">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -top-14 left-0 h-36 w-full"
              viewBox="0 0 560 120"
              fill="none"
            >
              <path d="M78 78 L70 58" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.55" />
              <path d="M92 70 L98 46" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
              <path d="M108 76 L118 56" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
              <circle cx="66" cy="44" r="3" fill="var(--amber)" />
              <rect x="106" y="38" width="6" height="6" rx="1.5" transform="rotate(25 109 41)" fill="var(--navy)" fillOpacity="0.5" />
              <circle cx="120" cy="60" r="2.5" fill="var(--amber)" fillOpacity="0.85" />

              <path d="M262 62 L254 34" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />
              <path d="M280 56 L280 26" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
              <path d="M298 62 L308 36" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
              <circle cx="250" cy="24" r="3" fill="var(--navy)" fillOpacity="0.45" />
              <rect x="276" y="16" width="7" height="7" rx="1.5" transform="rotate(-10 279 19)" fill="var(--amber)" />
              <circle cx="312" cy="28" r="2.5" fill="var(--navy)" fillOpacity="0.5" />
              <path d="M264 20 q6 -8 12 0" stroke="var(--amber)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeOpacity="0.7" />

              <path d="M448 78 L440 54" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
              <path d="M462 70 L468 44" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
              <path d="M478 76 L490 58" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.55" />
              <circle cx="436" cy="50" r="2.5" fill="var(--amber)" fillOpacity="0.8" />
              <rect x="474" y="38" width="6" height="6" rx="1.5" transform="rotate(15 477 41)" fill="var(--navy)" fillOpacity="0.45" />
              <circle cx="492" cy="52" r="3" fill="var(--amber)" />
            </svg>

            <Image
              src="/toga.png"
              alt="Graduates celebrating with diplomas"
              width={560}
              height={360}
              unoptimized
              className="relative h-auto w-full object-contain"
            />
          </div>
        </div>

        <div aria-hidden="true" className="auth-panel-ground" />
      </div>
    </aside>
  );
}