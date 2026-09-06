import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/section";

export const metadata = { title: "Store CMS", robots: { index: false } };

export default function AdminStorePage() {
  return (
    <AdminShell title="Store">
      <Badge variant="gold" className="mb-4">
        Coming Soon
      </Badge>
      <EmptyState
        title="Event Store is not live yet"
        description="Product model stubs are ready for future e-commerce. Public store page shows a premium teaser."
      />
    </AdminShell>
  );
}
