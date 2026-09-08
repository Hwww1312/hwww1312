import type { Metadata } from "next";
import { BUSINESS } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForms } from "@/components/ui/ContactForms";

export const metadata: Metadata = {
  title: "Reserve a table",
  description: `Reserve a table or contact ${BUSINESS.name} in Springvale.`,
};

export default function ContactPage() {
  return (
    <div className="page-shell grid gap-16 pb-24 pt-28 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title="Book a call or reserve a table"
          body={`We confirm bookings by phone or email. Kitchen closes ${BUSINESS.closingTime}. Busiest ${BUSINESS.busiest}.`}
        />
        <dl className="mt-12 space-y-6 text-sage">
          <div>
            <dt className="eyebrow mb-2">Phone</dt>
            <dd>
              <a
                href={BUSINESS.phoneHref}
                className="text-2xl text-paper hover:text-lemongrass"
              >
                {BUSINESS.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Address</dt>
            <dd className="text-paper">
              {BUSINESS.addressFull}
              <br />
              <a
                href={BUSINESS.mapsDirections}
                className="mt-2 inline-block text-lemongrass hover:text-paper"
              >
                Get directions →
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Email</dt>
            <dd className="text-paper">{BUSINESS.emailDisplay}</dd>
          </div>
        </dl>
      </div>

      <div className="border border-paper/10 bg-lacquer-2/60 p-6 sm:p-8">
        <ContactForms />
      </div>
    </div>
  );
}
