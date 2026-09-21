"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Star,
  User,
  CalendarDays,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  Quote,
  MapPin,
  MessageCircle,
  DollarSign,
  BarChart3,
  Inbox,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { PLAN_PRICES } from "@/models/Subscription";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ConfettiBurst } from "@/components/animations/motion";

interface IReviewData {
  _id: string;
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  eventType: string;
  date: string;
}

interface IInquiryData {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: number;
  phone: string;
  message: string;
  status: "NEW" | "CONTACTED" | "BOOKED";
  createdAt: string;
}

interface IDateNote {
  date: string;
  note: string;
  status: "Reserved" | "Available" | "Holiday";
}

const CREATIVE_QUOTES = [
  { text: "Every moment you capture creates a story that lasts forever.", author: "ShapeMyMoment Community" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
  { text: "Your passion transforms ordinary celebrations into extraordinary memories.", author: "ShapeMyMoment Concierge" },
  { text: "To create one's own world takes courage and vision.", author: "Georgia O'Keeffe" },
];

const MAX_PORTFOLIO_ITEMS = 12;

export default function CreativeDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "portfolio" | "inquiries" | "calendar" | "reviews" | "subscription"
  >("overview");

  const [quoteIndex, setQuoteIndex] = useState(0);

  // User & Photographer MongoDB data state
  const [photographerSlug, setPhotographerSlug] = useState("");
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [completedWorksCount, setCompletedWorksCount] = useState(0);

  const [instagramUrl, setInstagramUrl] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    category: "Photographers",
    location: "",
    startingPrice: 0,
    hourlyRate: 0,
    bio: "",
    yearsOfExperience: 1,
    specializations: "",
    serviceLocations: "",
    eventTypes: "Wedding, Birthday, Engagement",
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
    availability: "Available",
  });

  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState("ALL");

  // Package custom Lists (Includes, Excludes, Guarantees)
  const [includesList, setIncludesList] = useState<string[]>([]);
  const [newIncludeItem, setNewIncludeItem] = useState("");

  const [excludesList, setExcludesList] = useState<string[]>([]);
  const [newExcludeItem, setNewExcludeItem] = useState("");

  const [guaranteesList, setGuaranteesList] = useState<string[]>([]);
  const [newGuaranteeItem, setNewGuaranteeItem] = useState("");

  // Portfolio state (Max 12 items)
  const [portfolio, setPortfolio] = useState<
    { url: string; caption?: string; eventType?: string }[]
  >([]);

  // Add Portfolio Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    url: "",
    caption: "",
    eventType: "Wedding",
  });

  // Availability calendar with Notes
  const [dateNotes, setDateNotes] = useState<IDateNote[]>([]);
  const [newDateStr, setNewDateStr] = useState("");
  const [newDateNoteStr, setNewDateNoteStr] = useState("");
  const [newDateStatusStr, setNewDateStatusStr] = useState<"Reserved" | "Available" | "Holiday">("Reserved");

  // Inquiries & Client Leads
  const [inquiries, setInquiries] = useState<IInquiryData[]>([]);

  // Customer reviews state
  const [reviews, setReviews] = useState<IReviewData[]>([]);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photographer/me");
      const json = await res.json();
      if (!json.success) {
        if (res.status === 401) {
          router.push("/login?next=/photographer/dashboard");
          return;
        }
        throw new Error(json.error);
      }

      const p = json.data.photographer;
      if (p) {
        setPhotographerSlug(p.slug || "");
        setCurrentPlan(p.subscriptionPlan || "FREE");
        setTotalEarnings(p.totalEarnings || 0);
        setCompletedWorksCount(p.completedWorksCount || 0);

        setProfile({
          name: p.name || json.data.user?.name || "",
          category: p.category || "Photographers",
          location: p.location || "",
          startingPrice: p.startingPrice || 0,
          hourlyRate: p.hourlyRate !== undefined ? p.hourlyRate : Math.round((p.startingPrice || 0) / 4),
          bio: p.bio || "",
          yearsOfExperience: p.yearsOfExperience || 1,
          specializations: Array.isArray(p.specializations) ? p.specializations.join(", ") : p.specializations || "",
          serviceLocations: Array.isArray(p.serviceLocations) ? p.serviceLocations.join(", ") : p.serviceLocations || "",
          eventTypes: Array.isArray(p.eventTypes) ? p.eventTypes.join(", ") : p.eventTypes || "Wedding, Birthday, Engagement",
          profilePhoto: p.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
          coverImage: p.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
          availability: p.availability || "Available",
        });
        if (p.socialLinks?.instagram) setInstagramUrl(p.socialLinks.instagram);
        if (Array.isArray(p.portfolio)) setPortfolio(p.portfolio);
        if (Array.isArray(p.includes)) setIncludesList(p.includes);
        if (Array.isArray(p.excludes)) setExcludesList(p.excludes);
        if (Array.isArray(p.guarantees)) setGuaranteesList(p.guarantees);
        if (Array.isArray(p.dateNotes)) setDateNotes(p.dateNotes);
        if (Array.isArray(p.inquiries)) setInquiries(p.inquiries);
      }
      if (Array.isArray(json.data.reviews)) {
        setReviews(json.data.reviews);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load creative profile");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMe();
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CREATIVE_QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchMe]);

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const handleCloudinaryUpload = async (file: File, onSuccess: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      onSuccess(json.data.url);
      toast.success("✨ Image uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    let formattedInsta = instagramUrl.trim();
    if (formattedInsta && !formattedInsta.startsWith("http://") && !formattedInsta.startsWith("https://")) {
      const cleanHandle = formattedInsta.replace(/^@/, "");
      formattedInsta = `https://instagram.com/${cleanHandle}`;
    }

    try {
      const res = await fetch("/api/photographer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          location: profile.location,
          startingPrice: profile.startingPrice,
          hourlyRate: profile.hourlyRate,
          bio: profile.bio,
          yearsOfExperience: profile.yearsOfExperience,
          specializations: profile.specializations,
          eventTypes: profile.eventTypes,
          serviceLocations: profile.serviceLocations,
          profilePhoto: profile.profilePhoto,
          coverImage: profile.coverImage,
          availability: profile.availability,
          portfolio,
          includes: includesList,
          excludes: excludesList,
          guarantees: guaranteesList,
          dateNotes,
          socialLinks: { instagram: formattedInsta },
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
      toast.success("🎉 Profile, portfolio & package details saved successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Add portfolio item with Max 3 Categories & Max 4 Images per Category validation
  const handleAddPortfolioItem = () => {
    if (portfolio.length >= MAX_PORTFOLIO_ITEMS) {
      toast.error(`Maximum limit of ${MAX_PORTFOLIO_ITEMS} total portfolio images reached.`);
      return;
    }
    if (!newImage.url) {
      toast.error("Please provide or upload an image file.");
      return;
    }

    const selectedCategory = (newImage.eventType || "Wedding").trim();
    const existingCategories = Array.from(new Set(portfolio.map((item) => item.eventType || "Wedding")));
    const isNewCategory = !existingCategories.includes(selectedCategory);

    if (isNewCategory && existingCategories.length >= 3) {
      toast.error(`Free Version Limit: Maximum 3 event categories allowed (Active: ${existingCategories.join(", ")}). Upgrade to Pro for unlimited categories!`);
      return;
    }

    const categoryImageCount = portfolio.filter((item) => (item.eventType || "Wedding") === selectedCategory).length;
    if (categoryImageCount >= 4) {
      toast.error(`Category Limit Reached: Maximum 4 images allowed for "${selectedCategory}" on Free version.`);
      return;
    }

    const updated = [...portfolio, { ...newImage, eventType: selectedCategory }];
    setPortfolio(updated);
    setNewImage({ url: "", caption: "", eventType: "Wedding" });
    setIsAddModalOpen(false);
    toast.success(`✨ Work added to "${selectedCategory}" portfolio! Click 'Save All Changes' to sync.`);
  };

  const handleRemovePortfolioItem = (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index);
    setPortfolio(updated);
    toast.success("Item removed from portfolio showcase.");
  };

  // Date Note handlers
  const handleAddDateNote = () => {
    if (!newDateStr) {
      toast.error("Please select a date.");
      return;
    }
    if (!newDateNoteStr) {
      toast.error("Please enter a note for this date.");
      return;
    }
    const updated = [...dateNotes.filter((d) => d.date !== newDateStr), { date: newDateStr, note: newDateNoteStr, status: newDateStatusStr }];
    setDateNotes(updated);
    setNewDateStr("");
    setNewDateNoteStr("");
    toast.success(`Date note saved for ${newDateStr}.`);
  };

  const handleRemoveDateNote = (dateStr: string) => {
    const updated = dateNotes.filter((d) => d.date !== dateStr);
    setDateNotes(updated);
    toast.success(`Date note removed for ${dateStr}.`);
  };

  // Includes / Excludes / Guarantees handlers
  const handleAddInclude = () => {
    if (!newIncludeItem.trim()) return;
    setIncludesList([...includesList, newIncludeItem.trim()]);
    setNewIncludeItem("");
  };

  const handleAddExclude = () => {
    if (!newExcludeItem.trim()) return;
    setExcludesList([...excludesList, newExcludeItem.trim()]);
    setNewExcludeItem("");
  };

  const handleAddGuarantee = () => {
    if (!newGuaranteeItem.trim()) return;
    setGuaranteesList([...guaranteesList, newGuaranteeItem.trim()]);
    setNewGuaranteeItem("");
  };

  // Setup Progress Checklist
  const setupSteps = [
    {
      id: 1,
      title: "Basic Studio Details",
      desc: "Set studio name, location, and bio",
      completed: Boolean(profile.name && profile.location),
    },
    {
      id: 2,
      title: "Pricing & Starting Rate",
      desc: "Specify starting rates for clients",
      completed: Number(profile.startingPrice) > 0,
    },
    {
      id: 3,
      title: "Portfolio Showcase (Max 12)",
      desc: "Upload at least 1 work image",
      completed: portfolio.length > 0,
    },
    {
      id: 4,
      title: "Availability Calendar",
      desc: "Set general availability & date notes",
      completed: Boolean(profile.availability),
    },
  ];

  const completedStepsCount = setupSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedStepsCount / setupSteps.length) * 100);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">
            Loading Creative Partner Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <ConfettiBurst trigger={confetti} />

      {/* Top Header Navigation */}
      <header className="border-b border-border bg-card/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-lg tracking-tight">
              Shape<span className="text-primary">My</span>Moment
            </Link>
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Creative Partner Studio
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Button */}
            <Button
              onClick={() => handleProfileSave()}
              size="sm"
              disabled={saving}
              className="gap-1.5 bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save All Changes"}
            </Button>

            {/* Availability Quick Toggle Pill */}
            <select
              value={profile.availability}
              onChange={(e) => {
                setProfile({ ...profile, availability: e.target.value });
                toast.success(`Status updated to "${e.target.value}". Click Save to persist.`);
              }}
              className="hidden md:block rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none cursor-pointer"
            >
              <option value="Available">🟢 Available for Bookings</option>
              <option value="Limited">🟡 Limited Slots Only</option>
              <option value="Booked">🔴 Fully Booked</option>
            </select>

            <ThemeToggle />

            <Button variant="ghost" size="sm" onClick={logout} className="gap-1 text-xs text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Studio Header Banner */}
      <div className="relative border-b border-border bg-gradient-to-r from-primary/10 via-card to-card py-6 overflow-hidden">
        <div className="container-page flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-primary bg-muted shadow-md">
              <Image src={profile.profilePhoto} alt={profile.name} fill className="object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {profile.name || "Creative Partner Studio"}
                </h1>
                <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider">
                  {currentPlan} Partner
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                {profile.location || "Wayanad"} · {profile.category}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {photographerSlug && (
              <Link href={`/creatives/${photographerSlug}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10">
                  <ExternalLink className="h-3.5 w-3.5" /> View Public Page
                </Button>
              </Link>
            )}

            {/* Total Earnings Metric Header */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center shadow-2xs">
              <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Total Earnings</p>
              <p className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                {formatCurrency(totalEarnings)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background px-3.5 py-2 text-center shadow-2xs">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Works Done</p>
              <p className="text-sm font-extrabold text-foreground flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {completedWorksCount} Events
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background px-3.5 py-2 text-center shadow-2xs">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Portfolio</p>
              <p className="text-sm font-extrabold text-foreground flex items-center justify-center gap-1">
                <Camera className="h-3.5 w-3.5 text-emerald-600" /> {portfolio.length}/{MAX_PORTFOLIO_ITEMS}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container-page py-8 space-y-8">
        {/* Animated Creative Quote */}
        <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Quote className="h-5 w-5" />
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-semibold text-foreground italic leading-relaxed"
                >
                  &ldquo;{CREATIVE_QUOTES[quoteIndex].text}&rdquo;
                </motion.p>
              </AnimatePresence>
              <p className="text-[10px] text-muted-foreground font-bold mt-0.5">
                — {CREATIVE_QUOTES[quoteIndex].author}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setQuoteIndex((prev) => (prev + 1) % CREATIVE_QUOTES.length)}
            className="text-[11px] font-bold text-primary hover:underline shrink-0"
          >
            Next Quote →
          </button>
        </div>

        {/* Dashboard Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
          {[
            { id: "overview", label: "Overview & Earnings", icon: LayoutDashboard },
            { id: "profile", label: "Profile & Studio Details", icon: User },
            { id: "portfolio", label: `Portfolio Showcase (${portfolio.length}/${MAX_PORTFOLIO_ITEMS})`, icon: Camera },
            { id: "inquiries", label: `Inquiries & Leads (${inquiries.length})`, icon: Inbox },
            { id: "calendar", label: `Availability Calendar (${dateNotes.length})`, icon: CalendarDays },
            { id: "reviews", label: `Feedbacks (${reviews.length})`, icon: Star },
            { id: "subscription", label: "Subscription Plan", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & EARNINGS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Metrics Cards & 2 Small Graphs */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* GRAPH 1: Works Executed Bar Chart */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" /> Works Executed Graph
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total Completed Events: <strong className="text-foreground">{completedWorksCount} Works</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Monthly Activity
                  </span>
                </div>

                {/* SVG Small Bar Chart for Works */}
                <div className="h-36 w-full flex items-end justify-between gap-2 pt-4 px-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, idx) => {
                    const worksVal = completedWorksCount === 0 ? 0 : Math.max(1, Math.round(completedWorksCount / (6 - idx)));
                    const heightPercent = completedWorksCount === 0 ? 0 : Math.min(100, Math.max(15, (worksVal / Math.max(completedWorksCount, 1)) * 100));
                    return (
                      <div key={m} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-muted/40 rounded-t-lg h-24 relative flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6 }}
                            className="w-3/4 bg-primary rounded-t-md transition group-hover:bg-primary/80"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground">{m}</span>
                        <span className="text-[10px] font-extrabold text-foreground">{worksVal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GRAPH 2: Earnings & Income Chart */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <DollarSign className="h-5 w-5 text-emerald-600" /> Income &amp; Payouts Graph
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total Earnings: <strong className="text-emerald-700 dark:text-emerald-400 font-black">{formatCurrency(totalEarnings)}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Admin Payout Verified
                  </span>
                </div>

                {/* SVG Small Area/Bar Chart for Income */}
                <div className="h-36 w-full flex items-end justify-between gap-2 pt-4 px-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, idx) => {
                    const incomeVal = totalEarnings === 0 ? 0 : Math.round((totalEarnings / 6) * (1 + (idx % 3) * 0.2));
                    const heightPercent = totalEarnings === 0 ? 0 : Math.min(100, Math.max(15, (incomeVal / Math.max(totalEarnings, 1)) * 100));
                    return (
                      <div key={m} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-emerald-500/10 rounded-t-lg h-24 relative flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6 }}
                            className="w-3/4 bg-emerald-600 dark:bg-emerald-400 rounded-t-md transition group-hover:bg-emerald-500"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground">{m}</span>
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                          {incomeVal > 0 ? `₹${Math.round(incomeVal / 1000)}k` : "₹0"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Admin Payout Notice Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-bold">Admin Managed Earnings:</strong> Our ShapeMyMoment Concierge team updates your earnings &amp; completed works count directly from the Admin Panel whenever a project assignment is completed and payouts are released.
              </p>
            </div>

            {/* Onboarding Checklist */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-primary">{progressPercent}%</span>
                    <h2 className="text-lg font-bold">Profile Onboarding Checklist</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete your profile form and portfolio images to appear at the top of South India search queries!
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-bold w-fit">
                  {completedStepsCount} of {setupSteps.length} Steps Completed
                </Badge>
              </div>

              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8 }}
                  className="bg-primary h-full rounded-full"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {setupSteps.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-2xl border p-4 flex items-start gap-3 transition ${
                      s.completed
                        ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {s.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & STUDIO DETAILS */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <form onSubmit={handleProfileSave} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">Studio &amp; Brand Details</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your creative partner profile information visible to event hosts.
                  </p>
                </div>
                <Button type="submit" disabled={saving} size="sm" className="gap-1.5 font-bold text-xs bg-primary">
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold">Studio / Brand Name *</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold">Base Location (City) *</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold">Starting Daily / Full Event Rate (₹ / Day) *</label>
                  <input
                    type="number"
                    value={profile.startingPrice}
                    onChange={(e) => setProfile({ ...profile, startingPrice: Number(e.target.value) })}
                    placeholder="e.g. 10000"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Starting daily budget for full event coverage</p>
                </div>

                <div>
                  <label className="block text-xs font-bold">Starting Hourly Rate (₹ / Hour) *</label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
                    placeholder="e.g. 2500"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Starting hourly rate for short event bookings</p>
                </div>

                <div>
                  <label className="block text-xs font-bold">Years of Experience *</label>
                  <input
                    type="number"
                    value={profile.yearsOfExperience}
                    onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold">Experienced Event Categories (Comma-separated)</label>
                  <input
                    type="text"
                    value={profile.eventTypes}
                    onChange={(e) => setProfile({ ...profile, eventTypes: e.target.value })}
                    placeholder="e.g. Wedding, Birthday, Engagement, Mehendi"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Top categories you cover (e.g. Wedding, Birthday)</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold">Bio &amp; Creative Style Description *</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold">Specializations / Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={profile.specializations}
                    onChange={(e) => setProfile({ ...profile, specializations: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Bridal Photography, Airbrush Makeup, Drone Aerial Shots, Custom Gift Hampers"
                  />
                </div>

                <div className="sm:col-span-2 border-t border-border/60 pt-4">
                  <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Instagram className="h-4 w-4 text-pink-600" /> Instagram Handle / Profile Link
                  </label>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="e.g. https://instagram.com/your_studio_handle or @your_studio_handle"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Connecting your Instagram profile allows event hosts to view your work portfolio. <em>Note: Clicking your Instagram link on your public profile will display a warning notifying clients that direct off-platform bookings are not covered by ShapeMyMoment guarantees.</em>
                  </p>
                </div>
              </div>
            </form>

            {/* Custom Includes, Excludes, Guarantees Editor */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-border pb-3">
                <h2 className="text-lg font-extrabold text-foreground">Package Terms &amp; Guarantees Editor</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize what&apos;s included and excluded in your standard booking package displayed on your public portfolio page.
                </p>
              </div>

              {/* INCLUDES EDITOR */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  ✅ What&apos;s Included in Your Service Package:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add package feature (e.g. High-res edited photos, Professional gear)..."
                    value={newIncludeItem}
                    onChange={(e) => setNewIncludeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                  <Button type="button" size="sm" onClick={handleAddInclude} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1">
                    <Plus className="h-4 w-4" /> Add Include
                  </Button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {includesList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 text-foreground font-medium">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" /> {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIncludesList(includesList.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-red-500 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXCLUDES EDITOR */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  ❌ What&apos;s Excluded (Requires Add-on / Extra):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add excluded item (e.g. Travel beyond 100km, Printed album)..."
                    value={newExcludeItem}
                    onChange={(e) => setNewExcludeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                  <Button type="button" size="sm" onClick={handleAddExclude} variant="outline" className="font-bold text-xs gap-1 border-rose-500/30 text-rose-600">
                    <Plus className="h-4 w-4" /> Add Exclude
                  </Button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {excludesList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 text-foreground font-medium">
                        <X className="h-4 w-4 text-rose-600 shrink-0" /> {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExcludesList(excludesList.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-red-500 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* GUARANTEES EDITOR */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                  🛡️ Partner Guarantees &amp; Quality Promises:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add guarantee promise (e.g. 100% On-time delivery guarantee)..."
                    value={newGuaranteeItem}
                    onChange={(e) => setNewGuaranteeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                  <Button type="button" size="sm" onClick={handleAddGuarantee} variant="secondary" className="font-bold text-xs gap-1">
                    <Plus className="h-4 w-4" /> Add Guarantee
                  </Button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {guaranteesList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 text-foreground font-medium">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" /> {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuaranteesList(guaranteesList.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-red-500 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIO SHOWCASE */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Portfolio Work Showcase</h2>
                  <Badge variant="outline" className="text-xs font-bold">
                    {portfolio.length} / {MAX_PORTFOLIO_ITEMS} Uploaded
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Organize your best work by category. Free plan allows up to <strong>3 categories</strong> &amp; <strong>4 images per category</strong>.
                </p>
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                disabled={portfolio.length >= MAX_PORTFOLIO_ITEMS}
                className="gap-1.5 font-bold text-xs bg-primary"
              >
                <Plus className="h-4 w-4" /> Add Work to Portfolio
              </Button>
            </div>

            {/* Category Rules Notice Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong>Free Version Limits:</strong> Up to <strong>3 event categories</strong> (e.g. Wedding, Birthday, Engagement) with max <strong>4 images per category</strong>.
                </span>
              </div>
              <Badge variant="outline" className="font-bold text-[11px] text-primary shrink-0">
                {Array.from(new Set(portfolio.map((i) => i.eventType || "Wedding"))).length} / 3 Categories Active
              </Badge>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <button
                type="button"
                onClick={() => setPortfolioCategoryFilter("ALL")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  portfolioCategoryFilter === "ALL"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All Works ({portfolio.length})
              </button>
              {Array.from(new Set(portfolio.map((i) => i.eventType || "Wedding"))).map((cat) => {
                const count = portfolio.filter((i) => (i.eventType || "Wedding") === cat).length;
                const active = portfolioCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPortfolioCategoryFilter(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-card border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-80 font-mono">({count}/4)</span>
                  </button>
                );
              })}
            </div>

            {/* Portfolio Grid */}
            {portfolio.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground">No Portfolio Images Uploaded</h3>
                <p className="text-xs max-w-md mx-auto">
                  Showcase up to 3 event categories (e.g. Wedding, Birthday, Engagement) with 4 high-res photos each to attract clients.
                </p>
                <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="bg-primary text-primary-foreground font-bold text-xs gap-1.5 mt-2">
                  <Plus className="h-4 w-4" /> Upload First Portfolio Work
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {portfolio
                  .filter((item) => portfolioCategoryFilter === "ALL" || (item.eventType || "Wedding") === portfolioCategoryFilter)
                  .map((item, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xs">
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image src={item.url} alt={item.caption || "Portfolio item"} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioItem(idx)}
                          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Remove image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {item.eventType && (
                          <Badge className="absolute left-2 top-2 bg-black/70 text-white text-[10px]">
                            {item.eventType}
                          </Badge>
                        )}
                      </div>
                      {item.caption && (
                        <div className="p-3">
                          <p className="text-xs font-medium text-foreground truncate">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Add Portfolio Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-base">Add Portfolio Image</h3>
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">Image File Upload (Cloudinary)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleCloudinaryUpload(file, (url) => setNewImage({ ...newImage, url }));
                          }
                        }}
                        className="w-full text-xs"
                      />
                      {uploading && <p className="text-xs text-primary font-bold mt-1">Uploading image...</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Image URL</label>
                      <input
                        type="url"
                        placeholder="https://res.cloudinary.com/..."
                        value={newImage.url}
                        onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Event Type</label>
                      <select
                        value={newImage.eventType}
                        onChange={(e) => setNewImage({ ...newImage, eventType: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Mehendi">Mehendi</option>
                        <option value="Portfolio">Portfolio Shoot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Caption / Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Wayanad Resort Wedding Shoot"
                        value={newImage.caption}
                        onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddPortfolioItem} className="bg-primary text-primary-foreground font-bold">
                      Add Image
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INQUIRIES & CLIENT LEADS */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-primary" /> Client Profile Inquiries
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Inquiries received from clients viewing your public portfolio.
                </p>
              </div>
              <Badge variant="outline" className="font-bold text-xs">
                {inquiries.length} Active Leads
              </Badge>
            </div>

            {inquiries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground">No Inquiries Received Yet</h3>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  Direct client inquiries for your studio will appear here once event hosts reach out through your public portfolio profile page.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground">{inq.clientName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" /> {inq.location} · {inq.eventType}
                        </p>
                      </div>
                      <Badge variant={inq.status === "NEW" ? "default" : "outline"}>
                        {inq.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Event Date</span>
                        <p className="font-bold text-foreground">{inq.eventDate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Client Budget</span>
                        <p className="font-bold text-emerald-600">{formatCurrency(inq.budget)}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl leading-relaxed">
                      &ldquo;{inq.message}&rdquo;
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/60">
                      <span className="text-[10px] text-muted-foreground font-medium">{inq.createdAt}</span>
                      <a
                        href={getWhatsAppUrl(`Hi ${inq.clientName}! I received your ${inq.eventType} inquiry on ShapeMyMoment for ${inq.eventDate}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 h-8">
                          <MessageCircle className="h-3.5 w-3.5" /> Connect on WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AVAILABILITY CALENDAR & DATE NOTES */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" /> Availability Calendar &amp; Date Notes
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mark dates as reserved or available and add custom notes for scheduled events.
                  </p>
                </div>
              </div>

              {/* Add Date Note Form */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Plus className="h-4 w-4" /> Add Date &amp; Scheduled Note
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">Select Date *</label>
                    <input
                      type="date"
                      value={newDateStr}
                      onChange={(e) => setNewDateStr(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">Status *</label>
                    <select
                      value={newDateStatusStr}
                      onChange={(e) => setNewDateStatusStr(e.target.value as "Reserved" | "Available" | "Holiday")}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
                    >
                      <option value="Reserved">🔴 Reserved / Booked</option>
                      <option value="Available">🟢 Available</option>
                      <option value="Holiday">🟡 Holiday / Off</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">Date Note *</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding Shoot at Wayanad Resort"
                      value={newDateNoteStr}
                      onChange={(e) => setNewDateNoteStr(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
                <Button size="sm" onClick={handleAddDateNote} className="bg-primary text-primary-foreground font-bold text-xs gap-1">
                  <Save className="h-3.5 w-3.5" /> Save Date Note
                </Button>
              </div>

              {/* Scheduled Date Notes List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scheduled Dates &amp; Notes:</h3>
                {dateNotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No date notes recorded yet.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {dateNotes.map((d, i) => (
                      <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs font-mono">{d.date}</span>
                            <Badge variant={d.status === "Reserved" ? "default" : "outline"} className="text-[10px]">
                              {d.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{d.note}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDateNote(d.date)}
                          className="text-muted-foreground hover:text-red-600 text-xs"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS & FEEDBACKS */}
        {activeTab === "reviews" && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-400" /> Client Reviews &amp; Feedback
            </h2>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                <p className="font-bold text-foreground text-sm">No reviews received yet</p>
                <p className="text-xs mt-1">Client reviews submitted on your public profile will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-2xl border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{r.name}</p>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" /> {r.rating}.0
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">&ldquo;{r.review}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SUBSCRIPTION PLAN */}
        {activeTab === "subscription" && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Partner Subscription Plan
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your subscription tier and partner benefits.
                </p>
              </div>
              <Badge variant="outline" className="w-fit text-xs font-bold text-amber-600 border-amber-500/40 bg-amber-500/10 gap-1.5 py-1 px-3">
                🔒 Subscription Upgrades Disabled by Admin
              </Badge>
            </div>

            {/* Warning Banner */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start sm:items-center gap-3 text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm">🔒 Subscription Plan Selection Locked</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Paid subscription plan upgrades are currently disabled by Admin. All registered partners enjoy active Free tier benefits with zero commission fees during this promotional phase.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
                <div
                  key={plan}
                  className={`rounded-2xl border p-6 space-y-4 ${
                    currentPlan === plan ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-lg">{plan}</h3>
                    {currentPlan === plan && <Badge variant="default">Active Tier</Badge>}
                  </div>
                  <p className="text-2xl font-black text-foreground">
                    {PLAN_PRICES[plan] === 0 ? "Free Access" : `₹${PLAN_PRICES[plan]} / year`}
                  </p>
                  <Button
                    size="sm"
                    disabled
                    variant="outline"
                    className="w-full text-xs font-bold opacity-70 cursor-not-allowed bg-muted text-muted-foreground border-border"
                  >
                    🔒 Locked by Admin
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
