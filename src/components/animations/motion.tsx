"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <FadeIn className={className} delay={delay} y={40}>
      {children}
    </FadeIn>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElements({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const items = [
    { top: "12%", left: "8%", size: 10, color: "bg-pink/40", delay: 0 },
    { top: "28%", right: "12%", size: 8, color: "bg-gold/35", delay: 0.4 },
    { top: "68%", left: "14%", size: 12, color: "bg-primary/20", delay: 0.8 },
    { top: "75%", right: "18%", size: 7, color: "bg-pink/30", delay: 1.2 },
    { top: "42%", left: "48%", size: 6, color: "bg-gold/40", delay: 0.6 },
  ];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          className={cn("absolute rounded-full blur-[1px]", item.color)}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            width: item.size,
            height: item.size,
          }}
          animate={{ y: [0, -14, 0], opacity: [0.45, 0.85, 0.45] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function SoftBlobs({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <motion.div
        className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-pink/20 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-gold/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function FloatingBalloons({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const balloons = [
    { left: "6%", color: "#e8b4bc", delay: 0, size: 18 },
    { left: "18%", color: "#5b3a8f", delay: 1.2, size: 14 },
    { left: "78%", color: "#c9a227", delay: 0.6, size: 16 },
    { left: "90%", color: "#7c4db8", delay: 1.8, size: 12 },
  ];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {balloons.map((b, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[-10%] rounded-full opacity-40"
          style={{
            left: b.left,
            width: b.size,
            height: b.size * 1.25,
            background: b.color,
            borderRadius: "50% 50% 50% 50% / 45% 45% 55% 55%",
          }}
          animate={{ y: [0, -520], opacity: [0, 0.45, 0] }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export function SparkleField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const sparks = Array.from({ length: 12 }).map((_, i) => ({
    top: `${8 + ((i * 17) % 80)}%`,
    left: `${5 + ((i * 23) % 90)}%`,
    delay: i * 0.35,
    size: 2 + (i % 3),
  }));

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.4, 0.8] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const reduce = useReducedMotion();
  if (reduce || !trigger) return null;

  const pieces = Array.from({ length: 28 });
  const colors = ["#5b3a8f", "#e8b4bc", "#c9a227", "#7c4db8", "#f3e8ff", "#d4a574"];

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-[42%] h-2 w-2 rounded-sm"
          style={{ background: colors[i % colors.length] }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 420,
            y: (Math.random() - 0.5) * 320 - 60,
            rotate: Math.random() * 420,
            scale: 0.35,
          }}
          transition={{ duration: 1.05, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function ParallaxImage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);

  return (
    <motion.div className={className} style={{ y: reduce ? 0 : (y as MotionValue<number>) }}>
      {children}
    </motion.div>
  );
}

export function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const total = 36;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = frame / total;
      setDisplay(Math.round(value * progress));
      if (frame >= total) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [value, reduce]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export function CelebrationAmbient({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <SoftBlobs />
      <FloatingElements />
      <SparkleField />
      <FloatingBalloons />
    </div>
  );
}
