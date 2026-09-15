import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Container, Reveal, SectionHeading } from "./shared";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Who is eligible to apply for a ViaScholar grant?",
    a: "Applicants must be Filipino citizens studying in Davao City, immediate relatives of an employee of a partner private company (or formally endorsed by one), and currently enrolled in an accredited college or university with at least a 90% General Weighted Average.",
  },
  {
    q: "When is the application deadline?",
    a: "Applications for the current academic year close on August 15. Late submissions are only accepted on a case-by-case basis for returning scholars.",
  },
  {
    q: "How are scholarship slots assigned to applicants?",
    a: "Coordinators review each applicant's eligibility, academic standing, and document verification status through ViaScholar's descriptive analytics dashboard, which summarizes this data alongside available slot capacity to support a fair, well-informed decision.",
  },
  {
    q: "What documents do I need to upload?",
    a: "You'll need a valid government ID, proof of relationship, your latest grade report, an income statement, a letter of intent, and a certificate of enrollment.",
  },
  {
    q: "How long does the evaluation take?",
    a: "Most applications are reviewed within 2 to 3 weeks of submission, provided all required documents pass the initial OCR verification.",
  },
  {
    q: "What happens if my grades fall below 90%?",
    a: "Coordinators review each scholar's submitted grade report every semester and reach out as soon as a report falls below the threshold, giving the scholar a chance to recover before the next disbursement.",
  },
  {
    q: "Can I apply if I'm already receiving another scholarship?",
    a: "Yes, as long as the combined support does not exceed your total cost of education and is disclosed during application.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative overflow-hidden bg-background py-19">
      <Container>
        <Reveal>
          <div className="mx-auto mb-12 max-w-160 text-center">
            <SectionHeading className="text-center">Frequently Asked Questions</SectionHeading>
            <p className="mx-auto max-w-120 text-[1.05rem] text-muted-foreground">
              Eligibility, deadlines, and documents — quick answers to what students ask most before applying.
            </p>
          </div>
        </Reveal>

        <Reveal>
          {/*
            Built directly on AccordionPrimitive rather than the shadcn
            wrapper, which bakes in its own chevron and open-state styling.
            Writing every element ourselves means nothing hidden can
            resurface, and the glass treatment (translucent navy fill +
            backdrop blur + soft border) covers the whole shell as one
            consistent surface, not just the icon chip.
          */}
          <div className="mx-auto max-w-180 overflow-hidden rounded-3xl border border-white/10 bg-navy/90 shadow-va-md backdrop-blur-xl">
            <AccordionPrimitive.Root type="single" collapsible defaultValue="0">
              {FAQS.map((item, i) => {
                const isLastRow = i === FAQS.length - 1;
                return (
                  <AccordionPrimitive.Item
                    key={item.q}
                    value={String(i)}
                    className={isLastRow ? "" : "border-b border-white/10"}
                  >
                    <AccordionPrimitive.Header>
                      <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-5 px-7 py-5 text-left text-[0.98rem] font-semibold text-white transition-colors duration-300 data-[state=open]:bg-white/[0.06]">
                        <span>{item.q}</span>
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-amber/30 bg-amber/10 text-amber backdrop-blur-md transition-all duration-300 group-data-[state=open]:scale-110 group-data-[state=open]:border-amber/60 group-data-[state=open]:bg-amber/25">
                          <ChevronDown className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" strokeWidth={2.5} />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content className="overflow-hidden px-7 text-[0.92rem] leading-[1.65] text-white/60 data-[state=closed]:animate-[accordion-up_0.25s_ease-out] data-[state=open]:animate-[accordion-down_0.25s_ease-out]">
                      <div className="max-w-150 pb-6">{item.a}</div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                );
              })}
            </AccordionPrimitive.Root>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}