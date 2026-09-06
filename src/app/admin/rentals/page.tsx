import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/section";

export const metadata = { title: "Rentals CMS", robots: { index: false } };

export default function AdminRentalsPage() {
  return (
    <AdminShell title="Rentals">
      <Badge variant="gold" className="mb-4">
        Coming Soon
      </Badge>
      <EmptyState
        title="Rentals marketplace coming soon"
        description="RentalItem / RentalBooking models are reserved for a future release."
      />
    </AdminShell>
  );
}
