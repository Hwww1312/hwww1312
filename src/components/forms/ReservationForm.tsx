"use client";

import { useActionState, useId } from "react";
import { submitReservation } from "@/app/actions/reserve";
import type { ReservationState } from "@/lib/forms/reservation";
import { BUSINESS } from "@/data/siteContent";

const initial: ReservationState = { status: "idle" };

function Field({
  label,
  name,
  error,
  children,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <p className="flex flex-col gap-2">
      {/* Label above the control, error below it. Never placeholder-as-label. */}
      <label htmlFor={name} className="text-sm font-medium text-ivory">
        {label}
      </label>
      {children}
      {hint && !error && <span className="text-xs text-sage">{hint}</span>}
      {error && (
        <span id={`${name}-error`} role="alert" className="text-xs text-lemongrass">
          {error}
        </span>
      )}
    </p>
  );
}

const control =
  "w-full border border-ivory/25 bg-lacquer-2 px-4 py-3 text-base text-ivory " +
  "placeholder:text-sage-dim focus:border-lemongrass focus:outline-none";

export function ReservationForm() {
  const [state, formAction, pending] = useActionState(submitReservation, initial);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const today = new Date().toISOString().slice(0, 10);
  const statusId = useId();

  return (
    <form action={formAction} className="mt-10" noValidate>
      {/* Honeypot, hidden from people and from assistive technology. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={control}
          />
        </Field>

        <Field label="Phone" name="phone" error={errors.phone} hint="So we can confirm your table.">
          <input
            id="phone" name="phone" type="tel" required autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={control}
          />
        </Field>

        <Field label="Email (optional)" name="email" error={errors.email}>
          <input
            id="email" name="email" type="email" autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={control}
          />
        </Field>

        <Field label="Guests" name="guests" error={errors.guests}>
          <input
            id="guests" name="guests" type="number" min={1} max={20} defaultValue={2} required
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? "guests-error" : undefined}
            className={control}
          />
        </Field>

        <Field label="Date" name="date" error={errors.date}>
          <input
            id="date" name="date" type="date" min={today} required
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "date-error" : undefined}
            className={control}
          />
        </Field>

        <Field
          label="Time" name="time" error={errors.time}
          hint={`${BUSINESS.openingTime} to ${BUSINESS.closingTime}.`}
        >
          <input
            id="time" name="time" type="time" min="08:00" max="21:00" step={900} required
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "time-error" : undefined}
            className={control}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Anything we should know? (optional)" name="notes" error={errors.notes}>
          <textarea id="notes" name="notes" rows={4} className={control} />
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-lemongrass px-7 py-4 text-base font-semibold text-lacquer transition-colors hover:bg-ivory active:translate-y-px disabled:opacity-60"
        >
          {pending ? "Sending..." : "Request a table"}
        </button>
        <a
          href={BUSINESS.phoneHref}
          className="text-base text-ivory underline decoration-lemongrass/45 underline-offset-4 hover:decoration-lemongrass"
        >
          or call {BUSINESS.phoneDisplay}
        </a>
      </div>

      <div id={statusId} role="status" aria-live="polite" className="mt-6">
        {state.status !== "idle" && (
          <p
            className={`border-l-2 py-3 pl-4 text-base ${
              state.status === "sent"
                ? "border-lemongrass text-ivory"
                : "border-ivory/40 text-sage"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
