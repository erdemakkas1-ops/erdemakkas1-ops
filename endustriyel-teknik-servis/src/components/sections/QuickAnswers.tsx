import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { machineBrands } from '@/data/machines';
import { profile } from '@/data/site';
import { serviceRequestHref } from '@/data/navigation';
import { Ph } from '@/components/ui/Ph';
import { CallButton, WhatsappCta } from '@/components/ui/CallButtons';

/** Müşterinin ilk 5 sorusu, açılışın hemen altında tek bakışta. */
export function QuickAnswers() {
  const rows = [
    {
      q: 'Hangi makineler?',
      a: (
        <>
          {machineBrands.map((b) => (
            <span key={b.id} className="block">
              <b className="text-paper">{b.name}</b> <span className="text-mist/70">· {b.models.map((m) => m.name).join(', ')}</span>
            </span>
          ))}
        </>
      ),
      href: '#makineler',
      cta: 'Makine grupları',
    },
    {
      q: 'Hangi arızalar?',
      a: <span className="text-mist/85">Elektrik · Mekanik · PLC / otomasyon · Servo / sürücü · Revizyon ve periyodik bakım</span>,
      href: '#mekanik',
      cta: 'Teknik sistemler',
    },
    {
      q: 'Uzman kim?',
      a: (
        <span className="text-paper">
          <Ph f={profile.name} />
          <span className="block text-mist/70">Bağımsız teknik servis</span>
        </span>
      ),
      href: '#usta',
      cta: 'Hakkımda',
    },
    {
      q: 'Hangi bölgeler?',
      a: (
        <span className="text-paper">
          <Ph f={profile.region} />
          <span className="block text-mist/70">Uygunluk ilk görüşmede netleşir</span>
        </span>
      ),
      href: '#servis-talebi',
      cta: 'Konum bildir',
    },
  ];
  return (
    <section className="relative border-y border-mist/10 bg-ink-2" aria-labelledby="hizli-cevaplar">
      <h2 id="hizli-cevaplar" className="sr-only">
        Hızlı cevaplar
      </h2>
      <div className="container-x grid divide-mist/10 md:grid-cols-2 md:divide-x lg:grid-cols-5">
        {rows.map((r, i) => (
          <div key={r.q} className="border-b border-mist/10 py-6 md:px-6 md:first:pl-0 lg:border-b-0" data-reveal>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent">
              {String(i + 1).padStart(2, '0')} — {r.q}
            </p>
            <div className="mt-3 text-[0.95rem] leading-snug">{r.a}</div>
            <a href={r.href} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-mist/70 hover:text-accent">
              {r.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        ))}
        <div className="py-6 md:px-6 lg:pr-0" data-reveal>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent">05 — Nasıl ulaşırım?</p>
          <div className="mt-3 flex flex-col gap-2">
            <CallButton variant="primary" className="min-h-11 justify-start px-4 text-sm" fallbackHref="#iletisim-bilgileri" />
            <WhatsappCta className="min-h-11 justify-start px-4 text-sm" fallbackHref="#servis-formu" />
            <Link href={serviceRequestHref} className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-mist/70 hover:text-accent">
              Servis talep formu <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
