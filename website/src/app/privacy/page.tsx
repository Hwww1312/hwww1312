import type { Metadata } from "next";
import { BUSINESS } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy policy for ${BUSINESS.name} website forms.`,
};

export default function PrivacyPage() {
  return (
    <div className="page-shell max-w-[72ch] pb-24 pt-28">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy policy"
        body="This page explains how we handle information you submit through this website."
      />

      <div className="mt-12 space-y-8 text-sage leading-relaxed">
        <section>
          <h2 className="mb-3 text-2xl text-paper">What we collect</h2>
          <p>
            When you use the reservation or contact forms, we collect the details
            you provide: name, email address, phone number, preferred date and
            time, guest count, and any message notes.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl text-paper">How we use it</h2>
          <p>
            We use this information only to respond to your enquiry or to
            confirm a table reservation. We do not sell personal information.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl text-paper">Storage and email delivery</h2>
          <p>
            Form submissions are processed by our website server. If an email
            delivery service is configured (see deployment docs), your message
            is forwarded to the restaurant inbox. Until that service is
            configured, submissions may be logged server-side for testing only.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl text-paper">Contact</h2>
          <p>
            Questions about this policy: call{" "}
            <a href={BUSINESS.phoneHref} className="text-lemongrass">
              {BUSINESS.phoneDisplay}
            </a>{" "}
            or visit {BUSINESS.addressFull}.
          </p>
        </section>
        <p className="text-sm">
          [EDITABLE: Replace this policy with counsel-reviewed text before
          public launch if required in your jurisdiction.]
        </p>
      </div>
    </div>
  );
}
