"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let theme = "light";
  let resolvedTheme: "light" | "dark" = "light";
  let toggleTheme = () => {};

  try {
    const context = useTheme();
    theme = context.theme;
    resolvedTheme = context.resolvedTheme;
    toggleTheme = context.toggleTheme;
  } catch (e) {
    // Fallback if rendered without provider
  }

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-xl border border-border bg-muted/40 animate-pulse ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-border bg-background/80 text-foreground shadow-xs backdrop-blur-md transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Current: ${isDark ? "Dark" : "Light"} mode. Click to switch.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: -12, opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: 12, opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="h-4.5 w-4.5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-purple-700 dark:text-purple-400 drop-shadow-[0_0_8px_rgba(124,77,184,0.3)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
