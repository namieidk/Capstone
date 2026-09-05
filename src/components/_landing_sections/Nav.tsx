import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./shared";

const LINKS = ["About", "Qualifications", "Requirements", "Reviews", "FAQ", "Contact"];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-21 items-center justify-between gap-6">
        <Link href="#top" className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-[#F8F4EA]">
            <Image
              src="/logo_cropped.png"
              alt="ViaScholar logo"
              width={200}
              height={200}
              unoptimized
              className="size-[72%] object-contain"
            />
          </span>
          <span className="text-lg font-bold text-navy">ViaScholar</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Landing page sections">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[0.95rem] font-medium text-foreground/70 transition-colors hover:text-navy"
            >
              {l}
            </a>
          ))}
        </nav>

        <Button asChild className="h-9 rounded-full px-5 text-[0.92rem] font-semibold">
          <Link href="/signup">Apply now</Link>
        </Button>
      </Container>
    </header>
  );
}
