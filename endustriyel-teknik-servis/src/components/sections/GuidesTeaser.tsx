import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHead } from '@/components/ui/SectionHead';
import { GuideCards } from './GuideCards';

export function GuidesTeaser() {
  return (
    <section className="bg-surface py-24 text-ink sm:py-32" aria-labelledby="rehber-baslik">
      <div className="container-x">
        <SectionHead
          id="rehber-baslik"
          tone="light"
          eyebrow="Teknik rehber"
          title={
            <>
              Sahadan
              <br />
              <em>notlar.</em>
            </>
          }
          note="Bakım ekipleri ve fabrika yetkilileri için kısa teknik yazılar: arıza bildirimi, sürücü hataları, planlı bakım."
        />
        <GuideCards limit={3} tone="light" />
        <Link href="/rehber" className="mt-10 inline-flex items-center gap-2 font-semibold text-accent-strong hover:text-ink">
          Tüm yazılar <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
