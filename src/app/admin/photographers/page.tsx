import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLiveCreativesFromDb } from "@/lib/data";

export const metadata = { title: "Creatives & Partners | Admin Panel", robots: { index: false } };

function getCategoryBadge(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("henna") || c.includes("mehendi")) {
    return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 font-bold">🌿 Henna Artist</Badge>;
  }
  if (c.includes("makeup") || c.includes("style") || c.includes("beauty")) {
    return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 gap-1 font-bold">💄 Makeup Artist</Badge>;
  }
  if (c.includes("hamper") || c.includes("gift")) {
    return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 font-bold">🎁 Hamper Maker</Badge>;
  }
  if (c.includes("cake") || c.includes("baker") || c.includes("dessert")) {
    return <Badge className="bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30 gap-1 font-bold">🎂 Cake Baker</Badge>;
  }
  return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 font-bold">📷 Photographer</Badge>;
}

export default async function AdminPhotographersPage() {
  const creatives = await getLiveCreativesFromDb();

  const photoCount = creatives.filter(c => (c.category || "").toLowerCase().includes("photo")).length;
  const hennaCount = creatives.filter(c => (c.category || "").toLowerCase().includes("henna") || (c.category || "").toLowerCase().includes("mehendi")).length;
  const makeupCount = creatives.filter(c => (c.category || "").toLowerCase().includes("makeup")).length;
  const hamperCount = creatives.filter(c => (c.category || "").toLowerCase().includes("hamper") || (c.category || "").toLowerCase().includes("gift")).length;
  const cakeCount = creatives.filter(c => (c.category || "").toLowerCase().includes("cake") || (c.category || "").toLowerCase().includes("baker")).length;

  return (
    <AdminShell title="Creatives & Partners">
      {/* Equal Care Category Overview Banner */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Partners</p>
          <p className="mt-1 text-2xl font-black text-foreground">{creatives.length}</p>
        </div>
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3 text-center">
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">📷 Photographers</p>
          <p className="mt-1 text-2xl font-black text-foreground">{photoCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-center">
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">🌿 Henna Artists</p>
          <p className="mt-1 text-2xl font-black text-foreground">{hennaCount}</p>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 text-center">
          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase">💄 Makeup Artists</p>
          <p className="mt-1 text-2xl font-black text-foreground">{makeupCount}</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-center">
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">🎁 Hamper Makers</p>
          <p className="mt-1 text-2xl font-black text-foreground">{hamperCount}</p>
        </div>
        <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-3 text-center">
          <p className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase">🎂 Cake Bakers</p>
          <p className="mt-1 text-2xl font-black text-foreground">{cakeCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {creatives.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No creative partners found. Partner registrations and profiles will appear here once onboarded.
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Creative Partner</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Contact Phone (Admin Only)</th>
                <th className="px-4 py-3 font-bold">Plan</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creatives.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/20 transition">
                  <td className="px-4 py-4">
                    <p className="font-extrabold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      ★ {p.rating} · {p.yearsOfExperience} yrs exp
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {getCategoryBadge(p.category)}
                  </td>
                  <td className="px-4 py-4 font-medium">{p.location}</td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {(p as unknown as { phone?: string }).phone || "+91 80899 09386"}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="font-bold">{p.subscriptionPlan}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="success" className="font-bold">{p.status}</Badge>
                      {p.verified && <Badge variant="default" className="font-bold">Verified</Badge>}
                      {p.featured && <Badge variant="gold" className="font-bold">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-xs font-semibold">
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" className="h-7 text-xs font-semibold">
                        Feature
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-500 hover:text-rose-600 font-semibold">
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
