"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Key,
  Mail,
  Lock,
  Copy,
  LayoutDashboard,
  HelpCircle,
  Users,
  TrendingUp,
  Award,
  HeartHandshake,
  ArrowRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { CREATIVE_CATEGORIES, type CreativeCategory } from "@/types";
import { ConfettiBurst } from "@/components/animations/motion";

const COMMUNITY_BENEFITS = [
  {
    icon: TrendingUp,
    badgeColor: "text-primary bg-primary/10 border-primary/20",
    title: "Top Industry Visibility",
    desc: "Free marketing & featured directory placement so event hosts discover your work first across Wayanad, Kozhikode, Kochi, and Bangalore.",
  },
  {
    icon: HeartHandshake,
    badgeColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    title: "Easy Customer Handling",
    desc: "ShapeMyMoment Concierge screens inquiries and matches client budget, dates, and event requirements directly to your schedule.",
  },
  {
    icon: BadgeCheck,
    badgeColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    title: "Verified Checkmark",
    desc: "Activate the trusted blue checkmark badge to build instant credibility, resulting in 3x higher booking rates from event hosts.",
  },
  {
    icon: Award,
    badgeColor: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    title: "Zero Commission Fees",
    desc: "Keep 100% of your earnings on every booking. No hidden commission charges or booking cuts.",
  },
  {
    icon: HelpCircle,
    badgeColor: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    title: "Partner Support Desk",
    desc: "Dedicated support desk at help@shapemymoment.com to assist with profile setup, inquiries, and leads.",
  },
];

