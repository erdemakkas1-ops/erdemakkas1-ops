"use client";

import { useFavorites } from "@/lib/useFavorites";
import { IconHeart } from "../site/icons";

export default function FavoriteButton({ id, title, variant = "overlay" }: { id: string; title: string; variant?: "overlay" | "inline" | "icon" }) {
  const { has, toggle } = useFavorites();
  const active = has(id);
  const label = active ? `${title} favorilerden çıkar` : `${title} favorilere ekle`;
  if (variant === "inline") {
    return <button type="button" onClick={() => toggle(id)} aria-pressed={active} aria-label={label} className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a] ${active ? "border-[#c9a86a] bg-[#c9a86a]/12 text-[#7a5f2e]" : "border-[#1c1b19]/15 text-[#1c1b19] hover:border-[#1c1b19]/40"}`}>
      <IconHeart className="h-5 w-5" filled={active} />{active ? "Favorilerde" : "Favorilere ekle"}
    </button>;
  }
  if (variant === "icon") {
    return <button type="button" onClick={() => toggle(id)} aria-pressed={active} aria-label={label} className={`flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${active ? "border-[#c9a86a] bg-[#c9a86a] text-[#1c1b19]" : "border-[#1c1b19]/15 bg-white text-[#1c1b19]"}`}>
      <IconHeart className="h-5 w-5" filled={active} />
    </button>;
  }
  return <button type="button" onClick={event => { event.preventDefault(); event.stopPropagation(); toggle(id); }} aria-pressed={active} aria-label={label} className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-[background-color,transform] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active ? "bg-[#c9a86a] text-[#1c1b19]" : "bg-[#1c1b19]/45 text-white hover:bg-[#1c1b19]/65"}`}>
    <IconHeart className="h-5 w-5" filled={active} />
  </button>;
}
