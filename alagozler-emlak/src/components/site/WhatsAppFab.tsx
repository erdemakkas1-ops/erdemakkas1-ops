"use client";

import { usePathname } from "next/navigation";
import { whatsappHref } from "@/config/business";
import { IconWhatsApp } from "./icons";

/** Floating WhatsApp shortcut; listing detail pages show their own pre-filled button instead. */
export default function WhatsAppFab() {
  const pathname = usePathname();
  const href = whatsappHref("Merhaba, web sitenizden ulaşıyorum. Gayrimenkul hakkında bilgi almak istiyorum.");
  if (!href || /^\/ilanlar\/.+/.test(pathname)) return null;
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile iletişime geçin" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f5a] text-white shadow-[0_12px_30px_rgba(18,60,38,0.35)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f8f5a] sm:bottom-7 sm:right-7">
    <IconWhatsApp className="h-7 w-7" />
  </a>;
}
