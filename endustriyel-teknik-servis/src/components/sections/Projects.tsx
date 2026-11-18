import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHead } from '@/components/ui/SectionHead';
import { ProjectsGallery } from './ProjectsGallery';

export function Projects() {
  return (
    <section className="relative bg-surface-2 py-24 text-ink sm:py-32" aria-labelledby="calisma-baslik">
      <div className="container-x">
        <SectionHead
          id="calisma-baslik"
          tone="light"
          eyebrow="Çalışmalarımız"
          title={
            <>
              Sahadan
              <br />
              <em>kayıtlar.</em>
            </>
          }
          note="Makine, arıza kategorisi ve yapılan işlemle birlikte belgelenen gerçek servis çalışmaları bu bölümde yer alır."
        />
        <ProjectsGallery limit={3} light />
        <Link href="/calismalarimiz" className="mt-10 inline-flex items-center gap-2 font-semibold text-accent-strong hover:text-ink">
          Tüm çalışmalar <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
