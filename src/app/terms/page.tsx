import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <div className="section-padding pt-10">
      <div className="container-page max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Terms & Conditions</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            By using ShapeMyMoments websites and services, you agree to these
            terms. Event packages, quotations and photographer bookings are
            subject to availability and written confirmation.
          </p>
          <p>
            Custom event plans are proposals until accepted. Photographers listed
            on the platform remain responsible for the quality of their own
            services; ShapeMyMoments coordinates introductions and may manage
            bookings as part of an event package.
          </p>
          <p>
            Accounts must provide accurate information. Misuse, fraud or abuse
            may result in suspension. For questions, contact
            hello@shapemymoments.com.
          </p>
        </div>
      </div>
    </div>
  );
}
