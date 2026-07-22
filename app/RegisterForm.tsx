"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerEntry, type RegisterState } from "./actions";

const initialState: RegisterState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3.5 text-base font-semibold text-black shadow-lg shadow-amber-900/20 transition-all hover:from-amber-400 hover:to-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Enter Now"}
    </button>
  );
}

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerEntry, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-zinc-900/60 p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-7 w-7 text-amber-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-amber-300">
          You&apos;re registered!
        </h2>
        <p className="mt-2 text-sm text-zinc-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-8 shadow-xl backdrop-blur"
    >
      {state.status === "error" && !state.fieldErrors && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Name <span className="text-amber-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Email <span className="text-amber-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Phone No. <span className="text-amber-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+94 7X XXX XXXX"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        {state.fieldErrors?.phone && (
          <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.phone}</p>
        )}
      </div>

      <SubmitButton />

      <p className="text-center text-xs text-zinc-500">
        One entry per person. Duplicate emails or phone numbers cannot be registered twice.
      </p>
    </form>
  );
}
