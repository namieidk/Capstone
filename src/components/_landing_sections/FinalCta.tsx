import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./shared";

export function FinalCta() {
  return (
    <section id="apply" className="pb-19">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 rounded-[26px] bg-linear-to-br from-good-bg to-amber-bg px-8 py-12 md:flex-row md:items-center md:px-14 md:py-14">
          <div>
            <span className="block text-[0.78rem] font-bold uppercase tracking-[0.12em] text-good">
              READY WHEN YOU ARE
            </span>
            <h2 className="mt-3.5 max-w-120 text-[2.5rem] font-bold leading-[1.15] text-navy">
              Apply for a ViaScholar grant today.
            </h2>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Button asChild className="h-13 rounded-full px-8 text-[0.96rem] font-semibold">
              <Link href="/signup">
                Start application <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Link href="/login" className="text-[0.88rem] text-muted-foreground underline underline-offset-2">
              Or sign up for an account
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
