import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      body={`ShapeMyMoments ("we", "us") respects your privacy. We collect information you provide when planning events, contacting us, creating accounts, or requesting photographers — including name, email, phone, event details and messages.

We use this information to respond to requests, deliver services, improve the platform and communicate updates. We do not sell personal data. Access to customer information is restricted to authorized team members.

You may request access, correction or deletion of your data by contacting hello@shapemymoments.com. This policy may be updated as our services evolve.`}
    />
  );
}

function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="section-padding pt-10">
      <div className="container-page max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line">
          {body}
        </div>
      </div>
    </div>
  );
}
