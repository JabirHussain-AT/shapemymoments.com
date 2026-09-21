import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { getLivePhotographerLeadsFromDb } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Photographer Leads",
  robots: { index: false },
};

export default async function AdminPhotographerLeadsPage() {
  const leads = await getLivePhotographerLeadsFromDb();

  return (
    <AdminShell title="Photographer Leads">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-semibold">
          Customer direct booking leads &amp; portfolio inquiries
        </p>
        <Badge variant="outline" className="font-bold text-xs">
          {leads.length} Total Leads
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No customer photographer leads received yet.
          </div>
        ) : (
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Client Name</th>
                <th className="px-4 py-3 font-semibold">Event &amp; Date</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Contact Phone</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-border hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{l.eventType}</p>
                    <p className="text-xs text-muted-foreground">{l.eventDate}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">{l.location}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.phone || "—"}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {l.budget ? formatCurrency(l.budget) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={l.status === "NEW" ? "default" : "outline"}>
                      {l.status}
                    </Badge>
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
