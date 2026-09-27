"use client";

import type { LucideIcon } from "lucide-react";
import { Flag, GraduationCap, Percent, ShieldCheck, Users } from "lucide-react";
import { Fireflies } from "./Fireflies";
import { Container, Eyebrow, Reveal, SectionHeading } from "./shared";

interface Qualification {
  n: string;
  Icon: LucideIcon;
  text: string;
}

const QUALIFICATIONS: Qualification[] = [
  { n: "01", Icon: Flag, text: "Filipino citizen residing in or studying within Davao City" },
  { n: "02", Icon: Users, text: "Immediate relative of an employee of a partner private company (or endorsed applicant)" },
  { n: "03", Icon: GraduationCap, text: "Incoming or current college student enrolled in an accredited HEI" },
  { n: "04", Icon: Percent, text: "Maintain a minimum 90% General Weighted Average (GWA) every semester" },
  { n: "05", Icon: ShieldCheck, text: "No failing grades, incomplete marks, or dropped subjects" },
];

const BAND_HEIGHT = 168;
const NODE_TOP = [4, 88, 4, 88, 4];
const ICON_SIZE = 52;
const NODE_Y = NODE_TOP.map((t) => t + ICON_SIZE / 2);
const NODE_X = QUALIFICATIONS.map((_, i) => (i + 0.5) * (1000 / QUALIFICATIONS.length));

function buildTrailPath() {
  let d = `M ${NODE_X[0]} ${NODE_Y[0]}`;
  for (let i = 1; i < NODE_X.length; i++) {
    const midX = (NODE_X[i - 1] + NODE_X[i]) / 2;
    d += ` C ${midX} ${NODE_Y[i - 1]}, ${midX} ${NODE_Y[i]}, ${NODE_X[i]} ${NODE_Y[i]}`;
  }
  return d;
}

function Waypoint({ Icon, n }: { Icon: LucideIcon; n: string }) {
  return (
    <span className="relative flex size-13 items-center justify-center rounded-2xl border border-amber/25 bg-amber text-navy shadow-va-sm">
      <Icon className="size-5.5" strokeWidth={1.75} />
      <span className="absolute -bottom-1.5 -right-1.5 flex size-5.5 items-center justify-center rounded-full bg-navy text-[0.65rem] font-bold text-amber ring-4 ring-background">
        {n}
      </span>
    </span>
  );
}

export function Qualifications() {
  const trailPath = buildTrailPath();

  return (
    <section id="qualifications" className="relative overflow-hidden py-20 sm:py-24">
      <Fireflies />

      <Container className="relative">
        <Reveal>
          <div className="mx-auto mb-16 max-w-160 text-center sm:mb-20">
            <div className="flex justify-center">
              <Eyebrow>WHO CAN APPLY</Eyebrow>
            </div>
            <SectionHeading className="text-center text-foreground">Qualifications</SectionHeading>
            <p className="mx-auto max-w-120 text-[0.9rem] leading-[1.75] text-muted-foreground">
              We look for students with consistent academic discipline and a clear commitment to finishing their
              degree. Five waypoints stand between you and eligibility.
            </p>
          </div>
        </Reveal>

        {/* ---------- Mobile / tablet: left-aligned trail ---------- */}
        <div className="relative mx-auto max-w-md lg:hidden">
          <span
            aria-hidden
            className="absolute bottom-6 left-[1.625rem] top-6 w-0 -translate-x-1/2 border-l-2 border-dashed border-amber/35"
          />
          <div className="flex flex-col gap-9">
            {QUALIFICATIONS.map((q, i) => (
              <Reveal key={q.n} delay={i * 90} y={14} className="relative z-10 flex items-start gap-4">
                <Waypoint Icon={q.Icon} n={q.n} />
                <p className="max-w-75 pt-3 text-[0.98rem] leading-[1.6] text-foreground/90">{q.text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---------- Desktop: waypoints along a winding trail ---------- */}
        <div className="hidden lg:block">
          <div className="relative" style={{ height: BAND_HEIGHT }}>
            <svg
              aria-hidden
              viewBox={`0 0 1000 ${BAND_HEIGHT}`}
              preserveAspectRatio="none"
              className="absolute inset-0 size-full overflow-visible text-amber"
            >
              <path
                d={trailPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 11"
                className="opacity-60"
              />
              {NODE_X.map((x, i) => (
                <circle key={x} cx={x} cy={NODE_Y[i]} r="3" className="fill-navy/25" />
              ))}
            </svg>

            <div className="absolute inset-0 grid grid-cols-5">
              {QUALIFICATIONS.map((q, i) => (
                <div key={q.n} className="flex justify-center" style={{ paddingTop: NODE_TOP[i] }}>
                  <Reveal delay={i * 90}>
                    <Waypoint Icon={q.Icon} n={q.n} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-5 gap-x-6">
            {QUALIFICATIONS.map((q, i) => (
              <Reveal key={q.n} delay={i * 90 + 60} y={10} className="relative px-1 text-center">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-serif text-6xl leading-none text-navy/[0.05]"
                >
                  {q.n}
                </span>
                <p className="relative text-[0.9rem] leading-[1.6] text-foreground/90">{q.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <svg
        aria-hidden
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-14 w-full text-background sm:h-18"
      >
        <path
          d="M0,52 C70,64 140,38 220,46 C310,55 370,70 460,60 C550,50 610,30 700,38 C790,46 850,68 940,58 C1030,48 1090,26 1180,36 C1270,46 1330,64 1440,54 L1440,72 L0,72 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}