import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: absoluteUrl("/refund") },
};

export default function RefundPage() {
  return (
    <div className="section-padding pt-10">
      <div className="container-page max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Refund Policy</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Deposits and payments for confirmed event packages are outlined in
            your quotation. Cancellation and refund eligibility depends on timing,
            vendor commitments and work already completed.
          </p>
          <p>
            Photographer bookings follow the photographer&apos;s package terms
            unless included under a ShapeMyMoments-managed event agreement.
          </p>
          <p>
            Contact hello@shapemymoments.com with your request ID for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
