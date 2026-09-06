import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  getDemoEventRequests,
  getDemoPhotographers,
  getDemoPackages,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
};

const cards = [
  { label: "Total Event Requests", value: "24" },
  { label: "Pending Requests", value: "6" },
  { label: "Active Photographers", value: "10" },
  { label: "Photographer Leads", value: "18" },
  { label: "Monthly Revenue", value: formatCurrency(185000) },
  { label: "Subscription Revenue", value: formatCurrency(12490) },
];

export default function AdminDashboardPage() {
  const requests = getDemoEventRequests();
  const photographers = getDemoPhotographers().slice(0, 5);

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-white p-5 premium-shadow"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent event requests</h2>
            <Link
              href="/admin/event-requests"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
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
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="py-3 font-mono text-xs">{r.requestId}</td>
                    <td className="py-3">{r.eventType}</td>
                    <td className="py-3">{r.name}</td>
                    <td className="py-3">
                      <Badge variant="default">{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Photographers</h2>
            <Link
              href="/admin/photographers"
              className="text-sm text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <ul className="space-y-3">
            {photographers.map((p) => (
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

          <div className="mt-6 rounded-xl border border-dashed border-border p-4">
            <p className="text-sm font-semibold">Charts (demo)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Event requests over time · Revenue · Popular event types ·
              Photographer subscriptions — wire to live MongoDB metrics when
              connected.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[40, 65, 45, 80].map((h, i) => (
                <div key={i} className="flex h-24 items-end rounded-lg bg-muted p-2">
                  <div
                    className="w-full rounded-md bg-primary/80"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Active packages in catalog: {getDemoPackages().length}
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
