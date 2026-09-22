import { AdminShell } from "@/components/admin/admin-shell";
import { getLiveCreativesFromDb } from "@/lib/data";
import { AdminPhotographersClient } from "@/components/admin/admin-photographers-client";

export const metadata = { title: "Creatives & Partners | Admin Panel", robots: { index: false } };

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

      <AdminPhotographersClient creatives={creatives} />
    </AdminShell>
  );
}
