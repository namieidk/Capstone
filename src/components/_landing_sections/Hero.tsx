import type { LucideIcon } from "lucide-react";
import { Activity, ArrowRight, GraduationCap, Percent } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroPhoto } from "./HeroPhoto";
import { Container, Reveal } from "./shared";

interface StatCardProps {
  Icon: LucideIcon;
  number: string;
  label: string;
}

const STATS: StatCardProps[] = [
  { Icon: GraduationCap, number: "4 yrs", label: "Full tenure support" },
  { Icon: Percent, number: "90%", label: "Retention threshold" },
  { Icon: Activity, number: "Real-time", label: "Analytics dashboards" },
];

function StatCard({ Icon, number, label, delay }: StatCardProps & { delay: number }) {
  return (
    <Reveal delay={delay} y={16} className="h-full">
      <div className="flex h-full flex-col rounded-[14px] sm:rounded-[16px] border border-white/15 bg-white/[0.07] p-3 sm:p-4.5 md:p-5 shadow-va-md backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1">
        <span className="mb-2 sm:mb-3 flex size-8 sm:size-9 items-center justify-center rounded-[8px] sm:rounded-[10px] border border-white/15 bg-white/10 text-amber backdrop-blur-sm">
          <Icon className="size-4 sm:size-4.5" />
        </span>
        <p className="mb-1 text-[1.15rem] sm:text-[1.3rem] md:text-[1.4rem] font-bold text-white tracking-tight leading-none">
          {number}
        </p>
        <p className="text-[0.72rem] sm:text-[0.78rem] md:text-[0.82rem] leading-snug text-white/60">{label}</p>
        <div className="mt-auto pt-2.5 sm:pt-3">
          <div className="h-px w-5 sm:w-6 bg-amber/70" />
        </div>
      </div>
    </Reveal>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-160 items-center overflow-hidden bg-navy">
      <HeroPhoto />

      {/* Bottom transition: a clean solid curve rather than a blur — same
          shaped-edge language as the rest of the page, but a single smooth
          arc (not a repeating wave) so it reads as a deliberate close to
          the hero, not a copy of the section dividers below it. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 w-full text-background sm:h-24"
      >
        <path d="M0,90 L0,46 C360,10 1080,86 1440,36 L1440,90 Z" fill="currentColor" />
        <path
          d="M0,46 C360,10 1080,86 1440,36"
          fill="none"
          stroke="var(--color-amber, #f1b71e)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <Container className="relative w-full pt-26 pb-20 sm:pt-28 md:pt-32 md:pb-24">
        <div className="max-w-135">
          <Reveal>
            <div className="mb-4 sm:mb-5 flex items-center gap-2.5 sm:gap-3">
              <span className="h-px w-6 sm:w-8 bg-amber/70" />
              <span className="text-[0.72rem] sm:text-[0.78rem] font-bold uppercase tracking-widest sm:tracking-[0.12em] text-amber">
                CRDC Private Scholarship Program
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mb-5 sm:mb-6 font-serif text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.12] text-white">
              Funding deserving minds.
              <br />
              <span className="text-amber">Tracked</span> with clarity.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mb-6 sm:mb-7 max-w-115 text-[0.95rem] sm:text-[1.05rem] leading-[1.65] text-white/70">
              A scholarship should feel like steady ground under a student&apos;s feet. Clear requirements, a fair
              review, and support that arrives exactly when it&apos;s needed — term after term.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mb-9 sm:mb-11 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Button
                asChild
                className="h-11 w-full sm:w-60 justify-center rounded-full px-6 text-[0.96rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-va-md"
              >
                <Link href="/signup">
                  Start your application <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full sm:w-60 justify-center rounded-full border-white/40 bg-white/5 px-6 text-[0.96rem] font-semibold text-white backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/15"
              >
                <a href="#qualifications">
                  See qualifications <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full">
            {STATS.map((st, i) => (
              <StatCard key={st.label} {...st} delay={320 + i * 90} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
