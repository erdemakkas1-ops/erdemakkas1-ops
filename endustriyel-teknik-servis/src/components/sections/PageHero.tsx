import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { Visual } from '@/components/visuals/Visual';
import type { SiteImage, VisualKind } from '@/data/visuals';

type Props = {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  visual?: VisualKind;
  image?: SiteImage;
  children?: ReactNode;
};

export function PageHero({ crumbs, eyebrow, title, lead, visual, image, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-mist/10 bg-ink pb-16 pt-32 sm:pb-20 lg:pb-24 lg:pt-40">
      <div className="tech-grid absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className={visual ? 'lg:col-span-7' : 'lg:col-span-10'}>
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow rise mt-10" style={{ ['--d' as string]: '80ms' }}>
            {eyebrow}
          </p>
          <h1 className="display-lg rise mt-5 text-white" style={{ ['--d' as string]: '160ms' }}>
            {title}
          </h1>
          {lead && (
            <p className="rise mt-7 max-w-2xl text-lg leading-relaxed text-mist/85" style={{ ['--d' as string]: '260ms' }}>
              {lead}
            </p>
          )}
          {children && (
            <div className="rise mt-9" style={{ ['--d' as string]: '360ms' }}>
              {children}
            </div>
          )}
        </div>
        {visual && (
          <div className="fade lg:col-span-5" style={{ ['--d' as string]: '200ms' }}>
            <div className="relative aspect-[4/3] overflow-hidden border border-mist/10">
              <Visual kind={visual} image={image} priority draw="load" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
