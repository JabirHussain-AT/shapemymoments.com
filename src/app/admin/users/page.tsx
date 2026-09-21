import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Users", robots: { index: false } };

const demoUsers = [
  { name: "Admin", email: "admin@shapemymoment.com", role: "ADMIN" },
  { name: "Demo Customer", email: "demo@shapemymoment.com", role: "CUSTOMER" },
  { name: "Ananya Rao", email: "ananya@example.com", role: "PHOTOGRAPHER" },
];

export default function AdminUsersPage() {
  return (
    <AdminShell title="Users">
      <p className="mb-4 text-sm text-muted-foreground">
        Roles: CUSTOMER · PHOTOGRAPHER · ADMIN · EVENT_MANAGER · STAFF ·
        SUPER_ADMIN
      </p>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {demoUsers.map((u) => (
              <tr key={u.email} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge>{u.role}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
