import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLiveCreativesFromDb } from "@/lib/data";

export const metadata = { title: "Photographers & Creatives", robots: { index: false } };

export default async function AdminPhotographersPage() {
  const photographers = await getLiveCreativesFromDb();

  return (
    <AdminShell title="Photographers">
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {photographers.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No photographers found. Registrations and photographer profiles will appear here once created.
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Photographer / Creative</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Contact Phone (Admin Only)</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {photographers.map((p) => (
                <tr key={p.id} className="border-b border-border">
                  <td className="px-4 py-4">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ★ {p.rating} · {p.yearsOfExperience} yrs
                    </p>
                  </td>
                  <td className="px-4 py-4">{p.location}</td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {(p as unknown as { phone?: string }).phone || "+91 80899 09386"}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline">{p.subscriptionPlan}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="success">{p.status}</Badge>
                      {p.verified && <Badge>Verified</Badge>}
                      {p.featured && <Badge variant="gold">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary">
                        Feature
                      </Button>
                      <Button size="sm" variant="ghost">
                        Suspend
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
