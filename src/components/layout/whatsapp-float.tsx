"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFloat() {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={getWhatsAppUrl("Hi ShapeMyMoment! I'd like to plan an event.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:bottom-6 sm:right-6"
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={reduce ? undefined : { scale: 1, opacity: 1, y: [0, -4, 0] }}
      transition={
        reduce
          ? undefined
          : {
              scale: { type: "spring", stiffness: 260, damping: 18 },
              y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            }
      }
      whileHover={reduce ? undefined : { scale: 1.08 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
    >
      <MessageCircle className="h-5 w-5" fill="currentColor" />
    </motion.a>
  );
}
