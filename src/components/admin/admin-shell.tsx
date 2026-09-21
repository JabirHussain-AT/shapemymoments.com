"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  Star,
  Users,
  CreditCard,
  Store,
  Sofa,
  Settings,
  FileText,
  LogOut,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { toast } from "sonner";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/event-requests", label: "Event Requests", icon: CalendarDays },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/photographers", label: "Creatives & Partners", icon: Users },
  { href: "/admin/photographer-leads", label: "Partner Leads", icon: Inbox },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/store", label: "Store", icon: Store },
  { href: "/admin/rentals", label: "Rentals", icon: Sofa },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-[#15111d] text-white lg:block">
          <div className="border-b border-white/10 px-5 py-5">
            <Logo variant="admin" />
          </div>
          <nav className="space-y-1 p-3">
            {adminNav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:bg-white/5 hover:text-white"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:hidden">
                Admin
              </p>
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/" className="text-sm font-semibold text-primary hover:underline">
                View site →
              </Link>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-border bg-background px-4 py-2 lg:hidden">
            {adminNav.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
