"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          ...form,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success(mode === "login" ? "Welcome back!" : "Account created.");
      const role = json.data.user.role as string;
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin");
      } else if (role === "PHOTOGRAPHER") {
        router.push("/photographer/dashboard");
      } else {
        router.push(next.startsWith("/") ? next : "/dashboard");
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 premium-shadow sm:p-8"
    >
      <h1 className="text-2xl font-bold">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/register" className="font-medium text-primary underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline">
              Sign in
            </Link>
          </>
        )}
      </p>

      <div className="mt-6 space-y-4">
        {mode === "register" && (
          <>
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <FieldError>{errors.name}</FieldError>
            </div>
            <div>
              <Label>I am a</Label>
              <select
                className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="PHOTOGRAPHER">Photographer</option>
              </select>
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </>
        )}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={mode === "register" ? 8 : 6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </div>

      {mode === "login" && (
        <div className="mt-6 space-y-3 text-xs">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
            <span className="text-muted-foreground">Are you a registered Creative Partner? </span>
            <Link href="/creatives/login" className="font-bold text-primary underline">
              Sign In to Creative Portal →
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
