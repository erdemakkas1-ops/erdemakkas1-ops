import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/data/services';
import { ServiceIconView } from '@/components/ui/Icon';
import { Visual } from '@/components/visuals/Visual';

export function ServiceCard({ service, large = false }: { service: Service; large?: boolean }) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-ink/10 bg-white transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_30px_60px_-30px_rgba(16,24,32,0.45)]"
    >
      <div className={`relative overflow-hidden ${large ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]">
          <Visual kind={service.visual} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
        <span className="absolute left-4 top-4 font-mono text-xs tracking-[0.2em] text-white/80">{service.index}</span>
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center bg-ink/70 text-accent backdrop-blur">
          <ServiceIconView name={service.icon} className="h-5 w-5" strokeWidth={1.6} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-2xl font-semibold uppercase leading-tight text-ink sm:text-[1.7rem]">{service.title}</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-text/75">{service.summary}</p>
        <ul className="mt-5 grid gap-x-6 gap-y-2 border-t border-ink/10 pt-5 text-sm text-ink-text/85 sm:grid-cols-2">
          {service.scope.map((s) => (
            <li key={s} className="flex items-start gap-2.5">
              <span className="mt-[0.55rem] h-1 w-2.5 shrink-0 bg-accent" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>
        <span className="mt-auto flex items-center gap-2 pt-7 text-sm font-semibold text-ink">
          Detayları incele
          <ArrowUpRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
    </Link>
  );
}
