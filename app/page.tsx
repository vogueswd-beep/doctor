import Image from "next/image";
import RegisterForm from "./RegisterForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center bg-zinc-50 bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.06),_transparent_60%)] px-4 py-10 dark:bg-black dark:bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.08),_transparent_60%)] sm:py-16">
      <main className="w-full max-w-2xl">
        <div className="fade-in overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-white/[0.06] dark:bg-zinc-950 dark:shadow-black/40">
          <Image
            src="/imges/1.png"
            alt="Vogue Jewellers and the Sri Lanka Medical Association unite to celebrate excellence, trust, and enduring elegance"
            width={2400}
            height={600}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="fade-in mb-8 mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 dark:border-amber-500/20 dark:bg-amber-500/5">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-500">
              Exclusive Giveaway
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Vogue Jewellers
          </h1>

          <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <h2 className="mt-5 text-lg font-semibold uppercase leading-snug tracking-wide text-amber-700 dark:text-amber-400/90">
            Register to Win a 22KT Gold Pendant
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            With compliments from Vogue Jewellers, one valued guest will
            receive a thoughtfully selected gift as a gesture of our
            appreciation. Kindly share your details below to participate and
            be considered for this exclusive gesture from Vogue Jewellers.
          </p>
        </div>

        <div className="fade-in relative mx-auto max-w-md overflow-hidden rounded-2xl border border-amber-200/60 shadow-xl shadow-amber-900/10 dark:border-amber-500/20 dark:shadow-amber-900/20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/imges/2.webp')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] dark:bg-zinc-950/85" />

          <div className="relative px-6 pb-8 pt-7 sm:px-8">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Enter Now For A Chance To Win
            </p>
            <RegisterForm />
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-zinc-400 dark:text-zinc-700">
          © {new Date().getFullYear()} Vogue Jewellers. All rights reserved.
        </p>
      </main>
    </div>
  );
}
