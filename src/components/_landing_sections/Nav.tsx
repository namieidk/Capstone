import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LINKS = ["About", "Qualifications", "Requirements", "Reviews", "FAQ", "Contact"];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 sm:top-4 z-50 px-3 sm:px-4 md:px-6">
      <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-3 sm:gap-4 md:gap-6 rounded-full bg-linear-to-r from-[#FBF9F3] to-[#F3EFE4] py-2 px-3 sm:py-2.5 sm:px-4 md:py-3 md:pl-5 md:pr-3 shadow-va-md">
        <Link href="#top" className="flex shrink-0 items-center gap-2 sm:gap-2.5 md:gap-3">
          <span className="flex size-9 sm:size-10 md:size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8F4EA]">
            <Image
              src="/logo_cropped.png"
              alt="ViaScholar logo"
              width={200}
              height={200}
              unoptimized
              className="size-[72%] object-contain"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.12rem] sm:text-[1.2rem] md:text-[1.3rem] font-medium tracking-tight text-navy">
              ViaScholar
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Landing page sections">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[0.95rem] font-medium text-foreground/70 hover:text-navy"
            >
              {l}
            </a>
          ))}
        </nav>

        <Button
          asChild
          className="h-9 px-4 text-xs sm:h-10 sm:px-5 sm:text-[0.88rem] md:h-11 md:px-6 md:text-[0.92rem] shrink-0 rounded-full font-semibold"
        >
          <Link href="/signup">Apply now</Link>
        </Button>
      </div>
    </header>
  );
}
