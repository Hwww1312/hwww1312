import type { Metadata } from "next";
import { BUSINESS } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${BUSINESS.name} handles the details you send through the table request form.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[70ch] px-5 pb-28 pt-[22vh] sm:px-8">
      <h1 className="text-[length:var(--text-section)] leading-[1.02]">Privacy</h1>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-sage">
        <p>
          This page explains what happens to the details you enter in the table
          request form. It is written for that form only, because that is the
          single place this site collects anything.
        </p>

        <h2 className="pt-4 text-xl font-bold tracking-tight text-ivory">What we collect</h2>
        <p>
          Your name, phone number, the date, time and number of guests, and
          optionally your email address and a note. Nothing else is requested and
          no account is created.
        </p>

        <h2 className="pt-4 text-xl font-bold tracking-tight text-ivory">What we do with it</h2>
        <p>
          It is emailed to the restaurant so staff can confirm your table, and it
          is used for that booking only. It is not sold, and it is not used for
          marketing.
        </p>

        <h2 className="pt-4 text-xl font-bold tracking-tight text-ivory">Tracking</h2>
        <p>
          This site sets no advertising cookies and runs no third-party analytics.
          Fonts and images are served from this domain rather than a third party.
        </p>

        <h2 className="pt-4 text-xl font-bold tracking-tight text-ivory">
          Asking for your details back
        </h2>
        <p>
          Call {BUSINESS.phoneDisplay} or speak to staff at {BUSINESS.addressFull}{" "}
          and we will remove your booking details on request.
        </p>

        {/* Marked so it is obvious this needs the owner's sign-off. */}
        <p className="border-l-2 border-lemongrass py-3 pl-4 text-sm text-ivory">
          Editable placeholder: the restaurant should confirm how long booking
          emails are kept and name a contact for privacy requests before launch.
        </p>
      </div>
    </div>
  );
}
