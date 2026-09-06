"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CelebrationAmbient,
  ConfettiBurst,
} from "@/components/animations/motion";

const collage = [
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    alt: "Birthday celebration with balloons",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    alt: "Wedding moment",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    alt: "Surprise party",
    className: "col-span-1 row-span-1",
  },
];

export function HeroSection() {
  const [confetti, setConfetti] = useState(false);
  const reduce = useReducedMotion();

  const celebrate = () => {
    if (reduce) return;
    setConfetti(true);
    setTimeout(() => setConfetti(false), 900);
  };

  return (
    <section className="relative overflow-hidden section-padding pt-10 sm:pt-14">
      <ConfettiBurst trigger={confetti} />
      <CelebrationAmbient />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            You enjoy the moment. We handle everything else.
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
          >
            Your Moment.
            <br />
            <span className="gradient-text">Our Responsibility.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            From the first idea to the final celebration, we plan, arrange and
            coordinate everything — so you can be fully present for the moments
            that matter.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/plan-event" onClick={celebrate}>
              <Button size="lg" className="w-full sm:w-auto">
                Plan My Event
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/photographers">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Meet Our Photographers
              </Button>
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4 text-primary" />
              End-to-end planning
            </div>
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Trusted photographers
            </div>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.6 }}
          className="relative"
        >
          <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
            {collage.map((item, i) => (
              <motion.div
                key={item.src}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.55 }}
                whileHover={reduce ? undefined : { scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl premium-shadow ${item.className} min-h-[140px] sm:min-h-[180px]`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-700"
                  sizes="(max-width: 768px) 50vw, 28vw"
                  priority
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 left-4 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:left-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Event partner
            </p>
            <p className="text-sm font-semibold text-foreground">
              Plan · Source · Manage
            </p>
          </motion.div>

          <motion.div
            animate={reduce ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3 right-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur sm:right-6"
          >
            ✨ Custom packages
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
