"use client";

import type { Listing } from "@/types/listing";
import { business, telHref, whatsappHref } from "@/config/business";
import { whatsappMessage } from "@/lib/listings";
import { IconPhone, IconWhatsApp } from "../site/icons";

/** WhatsApp message carries the listing's title, number, location, size, price and page link. */
export default function ContactActions({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const wa = whatsappHref(whatsappMessage(listing));
  // The page URL is only known in the browser; add it to the message at click time.
  const withUrl = (event: React.MouseEvent<HTMLAnchorElement>) => { event.currentTarget.href = whatsappHref(whatsappMessage(listing, window.location.href.split("#")[0])); };
  if (!wa && !telHref) return <p className="text-sm text-[#6b655c]">İletişim numarası henüz yapılandırılmadı (src/config/business.ts).</p>;
  return <div className={compact ? "flex gap-2" : "grid gap-3"}>
    {wa && <a href={wa} onClick={withUrl} onAuxClick={withUrl} target="_blank" rel="noopener noreferrer" className={`flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#1f8f5a] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#1a7a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f8f5a] ${compact ? "flex-1" : ""}`}>
      <IconWhatsApp className="h-5 w-5" />{compact ? "WhatsApp" : "WhatsApp ile bilgi al"}
    </a>}
    {telHref && <a href={telHref} className={`flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#1c1b19] px-6 text-[15px] font-semibold text-[#f6f2ea] transition-colors hover:bg-[#33302b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1b19] ${compact ? "flex-1" : ""}`}>
      <IconPhone className="h-5 w-5" />{compact ? "Ara" : `Hemen ara · ${business.phoneDisplay}`}
    </a>}
  </div>;
}
