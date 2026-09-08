import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(8).max(40),
  message: z.string().trim().min(1).max(2000),
  date: z.string().optional(),
  time: z.string().optional(),
  guests: z.string().optional(),
});

async function deliver(subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.info("[contact] Email not configured. Payload:\n", body);
    return {
      ok: true as const,
      mode: "logged" as const,
      message:
        "Request received. Email delivery is not configured yet — please also call (03) 9558 5555 to confirm.",
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
    console.error("[contact] Resend error", text);
    return {
      ok: false as const,
      message: "Could not send email. Please call (03) 9558 5555.",
    };
  }

  return {
    ok: true as const,
    mode: "email" as const,
    message: "Thank you — we will reply shortly by phone or email.",
  };
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form fields and try again." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      "",
      data.message,
    ].join("\n");

    const result = await deliver(`Message from ${data.name}`, body);
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
