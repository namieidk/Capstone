import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "./shared";

interface StatProps {
  number: string;
  label: string;
}

function Stat({ number, label }: StatProps) {
  return (
    <div>
      <p className="mb-1 text-2xl font-bold text-navy">{number}</p>
      <p className="text-[0.92rem] text-muted-foreground">{label}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="pt-15">
      <Container>
        <div className="mb-14 grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge
              variant="outline"
              className="mb-7 h-8 w-fit px-4 text-[0.72rem] font-semibold tracking-[0.06em] text-muted-foreground"
            >
              ✦ CRDC PRIVATE SCHOLARSHIP PROGRAM
            </Badge>
            <h1 className="mb-7 text-[clamp(2.4rem,4.6vw,4rem)] font-bold leading-[1.08] text-navy">
              Funding deserving minds. <em className="text-amber">Tracked</em> with clarity.
            </h1>
            <p className="mb-8 max-w-120 text-[1.1rem] leading-[1.7] text-muted-foreground">
              ViaScholar is the private scholarship management system built for Cawayan River Development Corporation
              (CRDC). Descriptive analytics dashboards summarize every applicants eligibility and every scholars
              academic standing in real time, giving coordinators clear, evidence-based context for every decision —
              then keep each grantees records, contracts, and disbursements on one dashboard through graduation.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Button asChild className="h-11 rounded-full px-7 text-[0.96rem] font-semibold">
                <Link href="/signup">
                  Start your application <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-line px-7 text-[0.96rem] font-semibold text-navy hover:bg-tint"
              >
                <a href="#qualifications">See qualifications</a>
              </Button>
            </div>
          </div>

          <Card className="relative min-h-80 w-full overflow-hidden rounded-[22px] shadow-va-md [--card-spacing:--spacing(0)] md:min-h-105">
            <Image
              src="/landing.jpg"
              alt="ViaScholar dashboard preview"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover"
            />
          </Card>
        </div>

        <div className="flex flex-wrap justify-between gap-x-10 gap-y-8 border-t border-line pb-14 pt-7 sm:max-w-155">
          <Stat number="4 yrs" label="Full tenure support" />
          <Stat number="90%" label="Retention threshold" />
          <Stat number="Real-time" label="Analytics dashboards" />
        </div>
      </Container>
    </section>
  );
}
