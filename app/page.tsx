import RegisterForm from "./RegisterForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-black bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.12),_transparent_60%)] px-4 py-16">
      <main className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            With compliments from
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Vogue Jewellers
          </h1>
          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <h2 className="mt-6 text-xl font-bold leading-snug text-amber-400">
            Register to Win a 22KT Gold Pendant
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
            One valued guest will receive a thoughtfully selected gift as a
            gesture of our appreciation. Share your details below to be
            considered for this exclusive gesture.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Vogue Jewellers. All rights reserved.
        </p>
      </main>
    </div>
  );
}
