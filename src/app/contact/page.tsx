import type { Metadata } from "next";
import { BUSINESS } from "@/data/siteContent";
import { ReservationForm } from "@/components/forms/ReservationForm";

export const metadata: Metadata = {
  title: "Reserve a table",
  description: `Request a table at ${BUSINESS.name}, ${BUSINESS.addressFull}. Or call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-[22vh] sm:px-8">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-jade">
            Reserve
          </p>
          <h1 className="mt-5 max-w-[14ch] text-[length:var(--text-chapter)] leading-[0.98]">
            Book the table
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-soft">
            Send a request and we will confirm by phone. For the same evening or
            for a large group, calling is quicker.
          </p>
          <ReservationForm />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <h2 className="text-xl font-bold tracking-tight">Find us</h2>
          <dl className="mt-6 divide-y divide-ink/15 border-y border-ink/15 text-base">
            <div className="py-4">
              <dt className="text-sm uppercase tracking-[0.14em] text-ink-soft">Address</dt>
              <dd className="mt-2">
                {BUSINESS.street}
                <br />
                {BUSINESS.locality}
                <a
                  href={BUSINESS.mapsDirections}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-[15px] underline decoration-jade/45 underline-offset-4 hover:decoration-jade"
                >
                  Get directions
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm uppercase tracking-[0.14em] text-ink-soft">Phone</dt>
              <dd className="mt-2">
                <a
                  href={BUSINESS.phoneHref}
                  className="underline decoration-jade/45 underline-offset-4 hover:decoration-jade"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm uppercase tracking-[0.14em] text-ink-soft">Hours</dt>
              <dd className="mt-2">
                {BUSINESS.openingTime} to {BUSINESS.closingTime}
                <span className="mt-2 block text-[15px] text-ink-soft">
                  Busiest {BUSINESS.busiest}. Hours can change, so call before you
                  travel.
                </span>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm uppercase tracking-[0.14em] text-ink-soft">Service</dt>
              <dd className="mt-2">{BUSINESS.serviceOptions.join(" / ")}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
