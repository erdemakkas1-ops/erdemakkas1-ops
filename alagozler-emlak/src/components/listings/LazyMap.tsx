"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/types/listing";

const ListingsMap = dynamic(() => import("./ListingsMap"), { ssr: false, loading: () => <MapPlaceholder text="Harita yükleniyor…" /> });

function MapPlaceholder({ text }: { text: string }) {
  return <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-[#e9e4dc] text-sm text-[#6b655c]">{text}</div>;
}

/** Mounts the Leaflet map only when it scrolls near the viewport. */
export default function LazyMap({ listings, zoom, className = "h-[420px]" }: { listings: Listing[]; zoom?: number; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { rootMargin: "300px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={holder} className={className}>
    {visible ? <ListingsMap listings={listings} zoom={zoom} className="h-full w-full" /> : <MapPlaceholder text="Harita" />}
  </div>;
}
