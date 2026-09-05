import type { LucideIcon } from "lucide-react";
import { Building2, GitCompareArrows, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Eyebrow, SectionHeading } from "./shared";

interface AboutFeature {
  Icon: LucideIcon;
  title: string;
  text: string;
}

const ABOUT_FEATURES: AboutFeature[] = [
  {
    Icon: Building2,
    title: "Built for CRDC's scholarship program",
    text: "ViaScholar was developed specifically for Cawayan River Development Corporation (CRDC) to administer its private scholarship grant for the relatives of partner-company employees, replacing manual, spreadsheet-based tracking.",
  },
  {
    Icon: GitCompareArrows,
    title: "Data-driven insight, not guesswork",
    text: "Descriptive analytics dashboards summarize applicant eligibility, academic standing, and program trends in real time, giving coordinators clear, evidence-based context to support every decision.",
  },
  {
    Icon: ShieldCheck,
    title: "Auditable workflow",
    text: "Submissions, HR verification, contract signing, and check disbursements live in one secure portal — no more lost Messenger threads or unstructured email attachments.",
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-line py-17.5">
      <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow>ABOUT VIASCHOLAR</Eyebrow>
          <SectionHeading>A grant program that stays organized and easy to audit.</SectionHeading>
          <p className="max-w-115 text-[1.02rem] leading-[1.75] text-muted-foreground">
            Private scholarships traditionally rely on manual shortlisting — slow, hard to audit, and easy to
            second-guess. ViaScholar replaces that process with real-time descriptive analytics and a single system of
            record, so coordinators and providers can trust every decision and every update.
          </p>
        </div>

        <div className="flex flex-col gap-4.5">
          {ABOUT_FEATURES.map((f) => (
            <Card
              key={f.title}
              className="rounded-[18px] border border-line shadow-va-sm [--card-spacing:--spacing(6)]"
            >
              <CardContent className="flex items-center gap-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-good-bg text-navy">
                  <f.Icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-navy">{f.title}</h3>
                  <p className="text-sm leading-[1.6] text-muted-foreground">{f.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
