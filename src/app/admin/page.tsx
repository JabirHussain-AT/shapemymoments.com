import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import {
  getLiveAdminStatsFromDb,
  getDemoPackages,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
};

export default async function AdminDashboardPage() {
  const stats = await getLiveAdminStatsFromDb();
  const packages = getDemoPackages();

  const cards = [
    { label: "Total Registered Users", value: String(stats.totalUsers) },
    { label: "Active Photographers", value: String(stats.totalPhotographers) },
    { label: "Total Event Requests", value: String(stats.totalEventRequests) },
    { label: "Pending Requests", value: String(stats.pendingEventRequests) },
    { label: "Photographer Leads", value: String(stats.totalLeads) },
    { label: "Customer Reviews", value: String(stats.totalReviews) },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 premium-shadow"
          >
            <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Event Requests</h2>
            <Link
              href="/admin/event-requests"
              className="text-sm font-bold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {stats.recentRequests.length === 0 ? (
            <div className="rounded-xl bg-muted/40 py-12 text-center text-sm text-muted-foreground">
              No event requests received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Event</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRequests.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="py-3 font-mono text-xs">{r.requestId}</td>
                      <td className="py-3">{r.eventType}</td>
                      <td className="py-3 font-medium">{r.name}</td>
                      <td className="py-3">
                        <Badge variant="default">{r.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Photographers &amp; Creatives</h2>
            <Link
              href="/admin/photographers"
              className="text-sm font-bold text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          {stats.recentPhotographers.length === 0 ? (
            <div className="rounded-xl bg-muted/40 py-12 text-center text-sm text-muted-foreground">
              No photographers registered yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.recentPhotographers.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-3"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.location} · {p.subscriptionPlan}
                    </p>
                  </div>
                  <Badge variant={p.verified ? "success" : "warning"}>
                    {p.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Active packages in catalog: {packages.length}
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
