import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { getLiveUsersFromDb } from "@/lib/data";

export const metadata = { title: "Users Management", robots: { index: false } };

export default async function AdminUsersPage() {
  const users = await getLiveUsersFromDb();

  return (
    <AdminShell title="Users Management">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-semibold">
          Roles: CUSTOMER · PHOTOGRAPHER · ADMIN · EVENT_MANAGER · STAFF · SUPER_ADMIN
        </p>
        <Badge variant="outline" className="font-bold text-xs">
          {users.length} Registered Users
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {users.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No registered users found in database.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id || u.email} className="border-b border-border hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-bold text-foreground">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-xs">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "ADMIN" || u.role === "SUPER_ADMIN" ? "default" : u.role === "PHOTOGRAPHER" ? "pink" : "outline"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.isActive ? "success" : "outline"}>
                      {u.isActive ? "Active" : "Disabled"}
                    </Badge>
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
