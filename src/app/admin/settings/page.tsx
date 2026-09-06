import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export const metadata = { title: "Settings", robots: { index: false } };

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings">
      <div className="max-w-xl rounded-2xl border border-border bg-white p-6">
        <h2 className="font-semibold">Site settings</h2>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Site URL</Label>
            <Input defaultValue={process.env.NEXT_PUBLIC_SITE_URL} />
          </div>
          <div>
            <Label>WhatsApp number</Label>
            <Input defaultValue={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
          </div>
          <div>
            <Label>MongoDB</Label>
            <Input
              defaultValue="Configured via MONGODB_URI"
              disabled
            />
          </div>
          <Button>Save settings</Button>
        </div>
      </div>
    </AdminShell>
  );
}
