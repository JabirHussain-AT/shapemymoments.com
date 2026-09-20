"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  Instagram,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { CREATIVE_CATEGORIES, type CreativeCategory } from "@/types";
import { ConfettiBurst } from "@/components/animations/motion";

export default function CreativeRegisterPage() {
  const router = useRouter();
  const [confetti, setConfetti] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [verificationApproved, setVerificationApproved] = useState(false);

  // Form State
  const [category, setCategory] = useState<CreativeCategory>("Photographers");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [bio, setBio] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("5");
  const [skills, setSkills] = useState("");

  // Media
  const [profilePhoto, setProfilePhoto] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
  );
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80"
  );

  // Portfolio Work items
  const [portfolio, setPortfolio] = useState<
    { url: string; caption: string; eventType: string }[]
  >([
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      caption: "Bridal Highlight",
      eventType: "Wedding",
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
      caption: "Celebration Decor",
      eventType: "Birthday",
    },
  ]);

  // Packages / Services
  const [packages, setPackages] = useState<
    { name: string; price: string; description: string }[]
  >([
    {
      name: "Standard Package",
      price: "15000",
      description: "Complete service coverage with gallery delivery.",
    },
  ]);

  // Social Links
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [youtube, setYoutube] = useState("");

  const addPortfolioItem = () => {
    setPortfolio([
      ...portfolio,
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
        caption: "Work Showcase",
        eventType: "Custom Event",
      },
    ]);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const addPackageItem = () => {
    setPackages([
      ...packages,
      { name: "Premium Package", price: "25000", description: "Full day signature service." },
    ]);
  };

  const removePackageItem = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleVerificationRequest = () => {
    setVerificationRequested(true);
    toast.success("Verification request submitted! Our review team will verify your credentials.");
    
    // Simulate instant demo review
    setTimeout(() => {
      setVerificationApproved(true);
      setConfetti(true);
      toast.success("🎉 Verification Approved! Verified Partner Badge activated on your profile.");
      setTimeout(() => setConfetti(false), 1500);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error("Please fill in your name and location.");
      return;
    }

    setConfetti(true);
    toast.success("Profile published successfully to South India's Creative Network!");
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setTimeout(() => {
      router.push(`/creatives/ananya-rao`);
    }, 1200);
  };

  return (
    <div className="section-padding py-10 bg-muted/20 min-h-screen">
      <ConfettiBurst trigger={confetti} />

      <div className="container-page max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" /> Creative &amp; Vendor Onboarding
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Join South India&apos;s Growing Creative Network
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create your portfolio page for Photographers, Hampers, Henna Designers, or Makeup Artists. Get discovered and receive direct WhatsApp leads.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Category & Basic Info */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                1
              </span>
              Basic Details &amp; Category
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="category">Select Creative Category</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CreativeCategory)}
                  className="mt-1.5"
                >
                  {CREATIVE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Brand or Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Zara Mehendi Artistry"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Base Location (City, District) *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Wayanad, Kochi, Kozhikode, Bangalore"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Starting Budget / Rate (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 5000"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="bio">About &amp; Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe your style, experience, and what makes your work special..."
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="exp">Years of Experience</Label>
                <Input
                  id="exp"
                  type="number"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills &amp; Tags (comma separated)</Label>
                <Input
                  id="skills"
                  placeholder="Bridal Henna, Airbrush Makeup, Gourmet Hampers, Candid"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Verification Badge Request */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Request Verification Badge
                  </h3>
                  {verificationApproved ? (
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-extrabold text-white">
                      Verified Partner Active ✓
                    </span>
                  ) : verificationRequested ? (
                    <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
                      Review Pending…
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600 max-w-xl">
                  Verified creatives receive a blue checkmark badge, 3x higher visibility, and trust boost from clients on ShapeMyMoment.
                </p>
              </div>

              {!verificationRequested && (
                <Button
                  type="button"
                  onClick={handleVerificationRequest}
                  className="bg-blue-600 text-white hover:bg-blue-700 shrink-0 gap-2"
                >
                  <ShieldCheck className="h-4 w-4" /> Request Badge
                </Button>
              )}
            </div>

            {verificationApproved && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-100 p-3 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Congratulations! Your profile will feature the official Verified Partner checkmark badge.</span>
              </div>
            )}
          </div>

          {/* Step 3: Photos & Portfolio */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                2
              </span>
              Cover Photo, Profile Picture &amp; Portfolio Works
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="avatar">Profile Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="cover">Cover Banner Image URL</Label>
                <Input
                  id="cover"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Portfolio Works Gallery */}
            <div className="mt-6 border-t border-border/60 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Portfolio Works Done ({portfolio.length})
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPortfolioItem}
                  className="gap-1 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Work Image
                </Button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl border border-border bg-muted/30 p-3 space-y-2"
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.url}
                        alt={`Work ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Input
                      placeholder="Image URL"
                      value={item.url}
                      onChange={(e) => {
                        const copy = [...portfolio];
                        copy[idx].url = e.target.value;
                        setPortfolio(copy);
                      }}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Caption (e.g. Bridal Henna)"
                      value={item.caption}
                      onChange={(e) => {
                        const copy = [...portfolio];
                        copy[idx].caption = e.target.value;
                        setPortfolio(copy);
                      }}
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removePortfolioItem(idx)}
                      className="text-xs text-destructive hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: Social & External Links */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                3
              </span>
              Social Handles &amp; External Portfolio Links
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <Label htmlFor="insta" className="flex items-center gap-1.5">
                  <Instagram className="h-4 w-4 text-pink-600" /> Instagram Link
                </Label>
                <Input
                  id="insta"
                  placeholder="https://instagram.com/yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="web" className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-blue-600" /> Website / Behance
                </Label>
                <Input
                  id="web"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="yt" className="flex items-center gap-1.5">
                  <Youtube className="h-4 w-4 text-red-600" /> YouTube Channel
                </Label>
                <Input
                  id="yt"
                  placeholder="https://youtube.com/@channel"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="lg" className="gap-2 shadow-md">
              Publish Creative Profile <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
