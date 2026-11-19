import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from './JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Ana Sayfa', path: '/' }, ...items];
  return (
    <>
      <nav aria-label="Sayfa konumu">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-mist/60">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-accent">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="py-1 transition-colors hover:text-white">
                      {c.name}
                    </Link>
                    <ChevronRight className="h-3 w-3 opacity-50" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
