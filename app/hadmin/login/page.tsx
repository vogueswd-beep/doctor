import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login | Vogue Jewellers",
};

export default async function HadminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/hadmin");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-black bg-[radial-gradient(ellipse_at_top,_rgba(217,169,58,0.12),_transparent_60%)] px-4 py-16">
      <main className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Vogue Jewellers
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Admin Sign In
          </h1>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
