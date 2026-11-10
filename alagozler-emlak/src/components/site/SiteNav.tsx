"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business, telHref } from "@/config/business";
import { useFavorites } from "@/lib/useFavorites";
import Logo from "./Logo";
import { IconClose, IconHeart, IconMenu, IconPhone } from "./icons";

const links = [
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/ilanlar?tur=arsa", label: "Arsa" },
  { href: "/ilanlar?tur=tarla", label: "Tarla" },
  { href: "/ilanlar?tur=daire,mustakil", label: "Konut" },
  { href: "/proje-3d", label: "3D Proje" },
  { href: "/#danismanlik", label: "Danışmanlık" },
  { href: "/#iletisim", label: "İletişim" },
];

/** Main-site header. Transparent over the home hero, solid elsewhere and once scrolled. */
export default function SiteNav() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { ids } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Close the mobile menu on navigation (state adjusted during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) { setMenuPath(pathname); setOpen(false); }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = !overHero || scrolled || open;
  return <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${solid ? "border-b border-[#1c1b19]/[0.07] bg-[#f6f3ee]/92 shadow-[0_8px_30px_rgba(28,27,25,0.05)] backdrop-blur-md" : "border-b border-transparent bg-transparent"}`}>
    <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center gap-6 px-4 sm:px-8">
      <Link href="/" aria-label={`${business.name} — ana sayfa`} className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a86a]">
        <Logo tone={solid ? "dark" : "light"} />
      </Link>
      <nav aria-label="Ana menü" className="ml-auto hidden xl:block">
        <ul className="flex items-center gap-1">
          {links.map(link => <li key={link.href}>
            <Link href={link.href} className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#c9a86a] ${solid ? "text-[#3d3a35] hover:bg-[#1c1b19]/[0.05] hover:text-[#1c1b19]" : "text-[#f1ece2] hover:bg-white/10"}`}>{link.label}</Link>
          </li>)}
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-2 xl:ml-2">
        <Link href="/favoriler" aria-label={`Favoriler (${ids.length})`} className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[#c9a86a] ${solid ? "text-[#1c1b19] hover:bg-[#1c1b19]/[0.06]" : "text-white hover:bg-white/10"}`}>
          <IconHeart className="h-5 w-5" filled={ids.length > 0} />
          {ids.length > 0 && <span className="absolute right-1 top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#c9a86a] px-1 text-[10px] font-bold text-[#1c1b19]">{ids.length}</span>}
        </Link>
        {telHref && <a href={telHref} className={`hidden h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a] sm:flex ${solid ? "bg-[#1c1b19] text-[#f6f2ea] hover:bg-[#33302b]" : "bg-white/12 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20"}`}>
          <IconPhone className="h-4 w-4" />{business.phoneDisplay}
        </a>}
        <button type="button" aria-expanded={open} aria-controls="mobil-menu" aria-label={open ? "Menüyü kapat" : "Menüyü aç"} onClick={() => setOpen(value => !value)} className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full xl:hidden focus-visible:outline-2 focus-visible:outline-[#c9a86a] ${solid ? "text-[#1c1b19] hover:bg-[#1c1b19]/[0.06]" : "text-white hover:bg-white/10"}`}>
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>
    </div>
    {open && <nav id="mobil-menu" aria-label="Mobil menü" className="motion-panel h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-[#1c1b19]/[0.06] bg-[#f6f3ee] px-5 pb-10 pt-4 xl:hidden">
      <ul className="divide-y divide-[#1c1b19]/[0.07]">
        {links.map(link => <li key={link.href}><Link href={link.href} onClick={() => setOpen(false)} className="flex h-14 items-center justify-between font-serif text-2xl text-[#1c1b19]">{link.label}<span aria-hidden="true" className="text-[#c9a86a]">→</span></Link></li>)}
      </ul>
      {telHref && <a href={telHref} className="mt-8 flex h-13 items-center justify-center gap-2 rounded-full bg-[#1c1b19] text-sm font-semibold text-[#f6f2ea]"><IconPhone className="h-4 w-4" />{business.phoneDisplay}</a>}
    </nav>}
  </header>;
}
