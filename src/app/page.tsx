"use client";

import {
  About,
  Contact,
  Faq,
  FinalCta,
  Footer,
  Hero,
  Nav,
  Qualifications,
  Requirements,
  Reviews,
} from "@/components/_landing_sections";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-clip">
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Qualifications />
        <Requirements />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Contact />
      <Footer />
    </div>
  );
}
