"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  User,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PLAN_FEATURES, PLAN_PRICES } from "@/models/Subscription";
import { toast } from "sonner";

const metrics = [
  { label: "Profile views", value: "1,280" },
  { label: "Leads", value: "14" },
  { label: "Booking requests", value: "6" },
  { label: "Rating", value: "4.9" },
  { label: "Portfolio views", value: "3,400" },
];

export default function PhotographerDashboardPage() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    toast.success("Signed out");
    router.push("/login");
  };

  const upgrade = async (plan: "FREE" | "PRO" | "PREMIUM") => {
    const res = await fetch("/api/subscriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, photographerId: "ph-ananya-rao" }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success(json.message || `Switched to ${plan}`);
    } else {
      toast.error(json.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ec]">
      <header className="border-b border-border bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div>
            <Link href="/" className="font-bold">
              ShapeMyMoments
            </Link>
            <span className="ml-2 text-xs text-muted-foreground">
              Photographer Dashboard
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="h-fit space-y-1 rounded-2xl border border-border bg-white p-3">
          {(
            [
              { Icon: LayoutDashboard, label: "Overview" },
              { Icon: User, label: "Profile" },
              { Icon: Camera, label: "Portfolio" },
              { Icon: CalendarDays, label: "Availability" },
              { Icon: Inbox, label: "Leads" },
              { Icon: Star, label: "Reviews" },
              { Icon: CreditCard, label: "Subscription" },
              { Icon: Settings, label: "Settings" },
            ] as const
          ).map(({ Icon, label }) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <Icon className="h-4 w-4" /> {label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          <section id="overview">
            <h1 className="text-2xl font-bold">Overview</h1>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-border bg-white p-4"
                >
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold">{m.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="profile"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Update bio, locations, pricing and specializations. Public profile:{" "}
              <Link
                href="/photographers/ananya-rao"
                className="text-primary underline"
              >
                View public page
              </Link>
            </p>
          </section>

          <section
            id="portfolio"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Portfolio</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              FREE plans are limited. Upgrade to PRO/PREMIUM for more images and
              featured placement.
            </p>
          </section>

          <section
            id="availability"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Availability</h2>
            <Badge variant="success" className="mt-3">
              Available
            </Badge>
          </section>

          <section
            id="leads"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Leads</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Incoming booking requests appear here with customer contact details.
            </p>
          </section>

          <section
            id="reviews"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Only admin-approved reviews appear on your public profile.
            </p>
          </section>

          <section
            id="subscription"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Subscription</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placeholder billing — no real payment charged in V1.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
                <div key={plan} className="rounded-xl border border-border p-4">
                  <p className="font-bold">{plan}</p>
                  <p className="text-sm text-primary">
                    {formatCurrency(PLAN_PRICES[plan])}/mo
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {PLAN_FEATURES[plan].map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    className="mt-4 w-full"
                    variant={plan === "FREE" ? "outline" : "primary"}
                    onClick={() => upgrade(plan)}
                  >
                    Select {plan}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section
            id="settings"
            className="rounded-2xl border border-border bg-white p-6"
          >
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Notification preferences and account security.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
