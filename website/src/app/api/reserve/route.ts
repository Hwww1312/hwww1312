import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(8).max(40),
  date: z.string().trim().min(1).max(40),
  time: z.string().trim().min(1).max(40),
  guests: z.coerce.number().int().min(1).max(20),
  message: z.string().trim().max(2000).optional().default(""),
});

async function deliver(subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.info("[reserve] Email not configured. Payload:\n", body);
    return {
      ok: true as const,
      mode: "logged" as const,
      message:
        "Reservation request received. Email delivery is not configured yet — please call (03) 9558 5555 to confirm your table.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[reserve] Resend error", text);
    return {
      ok: false as const,
      message: "Could not send reservation. Please call (03) 9558 5555.",
    };
  }

  return {
    ok: true as const,
    mode: "email" as const,
    message:
      "Reservation request sent. We will confirm your table by phone or email.",
  };
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the reservation fields and try again." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const body = [
      "Table reservation request",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Date: ${data.date}`,
      `Time: ${data.time}`,
      `Guests: ${data.guests}`,
      data.message ? `Notes: ${data.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await deliver(
      `Reservation — ${data.name} — ${data.date} ${data.time}`,
      body,
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 502 });
    }
    return NextResponse.json({ message: result.message, mode: result.mode });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error. Please call (03) 9558 5555." },
      { status: 500 },
    );
  }
}
