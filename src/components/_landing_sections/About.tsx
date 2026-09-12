"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Container, Eyebrow, Reveal, SectionHeading } from "./shared";

interface AboutFeature {
  n: string;
  title: string;
  text: string;
}

const ABOUT_FEATURES: AboutFeature[] = [
  {
    n: "01",
    title: "Built for CRDC's scholarship program",
    text: "ViaScholar was developed specifically for Cawayan River Development Corporation (CRDC) to administer its private scholarship grant for the relatives of partner-company employees, replacing manual, spreadsheet-based tracking.",
  },
  {
    n: "02",
    title: "Data-driven insight, not guesswork",
    text: "Descriptive analytics dashboards summarize applicant eligibility, academic standing, and program trends in real time, giving coordinators clear, evidence-based context to support every decision.",
  },
  {
    n: "03",
    title: "Auditable workflow",
    text: "Submissions, HR verification, contract signing, and check disbursements live in one secure portal — no more lost Messenger threads or unstructured email attachments.",
  },
];

// Fixed positions/timings (not Math.random() at render time) so the layout
// stays identical between server and client — only the CSS animation makes
// them drift and flicker.
const FIREFLIES = [
  { left: "4%", top: "14%", size: 3, duration: 7.4, delay: 0.2 },
  { left: "11%", top: "58%", size: 4, duration: 8.2, delay: 1.6 },
  { left: "19%", top: "82%", size: 3, duration: 6.8, delay: 2.9 },
  { left: "27%", top: "30%", size: 5, duration: 9.1, delay: 0.7 },
  { left: "35%", top: "70%", size: 3, duration: 7.9, delay: 3.3 },
  { left: "44%", top: "10%", size: 4, duration: 8.6, delay: 1.1 },
  { left: "52%", top: "48%", size: 3, duration: 6.5, delay: 2.4 },
  { left: "61%", top: "86%", size: 4, duration: 9.4, delay: 0.4 },
  { left: "69%", top: "22%", size: 3, duration: 7.1, delay: 2.1 },
  { left: "77%", top: "64%", size: 5, duration: 8.9, delay: 1.4 },
  { left: "85%", top: "36%", size: 3, duration: 6.9, delay: 3.6 },
  { left: "93%", top: "76%", size: 4, duration: 9.6, delay: 0.9 },
];

// Shared sticky offset — heading and card 01 pin at the same top so they
// land level with each other.
const BASE_TOP = 100; // px — clears the sticky nav
const PEEK = 20; // px — sliver of each earlier card left visible underneath
// Resting scale for each card once landed — small step so the stack reads
// as depth without looking like a size mismatch.
const SCALE_STEP = 0.015;

function StackedFeatureCard({ f, i }: { f: AboutFeature; i: number }) {
  const isLast = i === ABOUT_FEATURES.length - 1;
  const restScale = 1 - i * SCALE_STEP;

  return (
    <div
      className="sticky"
      style={{ top: `${BASE_TOP + i * PEEK}px`, zIndex: i + 1 }}
    >
      {/*
        The spring "landing" lives entirely on this inner motion.div, never
        on the sticky div above it — that separation is what keeps this
        safe. whileInView fires ONCE as the card scrolls into place, so
        there's no per-frame scroll-linked value fighting the browser's
        native sticky positioning the way useScroll/useTransform did
        before. Each card drops in slightly rotated/offset/oversized and
        springs down to its resting scale, giving the "patong" moment real
        weight instead of an instant snap.
      */}
      <motion.div
        initial={{
          y: 56,
          scale: restScale + 0.06,
          rotate: i % 2 === 0 ? -2.5 : 2.5,
          opacity: 0,
        }}
        whileInView={{
          y: 0,
          scale: restScale,
          rotate: 0,
          opacity: 1,
        }}
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          mass: 0.9,
        }}
        style={{ transformOrigin: "top center" }}
      >
        <div
          className="rounded-2xl bg-navy p-7 ring-1 ring-white/[0.06]"
          style={{
            boxShadow: `0 ${24 - i * 4}px ${48 - i * 6}px -20px rgba(0,0,0,${0.55 - i * 0.08})`,
          }}
        >
          <span className="font-serif text-[2rem] leading-none font-medium text-amber">
            {f.n}
          </span>
          <h3 className="mt-3 mb-1.5 text-lg font-bold text-white">{f.title}</h3>
          <p className="text-[0.7rem] leading-[1.6] text-white/70">{f.text}</p>
        </div>
      </motion.div>
      {isLast && <div className="h-10" />}
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  const fireflyStyle = useMemo(
    () => ({ transform: `translate3d(${tilt.x * 16}px, ${tilt.y * 16}px, 0)` }),
    [tilt],
  );

  return (
    // overflow-hidden intentionally NOT on the section — it breaks
    // position:sticky for everything nested inside it.
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-background py-19"
    >
      <style>{`
        @keyframes vs-firefly-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          25% { transform: translate(6px, -10px) scale(1.15); opacity: 0.9; }
          50% { transform: translate(-8px, 4px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(4px, 10px) scale(1.1); opacity: 0.85; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden transition-transform duration-700 ease-out"
        style={fireflyStyle}
      >
        {FIREFLIES.map((f, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber [animation:vs-firefly-drift_ease-in-out_infinite]"
            style={{
              left: f.left,
              top: f.top,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              boxShadow: "0 0 6px 2px rgba(241, 183, 30, 0.35)",
            }}
          />
        ))}
      </div>

      <Container className="relative grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="sticky" style={{ top: `${BASE_TOP}px` }}>
            <Reveal>
              <div>
                <Eyebrow>ABOUT VIASCHOLAR</Eyebrow>
                <SectionHeading>
                  A grant program that stays organized and easy to audit.
                </SectionHeading>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="relative">
          {ABOUT_FEATURES.map((f, i) => (
            <StackedFeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}