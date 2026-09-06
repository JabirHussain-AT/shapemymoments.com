import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/section";

export const metadata = {
  title: "Photographer Leads",
  robots: { index: false },
};

export default function AdminPhotographerLeadsPage() {
  return (
    <AdminShell title="Photographer Leads">
      <EmptyState
        title="Leads appear here"
        description="When customers request a photographer, leads are stored and shown here for admin and photographer follow-up."
      />
      <div className="mt-4 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
        API: <code className="text-foreground">GET/POST /api/photographers/leads</code>
        <div className="mt-2 flex gap-2">
          <Badge>NEW</Badge>
          <Badge variant="outline">CONTACTED</Badge>
          <Badge variant="success">BOOKED</Badge>
        </div>
      </div>
    </AdminShell>
  );
}
