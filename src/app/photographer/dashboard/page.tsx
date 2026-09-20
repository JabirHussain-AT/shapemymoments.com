"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  User,
  CalendarDays,
  Save,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PLAN_FEATURES, PLAN_PRICES } from "@/models/Subscription";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const metrics = [
  { label: "Profile views", value: "1,280" },
  { label: "Leads", value: "14" },
  { label: "Booking requests", value: "6" },
  { label: "Rating", value: "4.9" },
  { label: "Portfolio views", value: "3,400" },
];

export default function CreativeDashboardPage() {
  const router = useRouter();

  // Profile Customization State
  const [profile, setProfile] = useState({
    name: "Ananya Rao",
    category: "Photographers",
    location: "Kalpetta, Wayanad",
    bio: "Documentary-style wedding and celebration photographer capturing emotion with soft natural light and honest moments.",
    startingPrice: 18000,
    specializations: "Candid, Natural Light, Wedding Storytelling, Portraiture",
    serviceLocations: "Kalpetta, Wayanad, Kozhikode, Kochi, Bengaluru",
  });

  // Portfolio Items Customization State
  const [portfolio, setPortfolio] = useState([
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      caption: "Wayanad Resort Wedding",
      eventType: "Wedding",
    },
    {
      url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      caption: "Sunset Reception Couple",
      eventType: "Engagement",
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
      caption: "Outdoor Birthday Celebration",
      eventType: "Birthday",
    },
  ]);

  const [newImage, setNewImage] = useState({ url: "", caption: "", eventType: "Wedding" });

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    toast.success("Signed out");
    router.push("/login");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile details updated successfully!");
  };

  const handleAddPortfolio = () => {
    if (!newImage.url) {
      toast.error("Please enter an image URL");
      return;
    }
    setPortfolio([...portfolio, { ...newImage }]);
    setNewImage({ url: "", caption: "", eventType: "Wedding" });
    toast.success("New portfolio item added!");
  };

  const handleRemovePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
    toast.success("Portfolio item removed");
  };

  const upgrade = async (plan: "FREE" | "PRO" | "PREMIUM") => {
    const res = await fetch("/api/subscriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, photographerId: "ph-ananya-rao" }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success(json.message || `Switched to ${plan}`);
    } else {
      toast.error(json.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-lg">
              Shape<span className="text-primary font-black">My</span>Moment
            </Link>
            <Badge variant="outline" className="text-xs">
              Creative Partner Panel
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[230px_1fr]">
        <nav className="h-fit space-y-1 rounded-2xl border border-border bg-card p-3 shadow-xs">
          {(
            [
              { Icon: LayoutDashboard, label: "Overview" },
              { Icon: User, label: "Profile" },
              { Icon: Camera, label: "Portfolio" },
              { Icon: CalendarDays, label: "Availability" },
              { Icon: Inbox, label: "Leads" },
              { Icon: Star, label: "Reviews" },
              { Icon: CreditCard, label: "Subscription" },
              { Icon: Settings, label: "Settings" },
            ] as const
          ).map(({ Icon, label }) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <Icon className="h-4 w-4 text-primary" /> {label}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          <section id="overview">
            <h1 className="text-2xl font-bold">Partner Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your profile, portfolio showcase, leads and active subscription.</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-border bg-card p-4 shadow-xs"
                >
                  <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Profile Customization Section */}
          <section
            id="profile"
            className="rounded-2xl border border-border bg-card p-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <h2 className="text-lg font-bold">Customize Profile Details</h2>
                <p className="text-xs text-muted-foreground">
                  Update your public brand info, rates, bio and service locations.
                </p>
              </div>
              <Link
                href="/creatives/ananya-rao"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View Public Profile <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Display Name / Studio Title
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Creative Category
                  </label>
                  <select
                    value={profile.category}
                    onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="Photographers">Photographers</option>
                    <option value="Henna Artists">Henna Artists</option>
                    <option value="Makeup Artists">Makeup Artists</option>
                    <option value="Hamper Makers">Hamper Makers</option>
                    <option value="Cake Bakers">Cake Bakers</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Primary Location (Base)
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Starting Package Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.startingPrice}
                    onChange={(e) => setProfile({ ...profile, startingPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Bio &amp; About Experience
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Specializations &amp; Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={profile.specializations}
                  onChange={(e) => setProfile({ ...profile, specializations: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Service Locations Covered
                </label>
                <input
                  type="text"
                  value={profile.serviceLocations}
                  onChange={(e) => setProfile({ ...profile, serviceLocations: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm" className="gap-2">
                  <Save className="h-4 w-4" /> Save Profile Changes
                </Button>
              </div>
            </form>
          </section>

          {/* Portfolio Management Section */}
          <section
            id="portfolio"
            className="rounded-2xl border border-border bg-card p-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <h2 className="text-lg font-bold">Portfolio Showcase &amp; Gallery</h2>
                <p className="text-xs text-muted-foreground">
                  Upload &amp; manage work images displayed on your public portfolio page.
                </p>
              </div>
              <Badge variant="outline" className="font-semibold">
                {portfolio.length} Showcase Items
              </Badge>
            </div>

            {/* Current Portfolio Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {portfolio.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl border border-border bg-background p-2"
                >
                  <Image
                    src={item.url}
                    alt={item.caption || "Portfolio item"}
                    width={400}
                    height={300}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold truncate">{item.caption || `Work ${idx + 1}`}</p>
                      <p className="text-[10px] text-muted-foreground">{item.eventType}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolio(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Portfolio Image */}
            <div className="mt-6 border-t border-border/60 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Add New Portfolio Image
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="url"
                  placeholder="Image URL (Unsplash or direct image link)..."
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Caption (e.g. Wedding Stage Decor)..."
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none"
                />
                <Button type="button" size="sm" onClick={handleAddPortfolio} className="gap-1">
                  <Plus className="h-4 w-4" /> Add to Portfolio
                </Button>
              </div>
            </div>
          </section>

          <section
            id="subscription"
            className="rounded-2xl border border-border bg-card p-6 shadow-xs"
          >
            <h2 className="text-lg font-semibold">Subscription &amp; Verification Badge</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose your partner plan to unlock premium placement and custom portfolio limits.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
                <div key={plan} className="rounded-xl border border-border p-4 bg-background">
                  <p className="font-bold">{plan}</p>
                  <p className="text-sm font-extrabold text-primary">
                    {formatCurrency(PLAN_PRICES[plan])}/mo
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {PLAN_FEATURES[plan].map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    className="mt-4 w-full"
                    variant={plan === "FREE" ? "outline" : "primary"}
                    onClick={() => upgrade(plan)}
                  >
                    Select {plan}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
