import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { Process } from '@/components/sections/Process';
import { ServiceCta } from '@/components/sections/ServiceCta';
import { serviceRequestHref } from '@/data/navigation';

export const metadata = pageMetadata({
  title: 'Hizmetler – Elektrik, Mekanik, PLC ve Servo Teknik Servis',
  description:
    'Baskı ve ambalaj makineleri için elektrik arızaları, mekanik onarım, PLC/otomasyon, sürücü-servo sistemleri ile revizyon ve periyodik bakım hizmetleri.',
  path: '/hizmetler',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Hizmetler', path: '/hizmetler' }]}
        eyebrow="Hizmetler"
        title="Beş disiplin, tek teknik bakış"
        lead="Bir arızanın kaynağı her zaman göründüğü yerde değildir. Hizmetler ayrı başlıklarda tanımlansa da makinenin elektrik, mekanik ve otomasyon tarafı birlikte değerlendirilir."
      >
        <Link href={serviceRequestHref} className="btn btn-primary">
          Servis Talebi Oluştur <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
        </Link>
      </PageHero>

      <section className="relative bg-surface py-20 sm:py-28" aria-label="Hizmet listesi">
        <div className="tech-grid-light pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative grid gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6" data-stagger>
          {services.map((s, i) => (
            <div key={s.slug} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <ServiceCard service={s} large={i < 2} />
            </div>
          ))}
        </div>
      </section>

      <Process index="" />
      <ServiceCta index="" />
    </>
  );
}
