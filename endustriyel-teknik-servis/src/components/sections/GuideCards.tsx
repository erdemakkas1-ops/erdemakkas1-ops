import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { guides } from '@/data/guides';

const fmt = (d: string) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));

export function GuideCards({ limit, tone = 'dark' }: { limit?: number; tone?: 'dark' | 'light' }) {
  const light = tone === 'light';
  const list = limit ? guides.slice(0, limit) : guides;
  return (
    <ul className={`grid gap-px overflow-hidden border md:grid-cols-3 ${light ? 'border-ink/15 bg-ink/15' : 'border-mist/15 bg-mist/15'}`} data-stagger>
      {list.map((g) => (
        <li key={g.slug} className={light ? 'bg-surface' : 'bg-ink'}>
          <Link href={`/rehber/${g.slug}`} className="group flex h-full flex-col p-7 sm:p-8">
            <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${light ? 'text-accent-strong' : 'text-accent'}`}>{g.category}</p>
            <h3 className={`mt-4 font-display text-[1.15rem] uppercase leading-[1.1] group-hover:text-accent ${light ? 'text-ink' : 'text-paper'}`}>
              {g.title}
            </h3>
            <p className={`mt-4 text-[0.93rem] leading-relaxed ${light ? 'text-ink/65' : 'text-mist/70'}`}>{g.description}</p>
            <span className={`mt-auto flex items-center justify-between pt-8 text-xs ${light ? 'text-ink/50' : 'text-mist/50'}`}>
              <span>
                {fmt(g.date)} · {g.readingMinutes} dk okuma
              </span>
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
