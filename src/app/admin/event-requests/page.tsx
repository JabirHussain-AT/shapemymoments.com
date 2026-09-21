import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLiveEventRequestsFromDb } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { EVENT_REQUEST_STATUSES } from "@/types";

export const metadata = { title: "Event Requests", robots: { index: false } };

export default async function AdminEventRequestsPage() {
  const requests = await getLiveEventRequestsFromDb();

  return (
    <AdminShell title="Event Requests">
      <p className="mb-4 text-sm text-muted-foreground">
        Manage statuses: {EVENT_REQUEST_STATUSES.join(" · ")}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No event requests found. Customer event submissions will appear here.
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="px-4 py-4">
                    <p className="font-mono text-xs">{r.requestId}</p>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    {r.eventType}
                    <p className="text-xs text-muted-foreground">{r.eventDate}</p>
                  </td>
                  <td className="px-4 py-4">{r.location}</td>
                  <td className="px-4 py-4">{formatCurrency(r.budget)}</td>
                  <td className="px-4 py-4">
                    <Badge>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="secondary">
                        Quotation
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