export default function CreativeRegisterPage() {
  const [confetti, setConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeBenefitIndex, setActiveBenefitIndex] = useState(0);

  // Registration Credentials Result Modal State
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    tempPassword: string;
    slug: string;
    supportEmail: string;
  } | null>(null);

  // Quick Registration Form State
  const [category, setCategory] = useState<CreativeCategory>("Photographers");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Live Password Criteria Checks
  const hasLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !location) {
      toast.error("Please fill in your studio name, email, and base location.");
      return;
    }

    if (!hasLength) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (!hasLetter) {
      toast.error("Password must contain at least 1 letter.");
      return;
    }
    if (!hasNumber) {
      toast.error("Password must contain at least 1 number.");
      return;
    }
    if (!hasSpecial) {
      toast.error("Password must contain at least 1 special character (e.g. @, #, $, %).");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/creatives/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          category,
          location,
          startingPrice: 10000,
          bio: `Professional ${category} partner on ShapeMyMoment.`,
          profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
          coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
          portfolio: [],
          verifiedApproved: false,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setCreatedCredentials({
        email: json.data.email,
        tempPassword: password,
        slug: json.data.slug,
        supportEmail: json.data.supportEmail || "help@shapemymoment.com",
      });

      setConfetti(true);
      toast.success("🎉 Account created and password stored safely!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const nextBenefit = () => {
    setActiveBenefitIndex((prev) => (prev + 1) % COMMUNITY_BENEFITS.length);
  };

  const prevBenefit = () => {
    setActiveBenefitIndex((prev) => (prev - 1 + COMMUNITY_BENEFITS.length) % COMMUNITY_BENEFITS.length);
  };

  return (
    <div className="section-padding py-8 sm:py-12 bg-muted/20 min-h-screen">
      <ConfettiBurst trigger={confetti} />

      <div className="container-page max-w-6xl">
        {/* Registration Success Modal */}
        {createdCredentials ? (
          <div className="rounded-3xl border border-emerald-400/30 bg-card p-6 sm:p-10 shadow-2xl space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  Welcome to ShapeMyMoment Community!
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your creative partner account has been created. Use your ID &amp; Password below to log in.
                </p>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Your Account Login Credentials
                  </span>
                </div>
                <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold text-white">
                  Stored Safely in Database
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-primary" /> Login ID / Email
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <code className="text-sm font-bold text-foreground">
                      {createdCredentials.email}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdCredentials.email, "Email ID")}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy ID
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-emerald-600" /> Account Password
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <code className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                      ••••••••
                    </code>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      Encrypted
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Disclaimer Box */}
              <div className="rounded-xl border border-primary/20 bg-background p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-foreground">
                    Important Password Disclaimer &amp; Help:
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    If you ever need login assistance, contact our partner support team directly at{" "}
                    <a
                      href={`mailto:${createdCredentials.supportEmail}`}
                      className="font-bold text-primary underline"
                    >
                      {createdCredentials.supportEmail}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-2 text-xs">
              <p className="font-bold text-foreground text-sm flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-primary" /> What happens next?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Log into your Creative Dashboard to complete your profile form details and upload your portfolio work photos!
              </p>
            </div>

            {/* Action Button */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <Link href="/photographer/dashboard">
                <Button className="gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 text-xs font-semibold px-6 py-3">
                  <LayoutDashboard className="h-4 w-4" /> Proceed to Dashboard &amp; Fill Profile Details <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Creative Partner Community
                </div>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  Join South India&apos;s Premier Creative Network
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Empowering photographers, mehendi artists, makeup creators, hamper designers, and event decorators.
                </p>
              </div>

              <Link href="/creatives/login" className="shrink-0">
                <Button variant="outline" className="gap-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold">
                  Already a Partner? Sign In <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Main Layout: Desktop Side-by-Side vs Mobile Step Carousel + Form Below */}
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              {/* Left Column (Desktop Benefits Grid / Mobile Step Carousel) */}
              <div className="space-y-6">
                {/* Mobile Carousel / Slider View (Visible on Mobile lg:hidden) */}
                <div className="block lg:hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" /> Community Benefits ({activeBenefitIndex + 1} / {COMMUNITY_BENEFITS.length})
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={prevBenefit}
                        className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextBenefit}
                        className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Active Benefit Card Carousel Item */}
                  {(() => {
                    const benefit = COMMUNITY_BENEFITS[activeBenefitIndex];
                    const IconComponent = benefit.icon;
                    return (
                      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm min-h-[150px]">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${benefit.badgeColor}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <h3 className="font-extrabold text-sm text-foreground">
                            {benefit.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Carousel Step Dots Indicator */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {COMMUNITY_BENEFITS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveBenefitIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === activeBenefitIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop Benefits Grid View (Visible on Desktop lg:block) */}
                <div className="hidden lg:block space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="text-base font-extrabold flex items-center gap-2 text-foreground">
                      <Users className="h-5 w-5 text-primary" /> Why Join ShapeMyMoment Community?
                    </h2>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      500+ Verified Partners Active
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {COMMUNITY_BENEFITS.map((benefit, idx) => {
                      const IconComponent = benefit.icon;
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-2xs hover:border-primary/40 transition"
                        >
                          <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${benefit.badgeColor}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <h3 className="font-bold text-sm text-foreground">{benefit.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {benefit.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trust Footer Banner */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
                    <BadgeCheck className="h-6 w-6 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Direct Concierge Matching:</strong> We help clients find verified local partner profiles with direct pricing and complete transparency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Quick Registration Form Card - Side-by-side on Desktop, Immediately Below on Mobile) */}
              <div className="lg:sticky lg:top-20">
                <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 shadow-xl space-y-5">
                  <div className="border-b border-border pb-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-black tracking-tight text-foreground">
                        Quick Partner Registration
                      </h2>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        1-Min Setup
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill basic details below to create your account and password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <Label htmlFor="category" className="text-xs font-bold">
                        Creative Category *
                      </Label>
                      <Select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CreativeCategory)}
                        className="mt-1 text-xs font-semibold"
                      >
                        {CREATIVE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="name" className="text-xs font-bold">
                        Studio / Brand Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g. Wayanad Wedding Stories"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-xs font-bold">
                        Email Address (Your Login ID) *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. partner@shapemymoment.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-xs font-bold">
                        Phone / WhatsApp Number *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-xs font-bold">
                        Primary Base Location *
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g. Wayanad, Kochi, Kozhikode"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 text-xs"
                        required
                      />
                    </div>

                    {/* Password Fields */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-border/60">
                      <div>
                        <Label htmlFor="password" className="text-xs font-bold">
                          Account Password *
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Secret@123"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 text-xs"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="text-xs font-bold">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Security Criteria */}
                    <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-[11px] space-y-1">
                      <p className="font-bold text-foreground text-[10px] uppercase tracking-wider">Password Requirements:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <div className={`flex items-center gap-1 ${hasLength ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                          <span>{hasLength ? "✓" : "○"}</span> 8+ chars
                        </div>
                        <div className={`flex items-center gap-1 ${hasLetter ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                          <span>{hasLetter ? "✓" : "○"}</span> 1 letter
                        </div>
                        <div className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                          <span>{hasNumber ? "✓" : "○"}</span> 1 number
                        </div>
                        <div className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                          <span>{hasSpecial ? "✓" : "○"}</span> 1 special char
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full gap-2 shadow-md text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-11 mt-2"
                    >
                      {loading ? "Creating Account..." : "Create Account & Get Credentials"}{" "}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
