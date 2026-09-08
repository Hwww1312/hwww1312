"use server";

import { BUSINESS } from "@/data/siteContent";
import { reservationSchema, type ReservationState } from "@/lib/forms/reservation";

/**
 * Handles a table request.
 *
 * Delivery uses Resend's REST API over `fetch`, so there is no SDK dependency.
 * If the environment is not configured the action says so plainly rather than
 * reporting a success that never happened. See README for the variables.
 */
export async function submitReservation(
  _prev: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const parsed = reservationSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    date: formData.get("date"),
    time: formData.get("time"),
    guests: formData.get("guests"),
    notes: formData.get("notes"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  // Honeypot: accept silently so a bot learns nothing, but send nothing.
  if (data.company) {
    return { status: "sent", message: "Thank you. We will confirm shortly." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVATION_EMAIL_TO;
  const from = process.env.RESERVATION_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    return {
      status: "unconfigured",
      message:
        "Online booking is not connected yet, so this form did not send. " +
        `Please call ${BUSINESS.phoneDisplay} and we will hold your table.`,
    };
  }

  const lines = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Guests: ${data.guests}`,
    data.notes ? `Notes: ${data.notes}` : null,
  ].filter(Boolean);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email || undefined,
        subject: `Table request: ${data.name}, ${data.guests} on ${data.date} at ${data.time}`,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) {
      return { status: "error", message: `We could not send that. Please call ${BUSINESS.phoneDisplay}.` };
    }
  } catch {
    return {
      status: "error",
      message: `We could not reach our mail service. Please call ${BUSINESS.phoneDisplay}.`,
    };
  }

  return {
    status: "sent",
    message: "Thank you. Your request is with the restaurant and we will confirm by phone.",
  };
}
