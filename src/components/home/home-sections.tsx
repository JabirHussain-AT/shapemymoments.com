"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Lightbulb,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { FadeIn, HoverLift, SoftBlobs, SparkleField, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { DemoPackage, DemoPhotographer, DemoReview } from "@/lib/data";

const steps = [
  {
    icon: Lightbulb,
    title: "Tell Us Your Vision",
    text: "Share the occasion, date, budget and what you imagine.",
  },
  {
    icon: ClipboardList,
    title: "We Build Your Plan",
    text: "We craft a customized package and clear quotation.",
  },
  {
    icon: Users,
    title: "We Arrange Everything",
    text: "Vendors, décor, photography, catering — coordinated for you.",
  },
  {
    icon: PartyPopper,
    title: "You Enjoy the Moment",
    text: "Show up, celebrate, and leave the stress with us.",
  },
];

const trust = [
  { icon: HeartHandshake, title: "One team, everything handled" },
  { icon: Wallet, title: "Customized to your budget" },
  { icon: ShieldCheck, title: "Trusted professionals" },
  { icon: ClipboardList, title: "Transparent planning" },
  { icon: Sparkles, title: "Personalized experiences" },
  { icon: CheckCircle2, title: "Less stress, more memories" },
];

export function WhatWeDo() {
  return (
    <section className="section-padding">
      <div className="container-page">
        <SectionHeading
          eyebrow="What we do"
          title="From Idea to Celebration"
          description="You bring the idea. We bring it to life — planning, sourcing, arranging and managing every detail."
        />
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <HoverLift>
              <div className="group h-full rounded-2xl border border-border bg-white/80 p-6 premium-shadow transition hover:border-primary/25">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:scale-110 group-hover:rotate-3">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </p>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function EventTypesGrid({
  types,
}: {
  types: { name: string; slug: string; description: string; image: string }[];
}) {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-page">
        <SectionHeading
          eyebrow="Celebrate anything"
          title="Events we bring to life"
          description="From intimate proposals to grand weddings — ShapeMyMoment is your event partner."
        />
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {types.map((type) => (
            <StaggerItem key={type.slug}>
              <Link
                href={`/plan-event?type=${encodeURIComponent(type.name)}`}
                className="group relative block overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={type.image}
                    alt={type.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width:768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{type.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-white/75">
                      {type.description}
                    </p>
                  </div>
                  <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="section-padding">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why ShapeMyMoment"
          title="Why people choose ShapeMyMoment"
          description="We're not another vendor directory — we're the team that carries your celebration from idea to memory."
        />
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map((item) => (
            <StaggerItem key={item.title}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-white/80 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-[#7a6414]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="pt-2 text-base font-semibold">{item.title}</h3>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function FeaturedPackages({ packages }: { packages: DemoPackage[] }) {
  return (
    <section className="section-padding bg-muted/40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Packages"
          title="Start with a package. Make it yours."
          description="Configurable starting points — then customized to your date, location and vision."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.slice(0, 3).map((pkg, i) => (
            <FadeIn key={pkg.id} delay={i * 0.08}>
              <HoverLift>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white premium-shadow">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={pkg.images[0]}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Badge variant={i === 2 ? "gold" : "default"}>{pkg.name}</Badge>
                  <p className="mt-3 text-2xl font-bold">
                    Starting from {formatCurrency(pkg.startingPrice)}
                    {i === 2 ? "+" : ""}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {pkg.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {pkg.highlights.slice(0, 4).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link href={`/plan-event?package=${pkg.slug}`}>
                      <Button className="w-full" variant={i === 2 ? "primary" : "outline"}>
                        {i === 2 ? "Build My Package" : "Customize Package"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
              </HoverLift>
            </FadeIn>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/packages">
            <Button variant="ghost">
              View all packages <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedPhotographers({
  photographers,
}: {
  photographers: DemoPhotographer[];
}) {
  return (
    <section className="section-padding">
      <div className="container-page">
        <SectionHeading
          eyebrow="Photographers"
          title="Meet photographers who capture the joy"
          description="Browse verified professionals — or include photography in your full event plan."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {photographers.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.06}>
              <Link
                href={`/photographers/${p.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-white premium-shadow transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={p.profilePhoto}
                    alt={p.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                  {p.featured && (
                    <Badge className="absolute left-3 top-3" variant="gold">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{p.name}</h3>
                    <span className="text-sm font-medium text-primary">
                      ★ {p.rating}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
                  <p className="mt-2 text-sm font-medium">
                    From {formatCurrency(p.startingPrice)}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/photographers">
            <Button variant="outline">
              Explore Photographers <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ reviews }: { reviews: DemoReview[] }) {
  return (
    <section className="section-padding bg-muted/40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Reviews"
          title="Moments people loved"
          description="Real celebrations planned and managed by ShapeMyMoment."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, i) => (
            <FadeIn key={review.id} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-border bg-white p-6">
                <div className="flex items-center gap-3">
                  {"avatar" in review && review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                      {review.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.eventType}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-primary">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  “{review.review}”
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section-padding">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <SoftBlobs />
            <SparkleField />
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-pink/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Your next celebration shouldn&apos;t feel like another project.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/80">
              Tell us what you&apos;re planning. We&apos;ll take it from there.
            </p>
            <div className="relative mt-8">
              <Link href="/plan-event">
                <Button
                  size="lg"
                  className="btn-shimmer bg-white text-primary hover:bg-white/90"
                >
                  Plan My Event <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
