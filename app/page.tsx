import Image from "next/image";
import RegisterForm from "./RegisterForm";
import GoldSparkles from "./GoldSparkles";

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-[13px] text-white">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15">
        <svg
          className="h-3 w-3 text-amber-600 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
      {children}
    </li>
  );
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.06),_transparent_60%)] px-4 py-8 dark:bg-black dark:bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.08),_transparent_60%)] sm:py-12">
      <main className="w-full max-w-5xl">
        <div className="fade-in grid overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-300/30 dark:border-white/[0.06] dark:bg-zinc-950 dark:shadow-black/50 lg:grid-cols-2">
          {/* Left: image + copy panel (desktop only) */}
          <div className="relative hidden min-h-[680px] lg:block">
            <Image
              src="/imges/2.webp"
              alt="Vogue Jewellers 22KT gold pendant giveaway"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/25 bg-amber-500/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                <span className="gold-shimmer text-[11px] font-semibold uppercase tracking-[0.25em]">
                  Exclusive Giveaway
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/80">
                  Vogue Jewellers
                </p>
                <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-white">
                  Register to Win a 22KT Gold Pendant
                </h1>
                <div className="mt-5 h-px w-14 bg-gradient-to-r from-amber-400/80 to-transparent" />
                <p className="mt-5 max-w-sm text-[13px] font-medium leading-relaxed text-white/90">
                  With compliments from Vogue Jewellers, one valued guest will
                  receive a thoughtfully selected gift as a gesture of our
                  appreciation. Kindly share your details to participate and
                  be considered for this exclusive gesture from Vogue
                  Jewellers.
                </p>

                <ul className="mt-6 space-y-3">
                  <CheckBullet>Genuine 22KT gold pendant</CheckBullet>
                  <CheckBullet>Takes less than a minute to enter</CheckBullet>
                  <CheckBullet>One entry per person</CheckBullet>
                </ul>
              </div>

              <p className="text-[11px] text-zinc-500">
                © {year} Vogue Jewellers. All rights reserved.
              </p>
            </div>
          </div>

          {/* Mobile-only compact hero banner */}
          <div className="lg:hidden">
            <Image
              src="/imges/1.png"
              alt="Vogue Jewellers and the Sri Lanka Medical Association unite to celebrate excellence, trust, and enduring elegance"
              width={2400}
              height={600}
              priority
              className="h-auto w-full"
            />
          </div>

          {/* Right: form panel */}
          <div className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <GoldSparkles />
            <div className="relative z-10">
              <div className="mb-7 text-center lg:hidden">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 dark:border-amber-500/20 dark:bg-amber-500/5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                  </span>
                  <span className="gold-shimmer text-[11px] font-semibold uppercase tracking-[0.25em]">
                    Exclusive Giveaway
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold uppercase leading-snug tracking-wide text-amber-700 dark:text-amber-400/90">
                  Register to Win a 22KT Gold Pendant
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  With compliments from Vogue Jewellers, one valued guest will
                  receive a thoughtfully selected gift as a gesture of our
                  appreciation. Kindly share your details below to
                  participate and be considered for this exclusive gesture
                  from Vogue Jewellers.
                </p>
              </div>

              <div className="mb-6 hidden overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-white/[0.06] lg:block">
                <Image
                  src="/imges/1.png"
                  alt="Vogue Jewellers and the Sri Lanka Medical Association unite to celebrate excellence, trust, and enduring elegance"
                  width={2400}
                  height={600}
                  className="h-auto w-full"
                />
              </div>

              <h2 className="mb-6 hidden bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-600 bg-clip-text text-center text-2xl font-bold tracking-tight text-transparent dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 lg:block">
                Enter Your Details
              </h2>

              <RegisterForm />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-zinc-400 dark:text-zinc-700 lg:hidden">
          © {year} Vogue Jewellers. All rights reserved.
        </p>
      </main>
    </div>
  );
}
