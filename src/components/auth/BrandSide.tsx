import { BRAND_STATS } from "./data";
import type { AuthMode } from "./ModeTabs";

interface BrandSideProps {
  mode: AuthMode;
}

const COPY: Record<AuthMode, { headline: string; sub: string }> = {
  signin: {
    headline: "Find the scholarship that fits you.",
    sub: "Sign in to track your application, message your coordinator, and manage your scholar profile.",
  },
  signup: {
    headline: "Apply for scholarships in minutes.",
    sub: "Create your student account to start matching with partner-company scholarships.",
  },
};

export function BrandSide({ mode }: BrandSideProps) {
  const copy = COPY[mode];
  return (
    <aside className="relative hidden overflow-hidden bg-navy lg:block">
      <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-amber/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-amber/10 blur-3xl" />
      <div className="relative flex min-h-svh flex-col p-10">
        <span className="text-[0.78rem] font-bold tracking-[0.14em] text-amber uppercase">
          Davao City · Student Portal
        </span>
        <div className="flex flex-1 items-center">
          <div>
            <h2 className="max-w-[460px] text-[2.5rem] leading-[1.12] font-bold text-white">{copy.headline}</h2>
            <p className="mt-5 max-w-[420px] text-[1rem] leading-[1.75] text-white/70">{copy.sub}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {BRAND_STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xl font-bold text-amber">{stat.value}</p>
              <p className="mt-1 text-[0.78rem] leading-snug text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
