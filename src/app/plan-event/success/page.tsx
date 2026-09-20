import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false },
  alternates: { canonical: absoluteUrl("/plan-event/success") },
};

export default async function PlanEventSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="section-padding">
      <div className="container-page">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white p-8 text-center premium-shadow sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your moment is officially in motion ✨
          </h1>
          <p className="mt-4 text-muted-foreground">
            Our team will review your vision and get back to you with a
            customized plan.
          </p>
          {id && (
            <div className="mt-6 rounded-xl bg-muted px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Request ID
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-primary">{id}</p>
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Want faster response? Chat on WhatsApp now
            </p>
            <p className="mt-1 text-sm font-semibold">
              Contact Concierge: <span className="underline">+91 80899 09386</span>
            </p>
            <a
              href={`https://wa.me/918089909386?text=Hi!%20I%20just%20submitted%20an%20event%20plan%20request%20(${id || "New"}).`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              💬 Connect on WhatsApp Immediately
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Link href="/packages">
              <Button className="w-full sm:w-auto">
                <Sparkles className="h-4 w-4" /> Explore Packages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
