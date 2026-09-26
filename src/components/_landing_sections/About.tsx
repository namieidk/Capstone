"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Fireflies } from "./Fireflies";
import { Container, Eyebrow, SectionHeading } from "./shared";

export function About() {
  return (
    <section id="about" className="relative bg-background pt-14 pb-16 sm:pt-18 sm:pb-20 lg:py-24">
      <Fireflies />

      <Container className="relative grid items-center gap-7 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* Left: text, fades up every time it enters the screen */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex h-full flex-col justify-center text-center"
        >
          <div className="translate-y-0 lg:-translate-y-8">
            <div className="flex justify-center">
              <Eyebrow>ABOUT VIASCHOLAR</Eyebrow>
            </div>
            <SectionHeading className="text-center">
              Education changes
              <br />
              what is possible.
            </SectionHeading>
            <p className="mx-auto mt-3 sm:mt-5 max-w-xl text-[0.95rem] sm:text-base leading-relaxed text-muted-foreground">
              We make scholarship support easier to understand and simpler to manage, so families can focus on the
              opportunity ahead, not the paperwork.
            </p>
          </div>
        </motion.div>

        {/* Right: picture inside a panel (colors live in globals.css) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
          className="about-panel-bg relative flex min-h-64 sm:min-h-80 lg:min-h-112 items-end justify-center overflow-hidden rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 md:pt-12"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            className="relative w-full max-w-xl"
          >
            {/* -mb-[8%] trims blank space at the bottom of the file so the graduates sit on the panel edge */}
            <Image
              src="/about.png"
              alt="Graduates throwing their caps in the air"
              width={1200}
              height={750}
              unoptimized
              className="mb-[-8%] block h-auto w-full object-contain"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
