import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PLAN_FEATURES, PLAN_PRICES } from "@/models/Subscription";

export const metadata = { title: "Subscriptions", robots: { index: false } };

export default function AdminSubscriptionsPage() {
  return (
    <AdminShell title="Subscriptions">
      <p className="mb-6 text-sm text-muted-foreground">
        Photographer subscription architecture is implemented. Payment processing
        is placeholder-only for V1.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
          <article
            key={plan}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{plan}</h2>
              <Badge variant={plan === "PREMIUM" ? "gold" : "default"}>
                {formatCurrency(PLAN_PRICES[plan])}/mo
              </Badge>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {PLAN_FEATURES[plan].map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
