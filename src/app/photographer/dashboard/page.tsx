"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  UploadCloud,
  Lock,
  Key,
  Share2,
  Copy,
  Phone,
  Mail,
  Settings,
  Sliders,
  BadgeCheck,
  CheckCheck,
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

// Aesthetic presets for quick 1-tap cover & avatar setup
const PRESET_COVERS = [
  { label: "Luxury Wedding", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80" },
  { label: "Golden Hour Couple", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=80" },
  { label: "Celebration Lights", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80" },
  { label: "Editorial Bridal", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1400&q=80" },
  { label: "Festive Night", url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1400&q=80" },
];

const PRESET_AVATARS = [
  { label: "Studio Portrait", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
  { label: "Creative Lens", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { label: "Outdoor Artist", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80" },
  { label: "Pro Photographer", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

/**
 * XMLHttpRequest-based uploader that reports real byte-level progress
 */
function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.min(95, Math.round((event.loaded / event.total) * 100));
        onProgress(percent);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success && data.data?.url) {
              onProgress(100);
              resolve(data.data.url);
            } else {
              reject(new Error(data.error || "Upload failed"));
            }
          } catch {
            reject(new Error("Invalid server response"));
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            reject(new Error(data.error || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network connection error during upload"));
    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  });
}

export default function CreativeDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "portfolio" | "inquiries" | "calendar" | "reviews" | "subscription" | "account"
  >("overview");

  const [quoteIndex, setQuoteIndex] = useState(0);

  // Partner data state
  const [photographerSlug, setPhotographerSlug] = useState("");
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [completedWorksCount, setCompletedWorksCount] = useState(0);

  const [instagramUrl, setInstagramUrl] = useState("");

  // User Account state
  const [userAccount, setUserAccount] = useState({
    name: "",
    email: "",
    phone: "",
    role: "PHOTOGRAPHER",
  });

  // Password Change state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile fields state
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

  // Portfolio filter & list
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState("ALL");
  const [portfolio, setPortfolio] = useState<
    { url: string; caption?: string; eventType?: string }[]
  >([]);

  // Package custom Lists
  const [includesList, setIncludesList] = useState<string[]>([]);
  const [newIncludeItem, setNewIncludeItem] = useState("");
  const [excludesList, setExcludesList] = useState<string[]>([]);
  const [newExcludeItem, setNewExcludeItem] = useState("");
  const [guaranteesList, setGuaranteesList] = useState<string[]>([]);
  const [newGuaranteeItem, setNewGuaranteeItem] = useState("");

  // Availability calendar state
  const [dateNotes, setDateNotes] = useState<IDateNote[]>([]);
  const [newDateStr, setNewDateStr] = useState("");
  const [newDateNoteStr, setNewDateNoteStr] = useState("");
  const [newDateStatusStr, setNewDateStatusStr] = useState<"Reserved" | "Available" | "Holiday">("Reserved");

  // Inquiries & Reviews
  const [inquiries, setInquiries] = useState<IInquiryData[]>([]);
  const [reviews, setReviews] = useState<IReviewData[]>([]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Upload progress states
  const [portfolioUploadProgress, setPortfolioUploadProgress] = useState(0);
  const [portfolioUploading, setPortfolioUploading] = useState(false);
  const [portfolioPreviewUrl, setPortfolioPreviewUrl] = useState("");
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    url: "",
    caption: "",
    eventType: "Wedding",
  });

  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);

  // File input refs for fast click-to-upload
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const portfolioFileRef = useRef<HTMLInputElement>(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photographer/me");
      const json = await res.json();
      if (!json.success) {
        if (res.status === 401) {
          router.push("/creatives/login");
          return;
        }
        throw new Error(json.error);
      }

      if (json.data.user) {
        setUserAccount({
          name: json.data.user.name || "",
          email: json.data.user.email || "",
          phone: json.data.user.phone || "",
          role: json.data.user.role || "PHOTOGRAPHER",
        });
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
      toast.error(err instanceof Error ? err.message : "Failed to load creative partner profile");
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
    router.push("/creatives/login");
  };

  // Profile Save Handler
  const handleProfileSave = async (customPayload?: Record<string, unknown>, silent = false) => {
    setSaving(true);

    let formattedInsta = instagramUrl.trim();
    if (formattedInsta && !formattedInsta.startsWith("http://") && !formattedInsta.startsWith("https://")) {
      const cleanHandle = formattedInsta.replace(/^@/, "");
      formattedInsta = `https://instagram.com/${cleanHandle}`;
    }

    const payload = customPayload || {
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
      phone: userAccount.phone,
      socialLinks: { instagram: formattedInsta },
    };

    try {
      const res = await fetch("/api/photographer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (typeof window !== "undefined") {
        localStorage.setItem("smm_creative_updated", Date.now().toString());
        try {
          const bc = new BroadcastChannel("smm_partner_channel");
          bc.postMessage({ type: "CREATIVE_UPDATED", time: Date.now() });
          bc.close();
        } catch {}
      }
      router.refresh();

      if (!silent) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
        toast.success("🎉 All partner details saved successfully!");
      }
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/photographer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("🔒 Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle Profile Photo Upload with real progress
  const handleProfilePhotoUpload = async (file: File) => {
    setAvatarUploading(true);
    setAvatarUploadProgress(10);
    try {
      const url = await uploadFileWithProgress(file, (pct) => setAvatarUploadProgress(pct));
      setProfile((prev) => ({ ...prev, profilePhoto: url }));
      await handleProfileSave({ profilePhoto: url }, true);
      setIsAvatarModalOpen(false);
      toast.success("✨ Profile picture updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Profile photo upload failed");
    } finally {
      setAvatarUploading(false);
      setAvatarUploadProgress(0);
    }
  };

  // Handle Cover Photo Upload with real progress
  const handleCoverPhotoUpload = async (file: File) => {
    setCoverUploading(true);
    setCoverUploadProgress(10);
    try {
      const url = await uploadFileWithProgress(file, (pct) => setCoverUploadProgress(pct));
      setProfile((prev) => ({ ...prev, coverImage: url }));
      await handleProfileSave({ coverImage: url }, true);
      setIsCoverModalOpen(false);
      toast.success("✨ Cover photo updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cover photo upload failed");
    } finally {
      setCoverUploading(false);
      setCoverUploadProgress(0);
    }
  };

  // Handle Portfolio Image File Selection & Instant Upload
  const handlePortfolioFileSelect = async (file: File) => {
    setPortfolioUploading(true);
    setPortfolioUploadProgress(10);
    const localUrl = URL.createObjectURL(file);
    setPortfolioPreviewUrl(localUrl);

    try {
      const uploadedUrl = await uploadFileWithProgress(file, (pct) => setPortfolioUploadProgress(pct));
      setNewPortfolioItem((prev) => ({ ...prev, url: uploadedUrl }));
      toast.success("✨ Photo uploaded! Select category & click 'Add to Showcase'.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setPortfolioPreviewUrl("");
    } finally {
      setPortfolioUploading(false);
    }
  };

  // Add Portfolio Item to list
  const handleAddPortfolioItem = () => {
    if (portfolio.length >= MAX_PORTFOLIO_ITEMS) {
      toast.error(`Maximum limit of ${MAX_PORTFOLIO_ITEMS} total portfolio images reached.`);
      return;
    }
    if (!newPortfolioItem.url) {
      toast.error("Please select an image file to upload first.");
      return;
    }

    const selectedCategory = (newPortfolioItem.eventType || "Wedding").trim();
    const existingCategories = Array.from(new Set(portfolio.map((item) => item.eventType || "Wedding")));
    const isNewCategory = !existingCategories.includes(selectedCategory);

    if (isNewCategory && existingCategories.length >= 3) {
      toast.error(`Free Version Limit: Maximum 3 event categories allowed (Active: ${existingCategories.join(", ")}).`);
      return;
    }

    const categoryImageCount = portfolio.filter((item) => (item.eventType || "Wedding") === selectedCategory).length;
    if (categoryImageCount >= 4) {
      toast.error(`Category Limit Reached: Maximum 4 images allowed for "${selectedCategory}" on Free version.`);
      return;
    }

    const updated = [...portfolio, { ...newPortfolioItem, eventType: selectedCategory }];
    setPortfolio(updated);
    setNewPortfolioItem({ url: "", caption: "", eventType: "Wedding" });
    setPortfolioPreviewUrl("");
    setPortfolioUploadProgress(0);
    setIsAddModalOpen(false);

    // Auto-save portfolio changes to server
    handleProfileSave({ portfolio: updated }, true);
    toast.success(`✨ Work added to "${selectedCategory}" showcase!`);
  };

  const handleRemovePortfolioItem = (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index);
    setPortfolio(updated);
    handleProfileSave({ portfolio: updated }, true);
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
    handleProfileSave({ dateNotes: updated }, true);
    toast.success(`Date note saved for ${newDateStr}.`);
  };

  const handleRemoveDateNote = (dateStr: string) => {
    const updated = dateNotes.filter((d) => d.date !== dateStr);
    setDateNotes(updated);
    handleProfileSave({ dateNotes: updated }, true);
    toast.success(`Date note removed for ${dateStr}.`);
  };

  // Includes / Excludes / Guarantees handlers
  const handleAddInclude = () => {
    if (!newIncludeItem.trim()) return;
    const updated = [...includesList, newIncludeItem.trim()];
    setIncludesList(updated);
    setNewIncludeItem("");
  };

  const handleAddExclude = () => {
    if (!newExcludeItem.trim()) return;
    const updated = [...excludesList, newExcludeItem.trim()];
    setExcludesList(updated);
    setNewExcludeItem("");
  };

  const handleAddGuarantee = () => {
    if (!newGuaranteeItem.trim()) return;
    const updated = [...guaranteesList, newGuaranteeItem.trim()];
    setGuaranteesList(updated);
    setNewGuaranteeItem("");
  };

  // Copy Profile URL to Clipboard
  const getPublicProfileUrl = () => {
    if (typeof window !== "undefined" && photographerSlug) {
      return `${window.location.origin}/creatives/${photographerSlug}`;
    }
    return `https://shapemymoment.com/creatives/${photographerSlug || "partner"}`;
  };

  const copyProfileLink = () => {
    const url = getPublicProfileUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    toast.success("📋 Profile link copied! Ready to paste into your Instagram bio or WhatsApp.");
  };

  const shareProfileWhatsApp = () => {
    const url = getPublicProfileUrl();
    const text = encodeURIComponent(`Hi! Check out my official creative portfolio and book my dates on ShapeMyMoment: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
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
      title: "Visual Brand Photos",
      desc: "Add custom profile photo & cover image",
      completed: Boolean(profile.profilePhoto && profile.coverImage),
    },
    {
      id: 3,
      title: "Portfolio Showcase",
      desc: "Upload work photos to your showcase",
      completed: portfolio.length > 0,
    },
    {
      id: 4,
      title: "Pricing & Starting Rate",
      desc: "Specify your event pricing",
      completed: Number(profile.startingPrice) > 0,
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
            Loading Creative Partner Studio...
          </p>
        </div>
      </div>
    );
  }

  const publicUrl = getPublicProfileUrl();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 sm:pb-12 selection:bg-primary selection:text-white">
      <ConfettiBurst trigger={confetti} />

      {/* Top Header Navigation */}
      <header className="border-b border-border bg-card/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
        <div className="container-page flex h-14 sm:h-16 items-center justify-between gap-3 px-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="font-extrabold text-base sm:text-lg tracking-tight">
              Shape<span className="text-primary">My</span>Moment
            </Link>
            <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              <Sparkles className="h-3 w-3" /> Partner Studio
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Save Button */}
            <Button
              onClick={() => handleProfileSave()}
              size="sm"
              disabled={saving}
              className="gap-1.5 bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 h-8 sm:h-9 px-2.5 sm:px-4"
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{saving ? "Saving..." : "Save Changes"}</span>
              <span className="sm:hidden">{saving ? "..." : "Save"}</span>
            </Button>

            {/* Availability Quick Toggle Pill */}
            <select
              value={profile.availability}
              onChange={(e) => {
                const val = e.target.value;
                setProfile({ ...profile, availability: val });
                handleProfileSave({ availability: val }, true);
                toast.success(`Status updated to "${val}"`);
              }}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none cursor-pointer"
            >
              <option value="Available">🟢 Available</option>
              <option value="Limited">🟡 Limited</option>
              <option value="Booked">🔴 Booked</option>
            </select>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* INSTAGRAM-STYLE PROFILE & COVER HEADER */}
      <div className="relative border-b border-border bg-card">
        {/* Cover Image Banner */}
        <div className="relative w-full h-36 sm:h-56 md:h-64 lg:h-72 bg-muted overflow-hidden group">
          <Image
            src={profile.coverImage}
            alt="Cover Image"
            fill
            priority
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Instagram-Style "Edit Cover" Overlay Button */}
          <button
            type="button"
            onClick={() => setIsCoverModalOpen(true)}
            className="absolute top-3 right-3 sm:top-5 sm:right-6 flex items-center gap-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition active:scale-95 border border-white/20"
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="text-[11px] sm:text-xs">Edit Cover</span>
          </button>
        </div>

        {/* Profile Identity Bar */}
        <div className="container-page px-3 sm:px-6 relative pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16">
            <div className="flex items-end gap-3 sm:gap-5">
              {/* Instagram-Style Circular Profile Avatar with Camera Edit Badge */}
              <div className="relative shrink-0">
                <div className="relative h-22 w-22 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full border-4 border-card bg-muted shadow-2xl overflow-hidden ring-4 ring-primary/20">
                  <Image
                    src={profile.profilePhoto}
                    alt={profile.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                {/* Floating Camera Button on Avatar */}
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition border-2 border-card"
                  title="Change Profile Photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Title & Location details */}
              <div className="pb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
                    {profile.name || "Creative Partner Studio"}
                  </h1>
                  <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/20 shrink-0" />
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-primary/30 text-primary">
                    {currentPlan}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-primary shrink-0" />
                  <span>{profile.location || "Wayanad"}</span>
                  <span>·</span>
                  <span className="font-semibold text-foreground">{profile.category}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons (Edit, View Public, Share) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="gap-1.5 text-xs font-bold border-border hover:bg-muted h-8 sm:h-9"
              >
                <Sliders className="h-3.5 w-3.5" /> Edit Profile
              </Button>

              {photographerSlug && (
                <Link href={`/creatives/${photographerSlug}`} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-bold border-primary/40 text-primary hover:bg-primary/10 h-8 sm:h-9"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Public Page
                  </Button>
                </Link>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={copyProfileLink}
                className="gap-1.5 text-xs font-bold h-8 sm:h-9"
              >
                {copiedLink ? <CheckCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedLink ? "Link Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>

          {/* Instagram-Style Mobile Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-border/60">
            <div className="text-center p-2 rounded-xl bg-card border border-border/50">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Works</p>
              <p className="text-xs sm:text-base font-black text-foreground mt-0.5">{completedWorksCount}</p>
            </div>

            <div className="text-center p-2 rounded-xl bg-card border border-border/50">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Portfolio</p>
              <p className="text-xs sm:text-base font-black text-foreground mt-0.5">{portfolio.length}/{MAX_PORTFOLIO_ITEMS}</p>
            </div>

            <div className="text-center p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Earnings</p>
              <p className="text-xs sm:text-base font-black text-emerald-800 dark:text-emerald-300 mt-0.5 truncate">
                {formatCurrency(totalEarnings)}
              </p>
            </div>

            <div className="text-center p-2 rounded-xl bg-card border border-border/50">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Rating</p>
              <p className="text-xs sm:text-base font-black text-foreground mt-0.5 flex items-center justify-center gap-0.5">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                {reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : "5.0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container-page px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Animated Creative Quote */}
        <div className="rounded-2xl border border-primary/20 bg-card p-3 sm:p-4 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Quote className="h-4 w-4 sm:h-5 sm:w-5" />
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
            className="text-[11px] font-bold text-primary hover:underline shrink-0 self-end sm:self-center"
          >
            Next Quote →
          </button>
        </div>

        {/* Dashboard Responsive Tab Navigation (Horizontal Scrollable on Mobile) */}
        <div className="overflow-x-auto no-scrollbar scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1.5 sm:gap-2 pb-2 min-w-max border-b border-border">
            {[
              { id: "overview", label: "Overview & Charts", icon: LayoutDashboard },
              { id: "profile", label: "Profile & Visuals", icon: User },
              { id: "portfolio", label: `Portfolio (${portfolio.length}/${MAX_PORTFOLIO_ITEMS})`, icon: Camera },
              { id: "inquiries", label: `Leads (${inquiries.length})`, icon: Inbox },
              { id: "calendar", label: `Calendar (${dateNotes.length})`, icon: CalendarDays },
              { id: "account", label: "Account & Security", icon: Settings },
              { id: "reviews", label: `Reviews (${reviews.length})`, icon: Star },
              { id: "subscription", label: "Plan Tier", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition shrink-0 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW & CHARTS */}
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Top Metrics Cards & 2 Small Graphs */}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {/* GRAPH 1: Works Executed Bar Chart */}
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" /> Works Executed Graph
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Completed Events: <strong className="text-foreground">{completedWorksCount} Works</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Activity
                  </span>
                </div>

                {/* SVG Small Bar Chart for Works */}
                <div className="h-32 sm:h-36 w-full flex items-end justify-between gap-2 pt-3 px-1">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, idx) => {
                    const worksVal = completedWorksCount === 0 ? 0 : Math.max(1, Math.round(completedWorksCount / (6 - idx)));
                    const heightPercent = completedWorksCount === 0 ? 0 : Math.min(100, Math.max(15, (worksVal / Math.max(completedWorksCount, 1)) * 100));
                    return (
                      <div key={m} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="w-full bg-muted/40 rounded-t-lg h-20 sm:h-24 relative flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6 }}
                            className="w-3/4 bg-primary rounded-t-md transition group-hover:bg-primary/80"
                          />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">{m}</span>
                        <span className="text-[10px] font-extrabold text-foreground">{worksVal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GRAPH 2: Earnings & Income Chart */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <DollarSign className="h-5 w-5 text-emerald-600" /> Income &amp; Payouts
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total: <strong className="text-emerald-700 dark:text-emerald-400 font-black">{formatCurrency(totalEarnings)}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Verified
                  </span>
                </div>

                {/* SVG Small Area/Bar Chart for Income */}
                <div className="h-32 sm:h-36 w-full flex items-end justify-between gap-2 pt-3 px-1">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, idx) => {
                    const incomeVal = totalEarnings === 0 ? 0 : Math.round((totalEarnings / 6) * (1 + (idx % 3) * 0.2));
                    const heightPercent = totalEarnings === 0 ? 0 : Math.min(100, Math.max(15, (incomeVal / Math.max(totalEarnings, 1)) * 100));
                    return (
                      <div key={m} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="w-full bg-emerald-500/10 rounded-t-lg h-20 sm:h-24 relative flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6 }}
                            className="w-3/4 bg-emerald-600 dark:bg-emerald-400 rounded-t-md transition group-hover:bg-emerald-500"
                          />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">{m}</span>
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
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-bold">Admin Managed Earnings:</strong> Our ShapeMyMoment team coordinates payouts and records completed works directly when events wrap up.
              </p>
            </div>

            {/* Onboarding Checklist */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-black text-primary">{progressPercent}%</span>
                    <h2 className="text-base sm:text-lg font-bold">Profile Onboarding Checklist</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete your profile and portfolio to rank higher in searches across South India!
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

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
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

        {/* TAB 2: PROFILE & VISUALS */}
        {activeTab === "profile" && (
          <div className="space-y-6 sm:space-y-8">
            {/* INSTAGRAM-STYLE VISUAL EDIT CARD */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" /> Visual Identity (Instagram Style)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Easily manage your profile picture and header cover image. Tap either image to update.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Profile Photo Editor Box */}
                <div className="rounded-2xl border border-border/80 bg-background p-4 sm:p-5 flex flex-col items-center text-center space-y-3">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-card bg-muted shadow-md overflow-hidden ring-4 ring-primary/20">
                    <Image src={profile.profilePhoto} alt="Profile Photo" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">Profile Avatar</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Displayed on directory &amp; inquiries</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="gap-1.5 text-xs font-bold bg-primary text-primary-foreground w-full sm:w-auto"
                  >
                    <Camera className="h-3.5 w-3.5" /> Change Profile Photo
                  </Button>
                </div>

                {/* Cover Image Editor Box */}
                <div className="rounded-2xl border border-border/80 bg-background p-4 sm:p-5 flex flex-col items-center text-center space-y-3">
                  <div className="relative w-full h-24 sm:h-28 rounded-xl bg-muted shadow-md overflow-hidden border border-border">
                    <Image src={profile.coverImage} alt="Cover Banner" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">Cover Banner</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Header background on your public profile</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCoverModalOpen(true)}
                    className="gap-1.5 text-xs font-bold border-primary/40 text-primary hover:bg-primary/10 w-full sm:w-auto"
                  >
                    <Camera className="h-3.5 w-3.5" /> Change Cover Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Studio Details Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileSave();
              }}
              className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-foreground">Studio &amp; Brand Details</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update information visible to event hosts and clients.
                  </p>
                </div>
                <Button type="submit" disabled={saving} size="sm" className="gap-1.5 font-bold text-xs bg-primary">
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>

              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
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
                  <label className="block text-xs font-bold">Starting Daily Rate (₹ / Day) *</label>
                  <input
                    type="number"
                    value={profile.startingPrice}
                    onChange={(e) => setProfile({ ...profile, startingPrice: Number(e.target.value) })}
                    placeholder="e.g. 10000"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
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
                  <label className="block text-xs font-bold">Event Categories (Comma-separated)</label>
                  <input
                    type="text"
                    value={profile.eventTypes}
                    onChange={(e) => setProfile({ ...profile, eventTypes: e.target.value })}
                    placeholder="e.g. Wedding, Birthday, Engagement, Mehendi"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
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
                    placeholder="e.g. Bridal Photography, Drone Aerial Shots, Custom Gift Hampers"
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
                    placeholder="e.g. @your_studio_handle or https://instagram.com/your_handle"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </form>

            {/* Custom Includes, Excludes, Guarantees Editor */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-border pb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-foreground">Package Terms &amp; Guarantees</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize standard package inclusions and promises shown on your public page.
                </p>
              </div>

              {/* INCLUDES EDITOR */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  ✅ What&apos;s Included in Your Package:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. High-res edited photos, 2 Photographers..."
                    value={newIncludeItem}
                    onChange={(e) => setNewIncludeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                  <Button type="button" size="sm" onClick={handleAddInclude} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1">
                    <Plus className="h-4 w-4" /> Add
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
                  ❌ Excluded (Requires Add-on):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Travel beyond 100km, Printed album..."
                    value={newExcludeItem}
                    onChange={(e) => setNewExcludeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                  <Button type="button" size="sm" onClick={handleAddExclude} variant="outline" className="font-bold text-xs gap-1 border-rose-500/30 text-rose-600">
                    <Plus className="h-4 w-4" /> Add
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
                  🛡️ Partner Guarantees:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 100% On-time delivery guarantee..."
                    value={newGuaranteeItem}
                    onChange={(e) => setNewGuaranteeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                  <Button type="button" size="sm" onClick={handleAddGuarantee} variant="secondary" className="font-bold text-xs gap-1">
                    <Plus className="h-4 w-4" /> Add
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

        {/* TAB 3: PORTFOLIO SHOWCASE (PURE UPLOAD ONLY - NO IMAGE URL!) */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">Portfolio Work Showcase</h2>
                  <Badge variant="outline" className="text-xs font-bold">
                    {portfolio.length} / {MAX_PORTFOLIO_ITEMS}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your best event photos. Direct file upload only with instant progress tracking.
                </p>
              </div>

              <Button
                onClick={() => {
                  setNewPortfolioItem({ url: "", caption: "", eventType: "Wedding" });
                  setPortfolioPreviewUrl("");
                  setPortfolioUploadProgress(0);
                  setIsAddModalOpen(true);
                }}
                disabled={portfolio.length >= MAX_PORTFOLIO_ITEMS}
                className="gap-1.5 font-bold text-xs bg-primary w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" /> Upload Work to Portfolio
              </Button>
            </div>

            {/* Category Rules Notice Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong>Free Tier:</strong> Up to <strong>3 event categories</strong> with max <strong>4 photos</strong> each.
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

            {/* Portfolio Grid (Responsive on Mobile) */}
            {portfolio.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 sm:p-12 text-center text-muted-foreground space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground">No Portfolio Images Uploaded</h3>
                <p className="text-xs max-w-md mx-auto">
                  Showcase high-resolution photos of your past wedding, birthday, or outdoor shoots to attract event hosts.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary text-primary-foreground font-bold text-xs gap-1.5 mt-2"
                >
                  <Plus className="h-4 w-4" /> Upload First Work Photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {portfolio
                  .filter((item) => portfolioCategoryFilter === "ALL" || (item.eventType || "Wedding") === portfolioCategoryFilter)
                  .map((item, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xs">
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image src={item.url} alt={item.caption || "Portfolio item"} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioItem(idx)}
                          className="absolute right-2 top-2 h-7 w-7 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Remove image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {item.eventType && (
                          <Badge className="absolute left-2 top-2 bg-black/70 text-white text-[9px] sm:text-[10px] px-2 py-0.5">
                            {item.eventType}
                          </Badge>
                        )}
                      </div>
                      {item.caption && (
                        <div className="p-2.5 sm:p-3">
                          <p className="text-xs font-medium text-foreground truncate">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACCOUNT & SECURITY (EASY ACCOUNT MANAGEMENT) */}
        {activeTab === "account" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Account Overview & Public Bio Link Card */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Account Details &amp; Public Link
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage your credentials, login info, and your public booking profile link.
                  </p>
                </div>
                <Badge variant="outline" className="w-fit text-xs font-bold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  Account Active
                </Badge>
              </div>

              {/* Public Link Share Box */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Share2 className="h-4 w-4 text-primary" /> Your Public Profile URL
                  </span>
                  <span className="text-[10px] font-bold text-primary">Live on Web</span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-mono text-foreground truncate">
                    {publicUrl}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={copyProfileLink}
                      className="gap-1.5 font-bold text-xs bg-primary text-primary-foreground flex-1 sm:flex-initial"
                    >
                      {copiedLink ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedLink ? "Copied!" : "Copy URL"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={shareProfileWhatsApp}
                      className="gap-1.5 font-bold text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 flex-1 sm:flex-initial"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  💡 Tip: Copy and paste this link in your Instagram bio or share directly with couples &amp; event hosts!
                </p>
              </div>

              {/* Account Contact Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" /> Account Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" /> Login Email (Registered ID)
                  </label>
                  <input
                    type="email"
                    value={userAccount.email}
                    disabled
                    className="mt-1.5 w-full rounded-xl border border-input bg-muted/60 px-3.5 py-2.5 text-xs font-mono text-muted-foreground cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" /> Contact Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={userAccount.phone}
                    onChange={(e) => setUserAccount({ ...userAccount, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground">Partner Category</label>
                  <input
                    type="text"
                    value={profile.category}
                    disabled
                    className="mt-1.5 w-full rounded-xl border border-input bg-muted/60 px-3.5 py-2.5 text-xs font-semibold text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleProfileSave()}
                  disabled={saving}
                  className="gap-1.5 font-bold text-xs bg-primary"
                >
                  <Save className="h-3.5 w-3.5" /> Save Contact Details
                </Button>
              </div>
            </div>

            {/* Change Password Card */}
            <form onSubmit={handleChangePassword} className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" /> Change Account Password
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your security password used to sign into the creative partner portal.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">New Password (Min 8 chars) *</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={changingPassword}
                  className="gap-1.5 font-bold text-xs bg-primary text-primary-foreground"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: INQUIRIES & CLIENT LEADS */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-primary" /> Client Profile Inquiries
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct requests from clients discovering your public profile.
                </p>
              </div>
              <Badge variant="outline" className="font-bold text-xs">
                {inquiries.length} Active Leads
              </Badge>
            </div>

            {inquiries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 sm:p-12 text-center text-muted-foreground space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground">No Inquiries Received Yet</h3>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  Inquiries from event hosts will appear here as soon as clients submit inquiries through your public profile page.
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
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AVAILABILITY CALENDAR & DATE NOTES */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" /> Availability Calendar &amp; Notes
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mark booked dates or holidays to avoid scheduling conflicts.
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
                      placeholder="e.g. Resort Wedding Shoot"
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scheduled Dates:</h3>
                {dateNotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No dates marked yet.</p>
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

        {/* TAB 7: REVIEWS & FEEDBACKS */}
        {activeTab === "reviews" && (
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-400" /> Client Reviews &amp; Feedback
            </h2>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 sm:p-12 text-center text-muted-foreground">
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

        {/* TAB 8: SUBSCRIPTION PLAN */}
        {activeTab === "subscription" && (
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Partner Subscription Plan
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current tier: <strong className="text-foreground">{currentPlan}</strong>
                </p>
              </div>
              <Badge variant="outline" className="w-fit text-xs font-bold text-amber-600 border-amber-500/40 bg-amber-500/10 gap-1.5 py-1 px-3">
                🔒 Free Promotional Phase Active
              </Badge>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Zero Commission Promotional Window</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  All creative partners currently receive full Free tier access with zero commissions on verified client leads.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
                <div
                  key={plan}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
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
                    Active Tier
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "profile", label: "Profile", icon: User },
          { id: "portfolio", label: "Portfolio", icon: Camera, badge: portfolio.length },
          { id: "inquiries", label: "Leads", icon: Inbox, badge: inquiries.length },
          { id: "account", label: "Account", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                active ? "text-primary font-bold" : "text-muted-foreground font-medium"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODAL 1: ADD PORTFOLIO IMAGE (UPLOAD ONLY - NO IMAGE URL!) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="rounded-t-3xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground">Upload to Portfolio Showcase</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Choose an event photo directly from your device</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Dropzone & Upload Button */}
              <div>
                <input
                  type="file"
                  ref={portfolioFileRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePortfolioFileSelect(file);
                  }}
                  className="hidden"
                />

                {portfolioPreviewUrl ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary/40 bg-muted">
                    <Image src={portfolioPreviewUrl} alt="Preview" fill className="object-cover" />
                    {portfolioUploading && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-transparent mb-2" />
                        <p className="text-xs font-bold">Uploading to Cloudinary... {portfolioUploadProgress}%</p>
                        <div className="w-48 bg-white/30 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-200"
                            style={{ width: `${portfolioUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {!portfolioUploading && (
                      <button
                        type="button"
                        onClick={() => portfolioFileRef.current?.click()}
                        className="absolute bottom-3 right-3 rounded-full bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5"
                      >
                        <Camera className="h-3.5 w-3.5" /> Choose Different Photo
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => portfolioFileRef.current?.click()}
                    className="border-2 border-dashed border-primary/40 hover:border-primary rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition bg-primary/5 hover:bg-primary/10 flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-foreground">Tap or drag image here to upload</p>
                    <p className="text-[11px] text-muted-foreground">Supports JPG, PNG, WEBP from your camera roll</p>
                  </div>
                )}
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold mb-1.5">Event Category *</label>
                <select
                  value={newPortfolioItem.eventType}
                  onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, eventType: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Mehendi">Mehendi</option>
                  <option value="Reception">Reception</option>
                  <option value="Outdoor Shoot">Outdoor Shoot</option>
                  <option value="Fashion">Fashion / Model</option>
                  <option value="Custom Event">Custom Event</option>
                </select>
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-xs font-bold mb-1.5">Work Title / Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Ceremony at Wayanad Resort"
                  value={newPortfolioItem.caption}
                  onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, caption: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddPortfolioItem}
                disabled={portfolioUploading || !newPortfolioItem.url}
                className="bg-primary text-primary-foreground font-bold"
              >
                {portfolioUploading ? `Uploading (${portfolioUploadProgress}%)` : "Add to Showcase"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INSTAGRAM-STYLE PROFILE PHOTO MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="rounded-t-3xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" /> Edit Profile Picture
              </h3>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-center">
              {/* Avatar Preview */}
              <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-primary/30 shadow-xl overflow-hidden bg-muted">
                <Image src={profile.profilePhoto} alt="Current avatar" fill className="object-cover" />
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                    <div className="h-7 w-7 animate-spin rounded-full border-3 border-white border-t-transparent mb-1" />
                    <p className="text-[11px] font-bold">{avatarUploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Progress Bar when uploading */}
              {avatarUploading && (
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-200" style={{ width: `${avatarUploadProgress}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">Uploading to Cloudinary...</p>
                </div>
              )}

              {/* Upload from device button */}
              <input
                type="file"
                ref={avatarFileRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProfilePhotoUpload(file);
                }}
                className="hidden"
              />

              <Button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                disabled={avatarUploading}
                className="w-full gap-2 bg-primary text-primary-foreground font-bold text-xs py-2.5"
              >
                <UploadCloud className="h-4 w-4" /> Upload from Camera or Files
              </Button>

              {/* Quick Presets for Instant Selection */}
              <div className="pt-2 text-left">
                <p className="text-[11px] font-bold text-muted-foreground mb-2">Or choose from creative presets:</p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, profilePhoto: preset.url }));
                        handleProfileSave({ profilePhoto: preset.url }, true);
                        setIsAvatarModalOpen(false);
                        toast.success(`✨ Profile picture set to ${preset.label}!`);
                      }}
                      className="group relative aspect-square rounded-full overflow-hidden border-2 border-border hover:border-primary transition"
                      title={preset.label}
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover group-hover:scale-110 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsAvatarModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INSTAGRAM-STYLE COVER IMAGE MODAL */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="rounded-t-3xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" /> Edit Cover Banner
              </h3>
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-center">
              {/* Cover Preview */}
              <div className="relative w-full h-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md bg-muted">
                <Image src={profile.coverImage} alt="Current cover" fill className="object-cover" />
                {coverUploading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-transparent mb-1.5" />
                    <p className="text-xs font-bold">{coverUploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Progress Bar when uploading */}
              {coverUploading && (
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-200" style={{ width: `${coverUploadProgress}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">Uploading to Cloudinary...</p>
                </div>
              )}

              {/* Upload from device button */}
              <input
                type="file"
                ref={coverFileRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverPhotoUpload(file);
                }}
                className="hidden"
              />

              <Button
                type="button"
                onClick={() => coverFileRef.current?.click()}
                disabled={coverUploading}
                className="w-full gap-2 bg-primary text-primary-foreground font-bold text-xs py-2.5"
              >
                <UploadCloud className="h-4 w-4" /> Upload Cover Photo from Device
              </Button>

              {/* Quick Presets for Instant Cover */}
              <div className="pt-2 text-left">
                <p className="text-[11px] font-bold text-muted-foreground mb-2">Or choose from luxury preset banners:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, coverImage: preset.url }));
                        handleProfileSave({ coverImage: preset.url }, true);
                        setIsCoverModalOpen(false);
                        toast.success(`✨ Cover updated to ${preset.label}!`);
                      }}
                      className="group relative h-16 rounded-xl overflow-hidden border border-border hover:border-primary transition text-left"
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white truncate drop-shadow-xs">{preset.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsCoverModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
