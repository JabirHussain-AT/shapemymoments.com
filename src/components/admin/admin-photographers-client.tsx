"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { DemoCreative } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

function getCategoryBadge(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("henna") || c.includes("mehendi")) {
    return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 font-bold">🌿 Henna Artist</Badge>;
  }
  if (c.includes("makeup") || c.includes("style") || c.includes("beauty")) {
    return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 gap-1 font-bold">💄 Makeup Artist</Badge>;
  }
  if (c.includes("hamper") || c.includes("gift")) {
    return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 font-bold">🎁 Hamper Maker</Badge>;
  }
  if (c.includes("cake") || c.includes("baker") || c.includes("dessert")) {
    return <Badge className="bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30 gap-1 font-bold">🎂 Cake Baker</Badge>;
  }
  return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 font-bold">📷 Photographer</Badge>;
}

export function AdminPhotographersClient({ creatives: initial }: { creatives: DemoCreative[] }) {
  const router = useRouter();
  const [creatives, setCreatives] = useState(initial);
  const [editingCreative, setEditingCreative] = useState<DemoCreative | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleFeature = async (p: DemoCreative) => {
    try {
      const res = await fetch(`/api/photographers/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(p.featured ? "Unfeatured partner" : "Featured partner!");
      router.refresh();
      setCreatives(prev => prev.map(item => item.id === p.id ? { ...item, featured: !p.featured } : item));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleToggleStatus = async (p: DemoCreative) => {
    const newStatus = p.status === "APPROVED" ? "SUSPENDED" : "APPROVED";
    try {
      const res = await fetch(`/api/photographers/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(`Partner status updated to ${newStatus}`);
      router.refresh();
      setCreatives(prev => prev.map(item => item.id === p.id ? { ...item, status: newStatus } : item));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCreative) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/photographers/${editingCreative.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingCreative.name,
          phone: editingCreative.phone,
          category: editingCreative.category,
          location: editingCreative.location,
          bio: editingCreative.bio,
          yearsOfExperience: Number(editingCreative.yearsOfExperience || 0),
          startingPrice: Number(editingCreative.startingPrice || 0),
          hourlyRate: Number(editingCreative.hourlyRate || 0),
          subscriptionPlan: editingCreative.subscriptionPlan,
          status: editingCreative.status,
          featured: editingCreative.featured,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update profile");

      toast.success("Partner details updated successfully!");
      setCreatives(prev => prev.map(item => item.id === editingCreative.id ? { ...editingCreative } : item));
      setEditingCreative(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update partner profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {creatives.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No creative partners found. Partner registrations and profiles will appear here once onboarded.
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Creative Partner</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Contact Phone</th>
                <th className="px-4 py-3 font-bold">Rates</th>
                <th className="px-4 py-3 font-bold">Plan &amp; Status</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creatives.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/20 transition">
                  <td className="px-4 py-4">
                    <p className="font-extrabold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      ★ {p.rating > 0 ? p.rating.toFixed(1) : "1.0"} · {p.yearsOfExperience || 0} yrs exp
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {getCategoryBadge(p.category)}
                  </td>
                  <td className="px-4 py-4 font-medium">{p.location || "—"}</td>
                  <td className="px-4 py-4 font-mono text-xs text-foreground font-bold">
                    {p.phone ? p.phone : <span className="text-muted-foreground font-normal">Not provided</span>}
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold">
                    <p className="text-emerald-600 font-extrabold">Full Day: {p.startingPrice ? formatCurrency(p.startingPrice) : "Not set"}</p>
                    <p className="text-muted-foreground text-[11px]">Hourly: {p.hourlyRate ? formatCurrency(p.hourlyRate) : "Not set"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="font-bold">{p.subscriptionPlan || "FREE"}</Badge>
                      <Badge variant={p.status === "APPROVED" ? "success" : "warning"} className="font-bold">{p.status}</Badge>
                      {p.featured && <Badge variant="gold" className="font-bold">Featured</Badge>}
                      <Badge className="bg-emerald-600 text-white font-bold">Partnered</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-semibold"
                        onClick={() => setEditingCreative({ ...p })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs font-semibold"
                        onClick={() => handleToggleFeature(p)}
                      >
                        {p.featured ? "Unfeature" : "Feature"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-7 text-xs font-semibold ${p.status === "APPROVED" ? "text-rose-500 hover:text-rose-600" : "text-emerald-600"}`}
                        onClick={() => handleToggleStatus(p)}
                      >
                        {p.status === "APPROVED" ? "Suspend" : "Approve"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Partner Modal */}
      {editingCreative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold">Edit Partner Profile: {editingCreative.name}</h2>
              <button
                onClick={() => setEditingCreative(null)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <Label className="font-bold">Partner / Business Name *</Label>
                <Input
                  className="text-xs mt-1"
                  value={editingCreative.name}
                  onChange={(e) => setEditingCreative({ ...editingCreative, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-bold">Contact Phone Number *</Label>
                  <Input
                    className="text-xs mt-1 font-mono"
                    placeholder="e.g. +91 9876543210"
                    value={editingCreative.phone || ""}
                    onChange={(e) => setEditingCreative({ ...editingCreative, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="font-bold">Category *</Label>
                  <select
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold mt-1"
                    value={editingCreative.category}
                    onChange={(e) => setEditingCreative({ ...editingCreative, category: e.target.value })}
                  >
                    <option value="Photographers">Photographers</option>
                    <option value="Henna Artists">Henna Artists</option>
                    <option value="Makeup Artists">Makeup Artists</option>
                    <option value="Hamper Makers">Hamper Makers</option>
                    <option value="Cake Bakers">Cake Bakers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-bold">Location (City / District) *</Label>
                  <Input
                    className="text-xs mt-1"
                    value={editingCreative.location}
                    onChange={(e) => setEditingCreative({ ...editingCreative, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="font-bold">Years of Experience</Label>
                  <Input
                    type="number"
                    min={0}
                    className="text-xs mt-1"
                    value={editingCreative.yearsOfExperience}
                    onChange={(e) => setEditingCreative({ ...editingCreative, yearsOfExperience: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label className="font-bold">Bio &amp; Description</Label>
                <Textarea
                  rows={3}
                  className="text-xs mt-1"
                  placeholder="Describe the partner's style, specialties and background..."
                  value={editingCreative.bio}
                  onChange={(e) => setEditingCreative({ ...editingCreative, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-bold">Starting Full Day Rate (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="text-xs mt-1"
                    value={editingCreative.startingPrice}
                    onChange={(e) => setEditingCreative({ ...editingCreative, startingPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="font-bold">Hourly Rate (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="text-xs mt-1"
                    value={editingCreative.hourlyRate}
                    onChange={(e) => setEditingCreative({ ...editingCreative, hourlyRate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-bold">Subscription Plan</Label>
                  <select
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold mt-1"
                    value={editingCreative.subscriptionPlan}
                    onChange={(e) => setEditingCreative({ ...editingCreative, subscriptionPlan: e.target.value })}
                  >
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
                <div>
                  <Label className="font-bold">Approval Status</Label>
                  <select
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold mt-1"
                    value={editingCreative.status}
                    onChange={(e) => setEditingCreative({ ...editingCreative, status: e.target.value })}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={editingCreative.featured}
                  onChange={(e) => setEditingCreative({ ...editingCreative, featured: e.target.checked })}
                  className="rounded border-border h-4 w-4"
                />
                <Label htmlFor="featured-check" className="font-bold cursor-pointer">
                  Feature on Homepage Showcase
                </Label>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCreative(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Saving Changes..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
