import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemoReviews } from "@/lib/data";

export const metadata = { title: "Reviews", robots: { index: false } };

export default function AdminReviewsPage() {
  const reviews = getDemoReviews();

  return (
    <AdminShell title="Reviews">
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No customer reviews submitted yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {r.name} · {"★".repeat(r.rating)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.eventType} · {r.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="success">{r.status}</Badge>
                  {r.featured && <Badge variant="gold">Featured</Badge>}
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.review}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary">
                  Approve
                </Button>
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm" variant="ghost">
                  Feature
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
