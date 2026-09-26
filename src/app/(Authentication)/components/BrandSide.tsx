import Image from "next/image";
import Link from "next/link";
import type { AuthMode } from "./ModeTabs";

interface BrandSideProps {
  mode: AuthMode;
}

// Same wording as before, split into two lines so line 2 can use the amber accent color.
const COPY: Record<AuthMode, { line1: string; line2: string; sub: string }> = {
  signin: {
    line1: "Support for CRDC families,",
    line2: "from school to graduation",
    sub: "Sign in to check if you qualify, track your application, and manage your scholar profile.",
  },
  signup: {
    line1: "Apply for scholarships",
    line2: "in minutes.",
    sub: "Create your student account to apply for CRDC scholarships and track your application in one place.",
  },
};

export function BrandSide({ mode }: BrandSideProps) {
  const copy = COPY[mode];

  return (
    <aside className="auth-brand-bg relative hidden overflow-hidden lg:block">
      {/* Amber blob, bottom right (sits behind the image card) */}
      <div aria-hidden="true" className="absolute -right-20 -bottom-24 size-80 rounded-full bg-amber" />

      <div className="relative z-10 flex h-full flex-col px-10 pt-8 pb-8 xl:px-14">
        <Link href="/" className="flex w-fit items-center gap-3 text-lg font-semibold text-white">
          <Image
            src="/logo_cropped.png"
            alt="ViaScholar logo"
            width={44}
            height={44}
            unoptimized
            className="size-11 object-contain"
          />
          ViaScholar
        </Link>

        {/* Centered text, font size scales with the screen so everything fits */}
        <div className="mx-auto mt-6 max-w-lg text-center xl:mt-8">
          <h2 className="font-serif text-[clamp(1.6rem,2.3vw,2.25rem)] leading-[1.15] font-semibold tracking-tight text-white">
            {copy.line1}
            <br />
            <span className="text-amber">{copy.line2}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[clamp(0.8rem,1vw,0.92rem)] leading-relaxed text-white/75">
            {copy.sub}
          </p>
        </div>

        {/* Medium-width cream card, centered. The image inside is never cropped. */}
        <div className="mx-auto mt-6 flex min-h-0 w-full max-w-md flex-1 items-center justify-center overflow-hidden rounded-[2rem] bg-[#fef8ea] shadow-va-md xl:max-w-lg">
          <Image
            src="/sclr.png"
            alt="Students studying together and celebrating a scholarship"
            width={900}
            height={900}
            unoptimized
            className="h-full w-auto max-w-full object-contain"
          />
        </div>
      </div>
    </aside>
  );
}
