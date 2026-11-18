import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { ServiceCard } from './ServiceCard';
import { SectionHead } from '@/components/ui/SectionHead';

export function Expertise({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' }) {
  return (
    <section id="uzmanlik" className="relative bg-ink py-24 sm:py-32" aria-labelledby="uzmanlik-baslik">
      <div className="container-x">
        <SectionHead
          as={headingAs}
          id="uzmanlik-baslik"
          eyebrow="Hizmetler"
          title={
            <>
              Arızanın
              <br />
              <em>kaynağına.</em>
            </>
          }
          note="Elektrik, mekanik ve otomasyon birbirinden ayrı düşünülmez; her talep makinenin bütünü göz önünde tutularak ele alınır."
        />
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-5" data-stagger>
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/hizmetler" className="inline-flex items-center gap-2 font-semibold text-accent hover:text-[#ff9a5c]">
            Tüm hizmetler <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="max-w-xl text-xs leading-relaxed text-mist/50">
            Kapsam makineye ve arızanın niteliğine göre değişir; uygunluk ön teknik değerlendirmede netleşir. Fotoğraflar
            temsilîdir; belirli bir müşteri işini veya makine modelini göstermez.
          </p>
        </div>
      </div>
    </section>
  );
}
