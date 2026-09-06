"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const timeline = [
  "Request submitted",
  "Team contacted",
  "Planning",
  "Quotation",
  "Confirmed",
  "Completed",
];

export default function CustomerDashboardPage() {
  const router = useRouter();
  const currentStep = 2;

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <div className="section-padding pt-10">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Customer dashboard
            </p>
            <h1 className="text-3xl font-bold">My Moments</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="h-fit rounded-2xl border border-border bg-white p-3">
            {[
              ["My Event Requests", "#requests"],
              ["Saved Photographers", "#saved"],
              ["Messages", "#messages"],
              ["Profile", "#profile"],
              ["Settings", "#settings"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="space-y-6">
            <section
              id="requests"
              className="rounded-2xl border border-border bg-white p-6 premium-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Your Birthday Event</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kalpetta · 20 Oct · Request SMM-260901-A1B2C3
                  </p>
                </div>
                <Badge>Planning</Badge>
              </div>

              <ol className="mt-8 space-y-4">
                {timeline.map((step, i) => {
                  const done = i <= currentStep;
                  return (
                    <li key={step} className="flex items-center gap-3">
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-border" />
                      )}
                      <span
                        className={
                          done ? "font-medium" : "text-muted-foreground"
                        }
                      >
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-6">
                <Link href="/plan-event">
                  <Button>Plan another event</Button>
                </Link>
              </div>
            </section>

            <section
              id="saved"
              className="rounded-2xl border border-border bg-white p-6"
            >
              <h2 className="text-lg font-semibold">Saved Photographers</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Shortlisted photographers appear here.{" "}
                <Link href="/photographers" className="text-primary underline">
                  Browse directory
                </Link>
              </p>
            </section>

            <section
              id="messages"
              className="rounded-2xl border border-border bg-white p-6"
            >
              <h2 className="text-lg font-semibold">Messages</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Team updates and quotations will show here once your request is
                reviewed.
              </p>
            </section>

            <section
              id="profile"
              className="rounded-2xl border border-border bg-white p-6"
            >
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Demo Customer · demo@shapemymoment.com
              </p>
            </section>

            <section
              id="settings"
              className="rounded-2xl border border-border bg-white p-6"
            >
              <h2 className="text-lg font-semibold">Settings</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Notification preferences and account settings.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
