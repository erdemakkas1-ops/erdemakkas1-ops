'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, MessageSquareMore, Phone, Wrench, X } from 'lucide-react';
import { generalWhatsappUrl, phoneHref } from '@/lib/contact';
import { serviceRequestHref } from '@/data/navigation';

/** Maviron'daki sağ alt hızlı iletişim: tek butonun arkasında arıza bildir / WhatsApp / telefon. */
export function QuickContact() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [open]);

  const item = 'flex items-center gap-3 whitespace-nowrap border border-mist/15 bg-ink/95 px-4 py-3 text-sm font-semibold text-paper shadow-lg backdrop-blur transition-colors hover:border-accent hover:text-accent';

  return (
    <div ref={ref} data-quick-contact className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-2 md:flex">
      <div id="hizli-iletisim" hidden={!open} className="flex flex-col items-end gap-2">
        <Link href={serviceRequestHref} className={item} onClick={() => setOpen(false)}>
          <Wrench className="h-4 w-4 text-accent" aria-hidden="true" /> Arıza bildir
        </Link>
        {generalWhatsappUrl && (
          <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className={item}>
            <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" /> WhatsApp
          </a>
        )}
        {phoneHref && (
          <a href={phoneHref} className={item}>
            <Phone className="h-4 w-4 text-accent" aria-hidden="true" /> Telefon
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="hizli-iletisim"
        aria-label={open ? 'Hızlı iletişimi kapat' : 'Hızlı iletişim'}
        className="grid h-14 w-14 place-items-center rounded-full bg-accent text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#f0b456]"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageSquareMore className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
