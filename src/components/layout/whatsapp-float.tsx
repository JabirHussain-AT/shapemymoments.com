"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl(
        "Hi ShapeMyMoments! I'd like to plan an event."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition hover:scale-105 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" fill="currentColor" />
    </a>
  );
}
