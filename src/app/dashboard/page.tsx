"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, LogOut, Calendar, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface IEventRequest {
  id: string;
  requestId: string;
  eventType: string;
  eventDate: string;
  location: string;
  status: string;
  budget: number;
}

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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [eventRequests, setEventRequests] = useState<IEventRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionAndRequests();
  }, []);

  const fetchSessionAndRequests = async () => {
    try {
      const authRes = await fetch("/api/auth");
      const authJson = await authRes.json();
      if (authJson.success && authJson.data?.user) {
        setUser(authJson.data.user);
      }

      const reqRes = await fetch("/api/event-requests");
      const reqJson = await reqRes.json();
      if (reqJson.success && Array.isArray(reqJson.data)) {
        // Filter requests for current user if logged in, otherwise empty array
        setEventRequests(reqJson.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="section-padding pt-10 min-h-screen bg-background text-foreground">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Customer Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight">My Event Moments</h1>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2 text-xs font-bold">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="h-fit rounded-2xl border border-border bg-card p-3 space-y-1">
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
                className="block rounded-xl px-3.5 py-2.5 text-xs font-bold hover:bg-muted transition"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="space-y-6">
            <section
              id="requests"
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold">My Event Requests</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Track the status of your event requests managed by ShapeMyMoment Concierge.
                  </p>
                </div>
                <Link href="/plan-event">
                  <Button size="sm" className="gap-1.5 font-bold text-xs bg-primary">
                    <Plus className="h-4 w-4" /> Plan New Event
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
                  Loading event requests...
                </div>
              ) : eventRequests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">No Active Event Requests</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    You haven&apos;t submitted any event requests yet. Tell us your date, location &amp; budget, and our concierge team will help you find the best verified creative partners.
                  </p>
                  <Link href="/plan-event">
                    <Button size="sm" className="font-bold text-xs bg-primary mt-2">
                      Plan Your Event Now →
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {eventRequests.map((req) => (
                    <div key={req.id || req.requestId} className="rounded-2xl border border-border bg-background p-6 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{req.eventType}</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {req.location} · {req.eventDate} · Request ID: <span className="font-mono">{req.requestId}</span>
                          </p>
                        </div>
                        <Badge variant="default" className="font-bold text-xs">{req.status || "NEW"}</Badge>
                      </div>

                      <ol className="mt-4 grid gap-2 sm:grid-cols-3 md:grid-cols-6 text-xs">
                        {timeline.map((step, i) => {
                          const done = i <= (req.status === "NEW" ? 0 : 2);
                          return (
                            <li key={step} className="flex items-center gap-2 rounded-xl border border-border/50 bg-card p-2">
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-border shrink-0" />
                              )}
                              <span className={done ? "font-bold text-foreground" : "text-muted-foreground"}>
                                {step}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section
              id="saved"
              className="rounded-3xl border border-border bg-card p-6 space-y-2"
            >
              <h2 className="text-base font-bold">Saved Photographers</h2>
              <p className="text-xs text-muted-foreground">
                Shortlisted creative partners will appear here.{" "}
                <Link href="/photographers" className="text-primary font-bold underline">
                  Browse creative directory
                </Link>
              </p>
            </section>

            <section
              id="messages"
              className="rounded-3xl border border-border bg-card p-6 space-y-2"
            >
              <h2 className="text-base font-bold">Concierge Messages</h2>
              <p className="text-xs text-muted-foreground">
                Team updates and direct quotes will show here once your request is reviewed.
              </p>
            </section>

            <section
              id="profile"
              className="rounded-3xl border border-border bg-card p-6 space-y-2"
            >
              <h2 className="text-base font-bold">Profile Details</h2>
              <p className="text-xs text-muted-foreground">
                {user ? `${user.name} (${user.email})` : "Customer Profile"}
              </p>
            </section>

            <section
              id="settings"
              className="rounded-3xl border border-border bg-card p-6 space-y-2"
            >
              <h2 className="text-base font-bold">Account Settings</h2>
              <p className="text-xs text-muted-foreground">
                Notification preferences and account settings.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

