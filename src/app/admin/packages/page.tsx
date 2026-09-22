import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLivePackagesFromDb } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Packages", robots: { index: false } };

export default async function AdminPackagesPage() {
  const packages = await getLivePackagesFromDb();

  return (
    <AdminShell title="Packages">
      <div className="mb-4 flex justify-end">
        <Button>Create package</Button>
      </div>
      {packages.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No event packages created yet. Click &quot;Create package&quot; to add one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{pkg.name}</h2>
                  <p className="mt-1 text-sm text-primary">
                    {formatCurrency(pkg.startingPrice)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {pkg.featured && <Badge variant="gold">Featured</Badge>}
                  <Badge variant={pkg.active ? "success" : "warning"}>
                    {pkg.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {pkg.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="ghost">
                  Deactivate
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
