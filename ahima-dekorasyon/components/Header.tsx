'use client';

import { useEffect, useState } from 'react';
import { telLink, whatsappLink, business } from '@/lib/site';

const NAV = [
  { id: 'donusum', label: 'Dönüşüm' },
  { id: 'tasarla', label: 'Tasarla' },
  { id: 'hizmetler', label: 'Hizmetler' },
  { id: 'projeler', label: 'Projeler' },
  { id: 'teklif', label: 'İletişim' },
];

/** Light text over the films, a paper bar over the light sections. */
export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const darks = ['donusum', 'mutfak', 'projeler'].map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const check = () => {
      const y = 40;
      const overDark = darks.some(el => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
      setSolid(!overDark);
    };
    check();
    addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    return () => { removeEventListener('scroll', check); removeEventListener('resize', check); };
  }, []);
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : ''; }, [open]);

  const tone = solid && !open ? 'bg-paper/95 text-ink border-b border-ink/10' : 'text-paper';
  return (
    <header className={`gutter fixed inset-x-0 top-0 z-50 flex h-[var(--header-h)] items-center justify-between transition-colors duration-300 ${tone}`}>
      <a href="#ust" className="flex items-baseline gap-2" aria-label={`${business.name} — başa dön`} onClick={() => setOpen(false)}>
        <span className="display text-[27px] tracking-[-0.04em]">Ahima</span>
        <span className="label text-[10px] opacity-70">Dekorasyon</span>
      </a>
      <nav aria-label="Ana menü" className="flex items-center gap-[clamp(18px,2.4vw,40px)] max-[960px]:hidden">
        {NAV.map(n => <a key={n.id} href={`#${n.id}`} className="text-[14px] font-medium opacity-80 transition-opacity hover:opacity-100">{n.label}</a>)}
        <a href={telLink} className="label text-[11px] opacity-80 hover:opacity-100">{business.phoneDisplay}</a>
        <a href="#teklif" className={`btn !min-h-[42px] !gap-4 !px-4 !text-[13px] ${solid ? 'btn-ink' : 'btn-solid'}`}>Ücretsiz Keşif <span className="arrow" aria-hidden>→</span></a>
      </nav>
      <button type="button" className="relative z-10 hidden h-11 w-11 items-center justify-center max-[960px]:flex" aria-expanded={open} aria-controls="mobil-menu" aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} onClick={() => setOpen(o => !o)}>
        <span className={`absolute h-px w-6 bg-current transition-transform ${open ? 'rotate-45' : '-translate-y-1'}`} />
        <span className={`absolute h-px w-6 bg-current transition-transform ${open ? '-rotate-45' : 'translate-y-1'}`} />
      </button>
      <div id="mobil-menu" className={`gutter fixed inset-0 -z-0 flex flex-col bg-ink pt-[calc(var(--header-h)+24px)] text-paper transition-[opacity,visibility] duration-300 min-[961px]:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {NAV.map(n => (
          <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="display flex items-center justify-between border-b border-paper/15 py-5 text-[34px]">{n.label}<span className="text-[20px] text-brass-soft">→</span></a>
        ))}
        <div className="mt-auto flex flex-col gap-3 pb-10">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-solid">WhatsApp’tan yazın <span aria-hidden>↗</span></a>
          <a href={telLink} className="btn btn-line">{business.phoneDisplay} <span aria-hidden>↗</span></a>
        </div>
      </div>
    </header>
  );
}
