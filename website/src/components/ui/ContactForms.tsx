"use client";

import { FormEvent, useState } from "react";

type Mode = "reserve" | "contact";

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  message: "",
};

export function ContactForms() {
  const [mode, setMode] = useState<Mode>("reserve");
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [serverMessage, setServerMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "A valid email is required.";
    }
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 8) {
      next.phone = "A valid phone number is required.";
    }
    if (mode === "reserve") {
      if (!values.date) next.date = "Choose a date.";
      if (!values.time) next.time = "Choose a time.";
      const guests = Number(values.guests);
      if (!guests || guests < 1 || guests > 20) {
        next.guests = "Guests must be between 1 and 20.";
      }
    } else if (!values.message.trim()) {
      next.message = "Please include a short message.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerMessage("");
    try {
      const endpoint = mode === "reserve" ? "/api/reserve" : "/api/contact";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setServerMessage(data.error || "Something went wrong. Please call us.");
        return;
      }
      setStatus("success");
      setServerMessage(
        data.message ||
          "Thank you — we will confirm shortly by phone or email.",
      );
      setValues(initial);
    } catch {
      setStatus("error");
      setServerMessage("Network error. Please call (03) 9558 5555.");
    }
  }

  const fieldClass =
    "w-full border border-paper/20 bg-lacquer-2 px-4 py-3 text-paper outline-none transition-colors focus:border-lemongrass";

  return (
    <div>
      <div
        className="mb-8 flex gap-2"
        role="tablist"
        aria-label="Form type"
      >
        {(
          [
            ["reserve", "Reserve a table"],
            ["contact", "Send a message"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${
              mode === id
                ? "bg-lemongrass text-lacquer"
                : "border border-paper/20 text-sage hover:text-paper"
            }`}
            onClick={() => {
              setMode(id);
              setStatus("idle");
              setErrors({});
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-sage">
            Name
            <input
              className={`${fieldClass} mt-2`}
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
            {errors.name ? (
              <span className="mt-1 block text-xs text-lemongrass">{errors.name}</span>
            ) : null}
          </label>
          <label className="block text-sm text-sage">
            Email
            <input
              className={`${fieldClass} mt-2`}
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
            {errors.email ? (
              <span className="mt-1 block text-xs text-lemongrass">{errors.email}</span>
            ) : null}
          </label>
        </div>

        <label className="block text-sm text-sage">
          Phone
          <input
            className={`${fieldClass} mt-2`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
          />
          {errors.phone ? (
            <span className="mt-1 block text-xs text-lemongrass">{errors.phone}</span>
          ) : null}
        </label>

        {mode === "reserve" ? (
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block text-sm text-sage">
              Date
              <input
                className={`${fieldClass} mt-2`}
                name="date"
                type="date"
                value={values.date}
                onChange={(e) => update("date", e.target.value)}
                required
              />
              {errors.date ? (
                <span className="mt-1 block text-xs text-lemongrass">{errors.date}</span>
              ) : null}
            </label>
            <label className="block text-sm text-sage">
              Time
              <input
                className={`${fieldClass} mt-2`}
                name="time"
                type="time"
                value={values.time}
                onChange={(e) => update("time", e.target.value)}
                required
              />
              {errors.time ? (
                <span className="mt-1 block text-xs text-lemongrass">{errors.time}</span>
              ) : null}
            </label>
            <label className="block text-sm text-sage">
              Guests
              <input
                className={`${fieldClass} mt-2`}
                name="guests"
                type="number"
                min={1}
                max={20}
                value={values.guests}
                onChange={(e) => update("guests", e.target.value)}
                required
              />
              {errors.guests ? (
                <span className="mt-1 block text-xs text-lemongrass">
                  {errors.guests}
                </span>
              ) : null}
            </label>
          </div>
        ) : null}

        <label className="block text-sm text-sage">
          {mode === "reserve" ? "Notes (optional)" : "Message"}
          <textarea
            className={`${fieldClass} mt-2 min-h-[120px] resize-y`}
            name="message"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            required={mode === "contact"}
          />
          {errors.message ? (
            <span className="mt-1 block text-xs text-lemongrass">
              {errors.message}
            </span>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-3 bg-lemongrass px-7 py-4 text-base font-semibold text-lacquer transition-colors hover:bg-paper disabled:opacity-60"
        >
          {status === "loading"
            ? "Sending…"
            : mode === "reserve"
              ? "Request reservation"
              : "Send message"}
          <span aria-hidden="true">→</span>
        </button>

        <div aria-live="polite" className="min-h-[1.5rem] text-sm">
          {status === "success" ? (
            <p className="text-lemongrass">{serverMessage}</p>
          ) : null}
          {status === "error" ? (
            <p className="text-paper">{serverMessage}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
