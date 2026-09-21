import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LINKS = ["About", "Qualifications", "Requirements", "Reviews", "FAQ", "Contact"];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 md:px-6">
      <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-6 rounded-full bg-gradient-to-r from-[#FBF9F3] to-[#F3EFE4] py-3 pr-3 pl-5 shadow-va-md">
        <Link href="#top" className="flex shrink-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8F4EA]">
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
            <span className="font-serif text-[1.3rem] font-medium tracking-tight text-navy">ViaScholar</span>
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

        <Button asChild className="h-11 shrink-0 rounded-full px-6 text-[0.92rem] font-semibold">
          <Link href="/signup">Apply now</Link>
        </Button>
      </div>
    </header>
  );
}