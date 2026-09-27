import type { LucideIcon } from "lucide-react";
import { Activity, ArrowRight, GraduationCap, Percent } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroPhoto } from "./HeroPhoto";
import { Container, Reveal } from "./shared";

interface StatProps {
  Icon: LucideIcon;
  number: string;
  label: string;
}

const STATS: StatProps[] = [
  { Icon: GraduationCap, number: "4 yrs", label: "Full tenure support" },
  { Icon: Percent, number: "90%", label: "Retention threshold" },
  { Icon: Activity, number: "Real-time", label: "Analytics dashboards" },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-navy">
      <HeroPhoto />

      <Container className="relative z-10 pt-28 pb-24 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32">
        <div className="max-w-[560px]">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 backdrop-blur-sm">
              <GraduationCap className="size-4 text-amber" />
              <span className="text-[0.85rem] font-medium text-white/85">
                CRDC private scholarship program
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mb-6 font-serif text-[clamp(2.5rem,4.4vw,3.9rem)] font-medium leading-[1.1] text-white">
              Your potential
              <br />
              deserves a <span className="text-amber">pathway.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mb-9 max-w-115 text-[1.05rem] leading-[1.65] text-white/70">
              A scholarship should feel like steady ground under a student&apos;s feet. Clear requirements, a fair
              review, and support that arrives exactly when it&apos;s needed — term after term.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mb-12 flex flex-wrap items-center gap-5">
              <Button
                asChild
                className="h-11 rounded-full px-7 text-[0.96rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-va-md"
              >
                <Link href="/signup">
                  Start your application <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* Plain-text stat row, living directly on the panel. */}
          <Reveal delay={320}>
            <div className="flex max-w-115 divide-x divide-white/15">
              {STATS.map((st) => (
                <div key={st.label} className="flex flex-1 flex-col gap-1 pr-5 first:pl-0 last:pr-0 [&:not(:first-child)]:pl-5">
                  <p className="text-[1.3rem] font-bold text-white sm:text-[1.5rem]">{st.number}</p>
                  <p className="text-[0.75rem] leading-tight text-white/55">{st.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>

      {/* Wavy divider into the section below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-px">
        <svg
          className="h-[60px] w-full sm:h-[90px] lg:h-[110px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64 C240,110 480,10 720,48 C960,86 1200,20 1440,56 L1440,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}