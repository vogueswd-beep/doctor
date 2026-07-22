"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3.5 text-base font-semibold text-black shadow-lg shadow-amber-900/20 transition-all hover:from-amber-400 hover:to-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-8 shadow-xl backdrop-blur"
    >
      {state.status === "error" && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
