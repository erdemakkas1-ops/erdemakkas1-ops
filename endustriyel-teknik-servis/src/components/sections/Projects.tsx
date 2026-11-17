import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectsGallery } from './ProjectsGallery';

export function Projects() {
  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="calisma-baslik">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow="Çalışmalarımız"
            title={<span id="calisma-baslik">Sahadan servis kayıtları</span>}
            lead="Makine, arıza kategorisi ve yapılan işlemle birlikte belgelenen gerçek servis çalışmaları bu bölümde yer alır."
          />
          <Link href="/calismalarimiz" className="btn btn-ghost self-start lg:self-auto" data-reveal>
            Tüm çalışmalar <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-14">
          <ProjectsGallery limit={3} />
        </div>
      </div>
    </section>
  );
}
