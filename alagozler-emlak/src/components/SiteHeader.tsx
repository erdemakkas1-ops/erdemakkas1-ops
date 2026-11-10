"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { project, sections, type SectionId } from "@/data/project";

export default function SiteHeader({ onAppointment }: { onAppointment: () => void }) {
  const [active, setActive] = useState<SectionId>("proje");

  useEffect(() => {
    const targets = sections.map(section => document.getElementById(section.id)).filter((node): node is HTMLElement => node !== null);
    // The section crossing a line ~35% down the viewport is the one being read.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id as SectionId);
    }, { rootMargin: "-35% 0px -60% 0px" });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0e0d0c]/88 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-[1520px] items-center gap-3 px-4 sm:gap-6 sm:px-8">
      <Link href="/" className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-semibold tracking-[0.18em] text-[#c9a86a] transition-colors hover:border-[#c9a86a]/60 focus-visible:outline-2 focus-visible:outline-[#c9a86a] sm:px-4">
        <span aria-hidden="true">←</span> ALAGÖZLER<span className="sr-only"> ana sayfasına dön</span>
      </Link>
      <a href="#proje" className="flex h-11 items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a86a]">
        <span className="hidden font-display text-xl font-bold tracking-[0.28em] text-[#f1ebdf] min-[420px]:inline">{project.name}</span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#9b9387] sm:inline">{project.descriptor}</span>
        <span className="sr-only">, başa dön</span>
      </a>
      <nav aria-label="Bölümler" className="ml-auto hidden lg:block">
        <SectionLinks active={active} />
      </nav>
      <button type="button" onClick={onAppointment} className="ml-auto flex h-11 shrink-0 cursor-pointer items-center rounded-full border border-[#c9a86a]/55 px-5 text-sm font-semibold text-[#f0dcb4] transition-colors hover:bg-[#c9a86a] hover:text-[#141310] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a] lg:ml-4">
        <span className="sm:hidden">Randevu</span><span className="hidden sm:inline">Randevu Talep Et</span>
      </button>
    </div>
    <nav aria-label="Bölümler" className="border-t border-white/[0.05] lg:hidden">
      <SectionLinks active={active} />
    </nav>
  </header>;
}

function SectionLinks({ active }: { active: SectionId }) {
  return <ul className="flex items-center justify-between gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:justify-start sm:px-6 lg:gap-2 lg:px-0">
    {sections.map(section => <li key={section.id} className="shrink-0">
      <a
        href={`#${section.id}`}
        aria-current={active === section.id ? "location" : undefined}
        className={`relative flex h-11 items-center rounded px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#c9a86a] lg:h-16 ${active === section.id ? "text-[#f1ebdf]" : "text-[#9b9387] hover:text-[#e9e4da]"}`}
      >
        {section.label}
        <span aria-hidden="true" className={`absolute inset-x-3 bottom-1.5 h-px bg-[#c9a86a] transition-opacity lg:bottom-4 ${active === section.id ? "opacity-100" : "opacity-0"}`} />
      </a>
    </li>)}
  </ul>;
}
