import Image from 'next/image';
import { CalendarDays, Info } from 'lucide-react';
import { projectPlaceholders, projects, type Project } from '@/data/projects';
import { Visual } from '@/components/visuals/Visual';

const formatDate = (d?: string) => {
  if (!d) return null;
  const [y, m] = d.split('-').map(Number);
  if (!y) return null;
  return m ? new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1)) : String(y);
};

function ProjectCard({ p }: { p: Project }) {
  const [cover, ...rest] = p.photos;
  const date = formatDate(p.date);
  return (
    <article className="group overflow-hidden border border-mist/10 bg-ink-2">
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image src={cover.src} alt={cover.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <Visual kind="photo" className="h-full w-full" />
        )}
        <span className="absolute left-4 top-4 bg-ink/80 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent backdrop-blur">
          {p.category}
        </span>
      </div>
      <div className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/55">{p.brand}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold uppercase text-white">{p.model}</h3>
        <dl className="mt-5 space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="font-semibold text-mist">Müdahale nedeni</dt>
            <dd className="mt-1 text-mist/75">{p.problem}</dd>
          </div>
          <div>
            <dt className="font-semibold text-mist">Yapılan işlem</dt>
            <dd className="mt-1 text-mist/75">{p.work}</dd>
          </div>
        </dl>
        {(date || rest.length > 0) && (
          <div className="mt-6 flex items-center justify-between border-t border-mist/10 pt-4 text-xs text-mist/55">
            {date ? (
              <span className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {date}
              </span>
            ) : (
              <span />
            )}
            {rest.length > 0 && <span>+{rest.length} fotoğraf</span>}
          </div>
        )}
        {rest.length > 0 && (
          <ul className="mt-4 grid grid-cols-4 gap-2">
            {rest.slice(0, 4).map((ph) => (
              <li key={ph.src} className="relative aspect-square overflow-hidden">
                <Image src={ph.src} alt={ph.alt} fill sizes="120px" className="object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function PlaceholderCard({ category, visual, tall, light }: { category: string; visual: (typeof projectPlaceholders)[number]['visual']; tall: boolean; light?: boolean }) {
  const t = light
    ? { card: 'border-ink/25 bg-white/45', k: 'text-ink/45', title: 'text-ink/75', dl: 'text-ink/60', dt: 'text-ink/40', dd: 'text-ink/75' }
    : { card: 'border-mist/20 bg-ink-2/60', k: 'text-mist/45', title: 'text-mist/70', dl: 'text-mist/55', dt: 'text-mist/40', dd: 'text-mist/70' };
  return (
    <article className={`relative overflow-hidden border border-dashed ${t.card}`} aria-label="Örnek içerik – gerçek çalışma değildir">
      <div className={`relative overflow-hidden ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <Visual kind={visual} className="h-full w-full opacity-70" tone="steel" draw="scroll" />
        <span className="absolute left-4 top-4 bg-accent px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink">
          Örnek içerik
        </span>
      </div>
      <div className="p-6">
        <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.k}`}>Makine markası · Modeli</p>
        <p className={`mt-1.5 font-display text-base uppercase ${t.title}`}>Çalışma fotoğrafı eklenecek</p>
        <dl className={`mt-4 grid grid-cols-2 gap-3 text-xs ${t.dl}`}>
          <div>
            <dt className={t.dt}>Arıza kategorisi</dt>
            <dd className={`mt-0.5 ${t.dd}`}>{category}</dd>
          </div>
          <div>
            <dt className={t.dt}>Tarih</dt>
            <dd className="mt-0.5">İsteğe bağlı</dd>
          </div>
          <div className="col-span-2">
            <dt className={t.dt}>Müdahale açıklaması · Yapılan işlem</dt>
            <dd className="mt-0.5">Gerçek iş kaydı girildiğinde burada gösterilir.</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export function ProjectsGallery({ limit, light }: { limit?: number; light?: boolean }) {
  if (projects.length > 0) {
    const list = limit ? projects.slice(0, limit) : projects;
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
        {list.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    );
  }

  const list = limit ? projectPlaceholders.slice(0, limit) : projectPlaceholders;
  return (
    <div>
      <p className={`mb-8 flex max-w-3xl gap-3 border-l-2 border-accent p-4 text-sm leading-relaxed ${light ? 'bg-white/50 text-ink/75' : 'bg-ink-2/70 text-mist/80'}`}>
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>
          Bu alandaki kartlar <strong className={light ? 'text-ink' : 'text-white'}>örnek içeriktir</strong> ve gerçek bir müşteri ya da tamamlanmış
          iş anlatmaz. Gerçek servis çalışmaları, fotoğrafları ve açıklamalarıyla birlikte eklendiğinde burada yayınlanacaktır.
        </span>
      </p>
      <div className={limit ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid"} data-stagger>
        {list.map((p, i) => (
          <PlaceholderCard key={p.category} category={p.category} visual={p.visual} tall={!limit && i % 3 === 1} light={light} />
        ))}
      </div>
    </div>
  );
}
