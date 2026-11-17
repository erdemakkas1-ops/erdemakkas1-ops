import Link from 'next/link';
import { business, displayName } from '@/data/site';
import { services } from '@/data/services';
import { mainNav, serviceRequestHref } from '@/data/navigation';
import { ContactList } from '@/components/ui/ContactActions';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  const legalBits = [
    business.name,
    business.legal.taxOffice && `Vergi Dairesi: ${business.legal.taxOffice}`,
    business.legal.taxNumber && `VKN/TCKN: ${business.legal.taxNumber}`,
    business.legal.mersisNumber && `MERSİS: ${business.legal.mersisNumber}`,
  ].filter(Boolean);

  return (
    <footer className="relative overflow-hidden border-t border-mist/10 bg-ink pb-24 pt-16 sm:pb-12 lg:pt-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist/70">
              Endüstriyel baskı ve ambalaj makinelerinde elektrik, mekanik ve otomasyon arızaları için bağımsız teknik servis.
            </p>
            <Link href={serviceRequestHref} className="btn btn-primary mt-8">
              Servis Talebi Oluştur
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">Hizmetler</h2>
              <ul className="mt-5 space-y-1">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/hizmetler/${s.slug}`} className="inline-block py-1.5 text-sm text-mist/85 transition-colors hover:text-accent">
                      {s.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">Site</h2>
              <ul className="mt-5 space-y-1">
                {mainNav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="inline-block py-1.5 text-sm text-mist/85 transition-colors hover:text-accent">
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/gizlilik" className="inline-block py-1.5 text-sm text-mist/85 transition-colors hover:text-accent">
                    Gizlilik ve KVKK
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">İletişim</h2>
              <div className="mt-5 text-sm">
                <ContactList compact />
              </div>
              <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-mist/50">Hizmet Bölgesi</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist/80">
                {business.serviceArea ?? 'Hizmet bölgesi, talep ve makine konumuna göre ön değerlendirmede netleştirilir.'}
              </p>
            </div>
          </div>
        </div>

        <p className="outline-word mt-16 select-none text-[7.1vw] 2xl:text-[6.4rem]" aria-hidden="true">
          Teknik servis
        </p>

        <div className="hairline mt-10" />

        <div className="mt-8 grid gap-6 text-xs leading-relaxed text-mist/55 lg:grid-cols-2">
          <p>
            <strong className="font-semibold text-mist/75">Marka bağımsızlığı:</strong> BOBST ve manroland, ilgili hak
            sahiplerinin markalarıdır. Bu sitede marka isimleri yalnızca hizmet verilen makine türlerini tanımlamak amacıyla
            kullanılır. {displayName}; bu üreticilerin yetkili servisi, resmî temsilcisi, distribütörü veya iş ortağı
            değildir.
          </p>
          <p className="lg:text-right">
            Bu site, servis talebi bilgilerini sunucuda saklamaz; form içeriği yalnızca sizin onayınızla WhatsApp’a aktarılır.{' '}
            <Link href="/gizlilik" className="underline underline-offset-4 hover:text-accent">
              Ayrıntılar
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mist/40 sm:flex-row sm:justify-between">
          <span>
            © {year} {displayName}
          </span>
          {legalBits.length > 0 && <span>{legalBits.join(' · ')}</span>}
        </div>
      </div>
    </footer>
  );
}
