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
  {
    n: "01",
    Icon: Flag,
    text: "Filipino citizen residing in or studying within Davao City",
  },
  {
    n: "02",
    Icon: Users,
    text: "Immediate relative of an employee of a partner private company (or endorsed applicant)",
  },
  {
    n: "03",
    Icon: GraduationCap,
    text: "Incoming or current college student enrolled in an accredited HEI",
  },
  {
    n: "04",
    Icon: Percent,
    text: "Maintain a minimum 90% General Weighted Average (GWA) every semester",
  },
  {
    n: "05",
    Icon: ShieldCheck,
    text: "No failing grades, incomplete marks, or dropped subjects",
  },
];

// Alternating vertical offset per item — creates the zigzag rhythm.
const OFFSET = ["lg:mt-0", "lg:mt-20", "lg:mt-0", "lg:mt-20", "lg:mt-0"];
// Matching y-positions (%) used to draw the connector line through the same zigzag.
const LINE_Y = [22, 62, 22, 62, 22];
const LINE_X = [8, 27, 50, 73, 92];

export function Qualifications() {
  const linePoints = LINE_X.map((x, i) => `${x},${LINE_Y[i]}`).join(" ");

  return (
    <section id="qualifications" className="relative overflow-hidden bg-[#feffed] py-19">
      {/* Top edge: a soft, hand-drawn horizon line instead of a hard cut —
          echoes the meadow-at-dusk feel of the firefly field below it. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-14 w-full text-background sm:h-18"
      >
        <path
          d="M0,20 C60,6 130,30 210,24 C300,17 360,2 450,10 C540,18 600,38 690,32 C780,26 840,4 930,12 C1020,20 1080,40 1170,30 C1260,20 1320,4 1440,16 L1440,0 L0,0 Z"
          fill="currentColor"
        />
      </svg>

      {/* Firefly field: soft amber dots that wander and flicker */}
      <Fireflies />

      <Container className="relative">
        <Reveal>
          <div className="mx-auto mb-20 max-w-160 text-center">
            <div className="flex justify-center">
              <Eyebrow>WHO CAN APPLY</Eyebrow>
            </div>
            <SectionHeading className="text-center text-foreground">Qualifications</SectionHeading>
            <p className="mx-auto max-w-120 text-[0.9rem] leading-[1.75] text-muted-foreground">
              We look for students with consistent academic discipline and a clear commitment to finishing their degree.
              Meeting every item below makes you eligible for review.
            </p>
          </div>
        </Reveal>

        {/* Zigzag step row: connector line behind, alternating-height icon
            badges in front, matching the reference layout. */}
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 100 90"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden size-full lg:block"
          >
            <polyline points={linePoints} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
          </svg>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {QUALIFICATIONS.map((q, i) => (
              <Reveal key={q.n} delay={i * 110} y={14} className={OFFSET[i]}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-amber/20 bg-amber text-navy shadow-va-sm">
                    <q.Icon className="size-5.5" strokeWidth={1.75} />
                  </span>
                  <span className="mb-1 block text-center text-[0.78rem] font-semibold tracking-widest text-muted-foreground/70">
                    {q.n}
                  </span>
                  <p className="text-center text-[0.98rem] leading-[1.6] text-foreground/90">{q.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom edge: the same hand-drawn horizon treatment, mirrored with
          its own irregular rhythm so it doesn't read as a copy-pasted wave. */}
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
