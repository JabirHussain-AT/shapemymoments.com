"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Gift, PartyPopper, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  HoverLift,
  SoftBlobs,
  SparkleField,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion";

const storeCategories = [
  {
    name: "Decorations",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    icon: PartyPopper,
  },
  {
    name: "Party Supplies",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    icon: Sparkles,
  },
  {
    name: "Gifts",
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80",
    icon: Gift,
  },
  {
    name: "Invitations",
    image:
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",
    icon: Mail,
  },
];

export function ComingSoonTeaser({
  title,
  description,
  categories,
  interest,
}: {
  title: string;
  description: string;
  categories: { name: string; image: string }[];
  interest: "store" | "rentals";
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const notify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("You're on the list!");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative section-padding pt-10">
      <SoftBlobs className="opacity-60" />
      <SparkleField className="opacity-40" />
      <div className="container-page relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="gold" className="mb-4 pulse-soft">
              Coming Soon
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl text-balance">
              {title}
            </h1>
            <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <StaggerItem key={cat.name}>
              <HoverLift>
                <article className="group relative overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <Badge className="mb-2 bg-white/90 text-foreground">
                        Coming Soon
                      </Badge>
                      <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    </div>
                  </div>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.15}>
          <form
            onSubmit={notify}
            className="mx-auto mt-14 max-w-md rounded-2xl border border-border bg-white p-6 text-center premium-shadow"
          >
            <Bell className="mx-auto h-8 w-8 text-primary float-slow" />
            <h2 className="mt-3 text-xl font-bold">Notify Me</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Be first to know when we launch.
            </p>
            <div className="mt-4 text-left">
              <Label htmlFor="notify-email">Email</Label>
              <Input
                id="notify-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-4 w-full" disabled={loading}>
              {loading ? "Saving…" : "Notify Me"}
            </Button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}

export const STORE_CATEGORIES = storeCategories.map(({ name, image }) => ({
  name,
  image,
}));

export const RENTAL_CATEGORIES = [
  {
    name: "Furniture",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
  },
  {
    name: "Lighting",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
  },
  {
    name: "Sound",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
  },
  {
    name: "Decor",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  },
  {
    name: "Photo Booths",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  },
  {
    name: "Event Equipment",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
  },
];
