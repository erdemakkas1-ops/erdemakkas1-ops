import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { serviceRequestHref } from '@/data/navigation';
import { PhoneButton } from '@/components/ui/ContactActions';

export function ServiceCta({ index = '' }: { index?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0b1218] py-24 sm:py-36" aria-labelledby="cta-baslik">
      <div className="tech-grid absolute inset-0 -z-10 opacity-80" aria-hidden="true" />
      <div
        className="absolute -right-40 top-1/2 -z-10 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-x">
        <div className="hairline" data-line />
        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:items-end lg:pt-16">
          <div className="lg:col-span-8">
            <p className="eyebrow" data-reveal>
              {index && <span className="text-mist/50">{index}</span>}Servis Talebi
            </p>
            <h2 id="cta-baslik" className="display-lg mt-6 text-paper" data-reveal>
              Makinenizde
              <br />
              <em>arıza mı var?</em>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist/85" data-reveal>
              Makineniz ve arızanız hakkında bilgi paylaşın. Teknik değerlendirme için iletişime geçin.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4" data-reveal>
            <Link href={serviceRequestHref} className="btn btn-primary min-h-16 text-base">
              <Wrench className="h-5 w-5" aria-hidden="true" />
              Arıza Bildir
            </Link>
            <PhoneButton className="min-h-16 text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}
