/**
 * Bölümler arası şematik çizgi: iki hat kaydırdıkça uçlardan merkeze çizilir, ortada düğümlü etiket.
 */
export function SchematicDivider({ label, code, tone = 'dark' }: { label: string; code: string; tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark';
  const line = dark ? 'bg-blue/40' : 'bg-ink/30';
  return (
    <div className={`${dark ? 'bg-ink' : 'bg-surface'} py-8`} aria-hidden="true">
      <div className="container-x grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="relative h-px">
          <span className={`absolute inset-0 origin-left ${line}`} data-line />
          <span className={`absolute -top-1.5 left-0 h-3 w-px ${line}`} />
        </div>
        <div className="flex items-center gap-3" data-reveal>
          <span className="h-2.5 w-2.5 rounded-full border border-accent" />
          <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${dark ? 'text-mist/60' : 'text-ink/55'}`}>
            {code} — {label}
          </span>
          <span className="h-2.5 w-2.5 rounded-full border border-accent" />
        </div>
        <div className="relative h-px">
          <span className={`absolute inset-0 origin-right ${line}`} data-line data-line-from="right" />
          <span className={`absolute -top-1.5 right-0 h-3 w-px ${line}`} />
        </div>
      </div>
    </div>
  );
}
