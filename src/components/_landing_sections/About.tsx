"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Headset, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Fireflies } from "./Fireflies";
import { Container, Eyebrow, SectionHeading } from "./shared";

interface ReasonProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const REASONS: ReasonProps[] = [
  {
    Icon: Headset,
    title: "24/7 support",
    description:
      "A dedicated advisor is always reachable, so a question about a deadline never sits unanswered overnight.",
  },
  {
    Icon: ShieldCheck,
    title: "Clear requirements",
    description:
      "Every renewal condition is spelled out up front — no surprise paperwork once a term is already underway.",
  },
  {
    Icon: LayoutDashboard,
    title: "Real-time tracking",
    description:
      "Grades, disbursements, and renewal status live in one dashboard, updated the moment anything changes.",
  },
];

export function About() {
  return (
    <section id="about" className="relative bg-background py-24">
      <Fireflies />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex justify-center">
            <Eyebrow>WHY VIASCHOLAR</Eyebrow>
          </div>
          <SectionHeading className="text-center">3 reasons to choose us</SectionHeading>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            We make scholarship support easier to understand and simpler to manage, so families can focus on the
            opportunity ahead, not the paperwork.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              className="relative"
            >
              {/* Corner-frame accents, offset behind the card */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-5 -top-5 h-[65%] w-[70%] rounded-tr-2xl border-t-2 border-r-2 border-navy/25"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-5 -left-5 h-[65%] w-[70%] rounded-bl-2xl border-b-2 border-l-2 border-navy/25"
              />

              <div className="relative rounded-2xl border border-navy/10 bg-card p-8 shadow-va-sm">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-amber">
                    <reason.Icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-navy">{reason.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}