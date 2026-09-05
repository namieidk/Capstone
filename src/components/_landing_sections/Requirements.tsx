import type { LucideIcon } from "lucide-react";
import { FileText, IdCard, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Eyebrow, SectionHeading } from "./shared";

interface Requirement {
  Icon: LucideIcon;
  title: string;
  text: string;
}

const REQUIREMENTS: Requirement[] = [
  {
    Icon: IdCard,
    title: "Valid government ID",
    text: "A clear photo or scan of any current government-issued ID belonging to the applicant.",
  },
  {
    Icon: UserCheck,
    title: "Proof of relationship",
    text: "Birth certificate or affidavit linking the applicant to the endorsing employee.",
  },
  {
    Icon: FileText,
    title: "Latest grade report",
    text: "Official transcript or report card from the most recent completed semester.",
  },
];

export function Requirements() {
  return (
    <section id="requirements" className="py-17.5">
      <Container>
        <Eyebrow>WHAT TO PREPARE</Eyebrow>
        <SectionHeading>Application requirements</SectionHeading>
        <p className="mb-11 max-w-140 text-[1.02rem] leading-[1.75] text-muted-foreground">
          Upload clear scans or photographs of each item below directly into your ViaScholar dashboard. Our OCR-based
          verification will flag missing fields before you submit.
        </p>

        <div className="grid gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {REQUIREMENTS.map((r) => (
            <Card
              key={r.title}
              className="rounded-[18px] border border-line shadow-va-sm [--card-spacing:--spacing(7)]"
            >
              <CardContent className="flex flex-col">
                <span className="mb-4 flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                  <r.Icon className="size-5" />
                </span>
                <h3 className="mb-2.5 text-lg font-bold text-navy">{r.title}</h3>
                <p className="text-sm leading-[1.6] text-muted-foreground">{r.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
