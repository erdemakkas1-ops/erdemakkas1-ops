'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, Phone, X } from 'lucide-react';
import { business } from '@/data/site';
import { phoneHref } from '@/lib/contact';
import { mainNav, serviceRequestHref } from '@/data/navigation';
import { Logo } from './Logo';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rota değişince menüyü kapat
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? 'border-b border-mist/10 bg-ink/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-3 sm:gap-6 lg:h-20">
        <Logo onClick={() => setOpen(false)} />

        <nav aria-label="Ana menü" className="hidden min-[1380px]:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`relative whitespace-nowrap px-3 py-2 text-[0.92rem] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
                    isActive(item.href) ? 'text-white after:scale-x-100' : 'text-mist/75 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {phoneHref && business.phone && (
            <a href={phoneHref} className="hidden items-center gap-2 px-3 py-2 text-sm font-semibold text-paper hover:text-accent 2xl:inline-flex">
              <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
              {business.phone}
            </a>
          )}
          <Link href={serviceRequestHref} className="btn btn-primary hidden min-h-11 px-5 text-sm sm:inline-flex">
            Servis Talebi
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="grid h-12 w-12 place-items-center border border-mist/20 text-white min-[1380px]:hidden"
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobil-menu"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-mist/10 bg-ink lg:h-[calc(100dvh-5rem)] min-[1380px]:hidden"
      >
        <nav aria-label="Mobil menü" className="container-x flex min-h-full flex-col py-6">
          <ul className="divide-y divide-mist/10 border-y border-mist/10">
            {mainNav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`flex items-center justify-between py-4 font-display text-2xl font-semibold uppercase tracking-wide ${
                    isActive(item.href) ? 'text-accent' : 'text-white'
                  }`}
                >
                  {item.label}
                  <span className="font-mono text-xs text-mist/60">{String(i + 1).padStart(2, '0')}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={serviceRequestHref} onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
            Servis Talebi Oluştur
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
