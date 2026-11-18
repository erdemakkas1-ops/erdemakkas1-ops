import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/data/services';
import { Visual } from '@/components/visuals/Visual';

/** Maviron tarzı hizmet kolonu: görsel, numara, başlık, açıklama, oklu kapsam satırları, "İncele". */
export function ServiceCard({ service, tone = 'dark' }: { service: Service; tone?: 'dark' | 'light'; large?: boolean }) {
  const light = tone === 'light';
  const href = `/hizmetler/${service.slug}`;
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[4/5]">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
          <Visual kind={service.visual} image={service.image} note={false} draw="scroll" className="h-full w-full" sizes="(min-width:1280px) 20vw, (min-width:768px) 40vw, 100vw" />
        </div>
      </div>
      <p className={`mt-5 font-mono text-[11px] tracking-[0.18em] ${light ? 'text-ink/50' : 'text-mist/50'}`}>{service.index}</p>
      <h3 className={`mt-2 font-display text-[1.15rem] uppercase leading-[1.05] ${light ? 'text-ink' : 'text-paper'}`}>
        <Link href={href} className="hover:text-accent">
          {service.title}
        </Link>
      </h3>
      <p className={`mt-3 text-[0.92rem] leading-relaxed ${light ? 'text-ink/70' : 'text-mist/75'}`}>{service.summary}</p>
      <ul className={`mt-5 border-t ${light ? 'border-ink/15' : 'border-mist/15'}`}>
        {service.scope.map((s) => (
          <li key={s} className={`border-b ${light ? 'border-ink/15' : 'border-mist/15'}`}>
            <Link href={href} className={`flex items-center justify-between gap-3 py-2.5 text-[0.88rem] transition-colors hover:text-accent ${light ? 'text-ink/85' : 'text-mist/90'}`}>
              {s}
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent hover:text-[#ff9a5c]">
        İncele <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        <span className="sr-only">: {service.title}</span>
      </Link>
    </article>
  );
}
