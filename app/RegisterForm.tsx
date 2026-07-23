"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { registerEntry, type RegisterState } from "./actions";
import { EMAIL_RE, ROLES } from "@/lib/validation";
import { COUNTRIES, LOCAL_PHONE_RE, getFlag, toInternational, type Country } from "@/lib/countries";

const initialState: RegisterState = { status: "idle", message: "" };
const SRI_LANKA = COUNTRIES.find((c) => c.code === "LK")!;

type FieldStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function useAvailabilityCheck(
  field: "email" | "phone",
  value: string,
  options?: { checkValue?: string }
): FieldStatus {
  const trimmed = value.trim();
  const formatValid =
    trimmed !== "" &&
    (field === "email" ? EMAIL_RE.test(value) : LOCAL_PHONE_RE.test(value));

  const checkValue = options?.checkValue ?? value;

  const [result, setResult] = useState<{ value: string; available: boolean } | null>(null);

  useEffect(() => {
    if (!formatValid) {
      setResult(null);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/check-availability?field=${field}&value=${encodeURIComponent(checkValue)}`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((d) => setResult({ value: checkValue, available: Boolean(d.available) }))
        .catch(() => {});
    }, 500);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [field, checkValue, formatValid]);

  if (!trimmed) return "idle";
  if (!formatValid) return "invalid";
  if (result && result.value === checkValue) return result.available ? "available" : "taken";
  return "checking";
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="group relative mt-3 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-4 text-[15px] font-bold tracking-wide text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/35 hover:scale-[1.015] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
      <span className="relative flex items-center justify-center gap-2.5">
        {pending ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Enter Now</span>
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}

function FieldIcon({ type, focused }: { type: "name" | "email"; focused?: boolean }) {
  const cls = `h-[18px] w-[18px] transition-colors duration-300 ${focused ? "text-amber-500 dark:text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`;
  if (type === "name")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function StatusIndicator({ status }: { status: FieldStatus }) {
  if (status === "checking")
    return (
      <svg className="h-4 w-4 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    );
  if (status === "available")
    return (
      <span className="flex items-center justify-center rounded-full bg-emerald-50 p-0.5 dark:bg-emerald-500/10">
        <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
    );
  if (status === "taken" || status === "invalid")
    return (
      <span className="flex items-center justify-center rounded-full bg-red-50 p-0.5 dark:bg-red-500/10">
        <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  return null;
}

function CountryDropdown({
  selected,
  onSelect,
  onClose,
}: {
  selected: Country;
  onSelect: (c: Country) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute left-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60 dark:border-white/[0.08] dark:bg-zinc-900 dark:shadow-black/40">
      {/* Search */}
      <div className="border-b border-zinc-100 p-2 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 dark:border-white/[0.08] dark:bg-zinc-800">
          <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country or code…"
            className="w-full bg-transparent text-[12px] text-zinc-700 placeholder:text-zinc-400 outline-none dark:text-zinc-200 dark:placeholder:text-zinc-500"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-52 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-zinc-400 dark:text-zinc-500">No countries found</p>
        ) : (
          filtered.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onSelect(country);
                onClose();
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-amber-50 dark:hover:bg-amber-500/10 ${
                country.code === selected.code
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <span className="text-base leading-none">{getFlag(country.code)}</span>
              <span className="flex-1 truncate text-[13px]">{country.name}</span>
              <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">{country.dial}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerEntry, initialState);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(SRI_LANKA);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const fullPhone = phone.trim() ? toInternational(selectedCountry, phone.trim()) : "";

  const emailStatus = useAvailabilityCheck("email", email);
  const phoneStatus = useAvailabilityCheck("phone", phone, { checkValue: fullPhone });

  useEffect(() => {
    if (!countryOpen) return;
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node))
        setCountryOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [countryOpen]);

  const emailError =
    emailStatus === "invalid" ? "Enter a valid email address."
    : emailStatus === "taken" ? "This email is already registered."
    : emailStatus === "idle" ? state.fieldErrors?.email
    : undefined;

  const phoneError =
    phoneStatus === "invalid" ? `Enter a valid number (e.g. ${selectedCountry.placeholder}).`
    : phoneStatus === "taken" ? "This phone number is already registered."
    : phoneStatus === "idle" ? state.fieldErrors?.phone
    : undefined;

  const submitDisabled =
    emailStatus === "taken" || emailStatus === "invalid" || emailStatus === "checking" ||
    phoneStatus === "taken" || phoneStatus === "invalid" || phoneStatus === "checking";

  const borderClass = (status: FieldStatus, error?: string, focused?: boolean) =>
    error
      ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-500/20 dark:border-red-500/40 dark:bg-red-500/5"
      : status === "available"
        ? "border-emerald-300 bg-emerald-50/30 focus:border-emerald-400 focus:ring-emerald-500/20 dark:border-emerald-500/40 dark:bg-emerald-500/5"
        : focused
          ? "border-amber-400/60 shadow-sm shadow-amber-500/10 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-500/30"
          : "border-zinc-200 hover:border-zinc-300 dark:border-white/[0.08] dark:hover:border-white/[0.14]";

  if (state.status === "success") {
    return (
      <div className="fade-in">
        <div className="mb-6 overflow-hidden rounded-2xl shadow-lg shadow-amber-900/10 dark:shadow-amber-900/20">
          <Image src="/imges/3.png" alt="Thank you" width={2400} height={600} className="h-auto w-full" />
        </div>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 ring-1 ring-amber-200 success-pulse dark:from-amber-500/20 dark:to-yellow-600/20 dark:ring-amber-500/30">
            <svg className="h-7 w-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">You&apos;re In!</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{state.message}</p>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent dark:via-amber-500/40" />
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">Good luck! We&apos;ll be in touch.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="fade-in space-y-4">
      {state.status === "error" && !state.fieldErrors && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-600 backdrop-blur-sm dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {state.message}
        </div>
      )}

      {/* Name */}
      <div className="group/field">
        <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors duration-200 group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Name <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FieldIcon type="name" focused={nameFocused} />
          </div>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            placeholder="Your full name"
            onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)}
            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-300 focus:ring-2 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 ${
              state.fieldErrors?.name
                ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-500/20 dark:border-red-500/40 dark:bg-red-500/5"
                : nameFocused
                  ? "border-amber-400/60 shadow-sm shadow-amber-500/10 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-500/30"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-white/[0.08] dark:hover:border-white/[0.14]"
            }`}
          />
        </div>
        {state.fieldErrors?.name && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="group/field">
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors duration-200 group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Email <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FieldIcon type="email" focused={emailFocused} />
          </div>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)}
            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-10 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-300 focus:ring-2 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 ${borderClass(emailStatus, emailError, emailFocused)}`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <StatusIndicator status={emailStatus} />
          </div>
        </div>
        {emailError ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {emailError}
          </p>
        ) : emailStatus === "available" ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            Available
          </p>
        ) : emailStatus === "checking" ? (
          <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">Checking availability...</p>
        ) : null}
      </div>

      {/* Phone */}
      <div className="group/field">
        <label htmlFor="phone" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors duration-200 group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Phone No. <span className="text-amber-500">*</span>
        </label>
        <div className="relative" ref={countryRef}>
          <input type="hidden" name="phone" value={fullPhone} />

          {/* Country selector trigger */}
          <button
            type="button"
            onClick={() => setCountryOpen((o) => !o)}
            className="absolute inset-y-0 left-0 z-10 flex items-center gap-1 rounded-l-xl border-r border-zinc-200 px-2.5 transition-colors hover:bg-zinc-50 dark:border-white/[0.08] dark:hover:bg-white/[0.03]"
          >
            <span className="text-lg leading-none">{getFlag(selectedCountry.code)}</span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{selectedCountry.dial}</span>
            <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Dropdown */}
          {countryOpen && (
            <CountryDropdown
              selected={selectedCountry}
              onSelect={(c) => { setSelectedCountry(c); setPhone(""); }}
              onClose={() => setCountryOpen(false)}
            />
          )}

          {/* Phone input */}
          <input
            id="phone"
            type="tel"
            autoComplete="tel-national"
            placeholder={selectedCountry.placeholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            style={{ paddingLeft: "5.5rem" }}
            className={`w-full rounded-xl border bg-white py-3 pr-10 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-300 focus:ring-2 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 ${borderClass(phoneStatus, phoneError, phoneFocused)}`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <StatusIndicator status={phoneStatus} />
          </div>
        </div>
        {phoneError ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {phoneError}
          </p>
        ) : phoneStatus === "available" ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            Available
          </p>
        ) : phoneStatus === "checking" ? (
          <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">Checking availability...</p>
        ) : null}
      </div>

      {/* Role */}
      <div className="group/field">
        <label htmlFor="role" className="mb-1.5 block text-[13px] font-medium text-zinc-500 transition-colors duration-200 group-focus-within/field:text-amber-600 dark:text-zinc-400 dark:group-focus-within/field:text-amber-400">
          Attendee Type <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <select
            id="role" name="role" required defaultValue=""
            className={`w-full appearance-none rounded-xl border bg-white py-3 pl-4 pr-10 text-sm outline-none transition-all duration-300 focus:ring-2 dark:bg-zinc-950 dark:text-zinc-100 ${
              state.fieldErrors?.role
                ? "border-red-300 bg-red-50/50 text-zinc-900 focus:border-red-400 focus:ring-red-500/20 dark:border-red-500/40 dark:bg-red-500/5"
                : "border-zinc-200 text-zinc-900 hover:border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20 dark:border-white/[0.08] dark:hover:border-white/[0.14]"
            }`}
          >
            <option value="" disabled>
              Select your attendee type
            </option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {state.fieldErrors?.role && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
            {state.fieldErrors.role}
          </p>
        )}
      </div>

      <SubmitButton disabled={submitDisabled} />
      <p className="text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600">
        One entry per person. Duplicate entries will not be accepted.
      </p>
    </form>
  );
}
