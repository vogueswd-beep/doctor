import RegisterForm from "./RegisterForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-50 bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.06),_transparent_60%)] px-4 py-16 dark:bg-black dark:bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.08),_transparent_60%)]">
      <main className="w-full max-w-md">
        <div className="mb-10 text-center fade-in">
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

          <h2 className="mt-5 text-lg font-semibold leading-snug text-amber-700 dark:text-amber-400/90">
            Register to Win a 22KT Gold Pendant
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-zinc-500">
            One valued guest will receive a thoughtfully selected gift as a
            gesture of our appreciation. Share your details below to be
            considered.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-8 text-center text-[11px] text-zinc-400 dark:text-zinc-700">
          © {new Date().getFullYear()} Vogue Jewellers. All rights reserved.
        </p>
      </main>
    </div>
  );
}
