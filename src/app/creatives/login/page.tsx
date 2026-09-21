"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  LayoutDashboard,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function CreativeLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both your login email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email,
          password,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Invalid email or password");
      }

      toast.success("Welcome back! Redirecting to your Creative Dashboard...");
      
      const role = json.data?.user?.role;
      if (role === "PHOTOGRAPHER" || role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/photographer/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding py-12 bg-muted/20 min-h-screen flex items-center justify-center">
      <div className="container-page max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" /> Creative Partner Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Creative Sign In
          </h1>
          <p className="text-xs text-muted-foreground">
            Access your portfolio showcase, booking calendar, and client reviews.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold">
                Login Email ID *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. partner@shapemymoment.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs pl-9"
                  required
                />
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password *
                </Label>
                <a
                  href="mailto:help@shapemymoment.com?subject=Creative%20Account%20Password%20Reset"
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xs pl-9"
                  required
                />
                <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full gap-2 shadow-md text-xs font-bold mt-2"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4" /> Log In to Creative Dashboard <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Support Desk Disclaimer */}
          <div className="rounded-xl border border-muted bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              <span>Need Login Help?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If you forgot your password or need account assistance, email partner desk:{" "}
              <a
                href="mailto:help@shapemymoment.com"
                className="font-bold text-primary underline"
              >
                help@shapemymoment.com
              </a>
            </p>
          </div>

          {/* Registration Redirect */}
          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Not a partner yet?{" "}
              <Link
                href="/creatives/register"
                className="font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                Join Creative Network <UserCheck className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
