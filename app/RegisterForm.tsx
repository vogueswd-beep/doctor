"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { registerEntry, type RegisterState } from "./actions";
import { EMAIL_RE, PHONE_RE } from "@/lib/validation";

const initialState: RegisterState = { status: "idle", message: "" };

type FieldStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function useAvailabilityCheck(field: "email" | "phone", value: string): FieldStatus {
  const trimmed = value.trim();
  const formatValid = trimmed !== "" && (field === "email" ? EMAIL_RE.test(value) : PHONE_RE.test(value));

  const [result, setResult] = useState<{ value: string; available: boolean } | null>(null);

  useEffect(() => {
    if (!formatValid) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/check-availability?field=${field}&value=${encodeURIComponent(value)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => setResult({ value, available: Boolean(data.available) }))
        .catch(() => {
          // Aborted or network error: leave previous result as-is.
        });
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [field, value, formatValid]);

  if (!trimmed) return "idle";
  if (!formatValid) return "invalid";
  if (result && result.value === value) return result.available ? "available" : "taken";
  return "checking";
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-4 text-[15px] font-bold tracking-wide text-black shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      <span className="relative flex items-center justify-center gap-2">
        {pending ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Enter Now
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}

function FieldIcon({ type }: { type: "name" | "email" | "phone" }) {
  const cls = "h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-colors duration-200";
  if (type === "name")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    );
  if (type === "email")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

function StatusIndicator({ status }: { status: FieldStatus }) {
  if (status === "checking") {
    return (
      <svg className="h-4 w-4 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    );
  }
  if (status === "available") {
    return (
      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
  }
  if (status === "taken" || status === "invalid") {
    return (
      <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return null;
}

const inputBase =
  "w-full rounded-xl border py-3 pl-11 pr-10 text-sm outline-none transition-all duration-200 focus:ring-2 placeholder-zinc-400 dark:placeholder-zinc-600";

const inputNormal =
  "border-zinc-200 bg-white focus:border-amber-500/50 focus:ring-amber-500/20 hover:border-zinc-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-100 focus:dark:border-amber-500/50 focus:dark:ring-amber-500/20 hover:dark:border-white/[0.12]";

const inputError =
  "border-red-400/60 bg-red-50/50 focus:border-red-500/60 focus:ring-red-500/20 dark:border-red-500/40 dark:bg-red-500/5 dark:text-zinc-100 focus:dark:border-red-500/60 focus:dark:ring-red-500/20";

const inputOk =
  "border-emerald-400/60 bg-emerald-50/40 focus:border-emerald-500/60 focus:ring-emerald-500/20 dark:border-emerald-500/40 dark:bg-emerald-500/5 dark:text-zinc-100 focus:dark:border-emerald-500/60 focus:dark:ring-emerald-500/20";

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerEntry, initialState);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const emailStatus = useAvailabilityCheck("email", email);
  const phoneStatus = useAvailabilityCheck("phone", phone);

  const emailError =
    emailStatus === "invalid"
      ? "Enter a valid email address."
      : emailStatus === "taken"
        ? "This email is already registered."
        : emailStatus === "idle"
          ? state.fieldErrors?.email
          : undefined;

  const phoneError =
    phoneStatus === "invalid"
      ? "Enter a valid phone number."
      : phoneStatus === "taken"
        ? "This phone number is already registered."
        : phoneStatus === "idle"
          ? state.fieldErrors?.phone
          : undefined;

  const submitDisabled =
    emailStatus === "taken" ||
    emailStatus === "invalid" ||
    emailStatus === "checking" ||
    phoneStatus === "taken" ||
    phoneStatus === "invalid" ||
    phoneStatus === "checking";

  if (state.status === "success") {
    return (
      <div className="fade-in overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl shadow-amber-900/5 dark:border-amber-500/20 dark:bg-gradient-to-br dark:from-zinc-900/80 dark:to-zinc-950/80 dark:shadow-amber-900/10 backdrop-blur-xl">
        <Image
          src="/imges/3.png"
          alt="Thank you - your presence will make this occasion even more memorable"
          width={2400}
          height={600}
          className="h-auto w-full"
        />
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 ring-1 ring-amber-200 success-pulse dark:from-amber-500/20 dark:to-yellow-600/20 dark:ring-amber-500/30">
            <svg
              className="h-7 w-7 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
            You&apos;re In!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{state.message}</p>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent dark:via-amber-500/40" />
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">Good luck! We&apos;ll be in touch.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="fade-in space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-2xl shadow-zinc-200/50 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-zinc-900/80 dark:to-zinc-950/80 dark:shadow-2xl dark:shadow-amber-900/10 backdrop-blur-xl"
    >
      {state.status === "error" && !state.fieldErrors && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {state.message}
        </div>
      )}

      <div className="group/field">
        <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Name <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FieldIcon type="name" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={`${inputBase} pr-4 ${state.fieldErrors?.name ? inputError : inputNormal}`}
          />
        </div>
        {state.fieldErrors?.name && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="group/field">
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Email <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FieldIcon type="email" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputBase} ${
              emailError ? inputError : emailStatus === "available" ? inputOk : inputNormal
            }`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <StatusIndicator status={emailStatus} />
          </div>
        </div>
        {emailError ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {emailError}
          </p>
        ) : emailStatus === "available" ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            Available
          </p>
        ) : emailStatus === "checking" ? (
          <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">Checking availability...</p>
        ) : null}
      </div>

      <div className="group/field">
        <label htmlFor="phone" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Phone No. <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FieldIcon type="phone" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+94 7X XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputBase} ${
              phoneError ? inputError : phoneStatus === "available" ? inputOk : inputNormal
            }`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <StatusIndicator status={phoneStatus} />
          </div>
        </div>
        {phoneError ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {phoneError}
          </p>
        ) : phoneStatus === "available" ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            Available
          </p>
        ) : phoneStatus === "checking" ? (
          <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">Checking availability...</p>
        ) : null}
      </div>

      <SubmitButton disabled={submitDisabled} />

      <p className="text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600">
        One entry per person. Duplicate entries will not be accepted.
      </p>
    </form>
  );
}
