"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/types/listing";
import { formatPrice, kindLabels } from "@/lib/listings";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const escape = (text: string) => text.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`);

/**
 * Leaflet + OpenStreetMap tiles: no API key, no cost. Loaded only on the client, on demand.
 * Listings without coordinates are skipped; approximate (demo) pins get a dashed ring.
 */
export default function ListingsMap({ listings, zoom, className = "" }: { listings: Listing[]; zoom?: number; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !container.current) return;
      map.current?.remove();
      const pinned = listings.filter(listing => listing.coords);
      const instance = L.map(container.current, { scrollWheelZoom: false, attributionControl: true, zoomControl: true });
      map.current = instance;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları',
      }).addTo(instance);
      const bounds = L.latLngBounds([]);
      for (const listing of pinned) {
        const { lat, lng, approximate } = listing.coords!;
        const icon = L.divIcon({
          className: "map-pin",
          html: `<span style="display:block;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#1c1b19;border:3px solid #c9a86a;box-shadow:0 6px 14px rgba(0,0,0,.3)${approximate ? ";outline:2px dashed rgba(201,168,106,.7);outline-offset:3px" : ""}"></span>`,
          iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28],
        });
        L.marker([lat, lng], { icon, title: listing.title, alt: listing.title })
          .addTo(instance)
          .bindPopup(`<strong style="font-size:14px">${escape(listing.title)}</strong><br><span>${escape(kindLabels[listing.kind].single)} · ${escape(formatPrice(listing))}</span><br>${approximate ? '<em style="color:#8a6d38;font-size:11px">Yaklaşık / demo konum</em><br>' : ""}<a href="${basePath}/ilanlar/${listing.slug}/">Detayları incele →</a>`);
        bounds.extend([lat, lng]);
      }
      if (pinned.length === 1) instance.setView(bounds.getCenter(), zoom ?? 13);
      else if (pinned.length > 1) instance.fitBounds(bounds, { padding: [40, 40], maxZoom: zoom ?? 12 });
      else instance.setView([37.167, 38.795], 9);
    })();
    return () => { cancelled = true; map.current?.remove(); map.current = null; };
  }, [listings, zoom]);

  return <div ref={container} role="region" aria-label="İlan konumları haritası" className={`isolate z-0 overflow-hidden rounded-[1.4rem] ring-1 ring-[#1c1b19]/[0.08] ${className}`} />;
}
