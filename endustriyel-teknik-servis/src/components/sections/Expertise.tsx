import { services } from '@/data/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from './ServiceCard';

export function Expertise({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' }) {
  return (
    <section id="uzmanlik" className="relative bg-surface py-24 text-ink sm:py-32" aria-labelledby="uzmanlik-baslik">
      <div className="tech-grid-light pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            as={headingAs}
            index="02"
            eyebrow="Uzmanlık Alanları"
            title={<span id="uzmanlik-baslik">Arızanın kaynağına inen teknik servis</span>}
            tone="light"
          />
          <p className="max-w-md text-base leading-relaxed text-ink-text/70 lg:pb-2" data-reveal>
            Elektrik, mekanik ve otomasyon birbirinden ayrı düşünülmez. Her talep, makinenin bütününü göz önünde tutan bir
            teşhis yaklaşımıyla ele alınır.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-6 lg:gap-6" data-stagger>
          {services.map((s, i) => (
            <div key={s.slug} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <ServiceCard service={s} large={i < 2} />
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-text/60">
          Hizmet kapsamı makineye ve arızanın niteliğine göre değişir; her talep için uygunluk ön teknik değerlendirmede
          netleştirilir.
        </p>
      </div>
    </section>
  );
}
