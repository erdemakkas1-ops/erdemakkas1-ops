import { processSteps } from '@/data/process';
import { SectionHead } from '@/components/ui/SectionHead';

/** Adım piktogramları: tek çizgili teknik çizim, 0..60 kutusunda */
function Pictogram({ i }: { i: number }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (i === 0)
    return (
      <g {...p}>
        <path d="M18 14c3-2 6-2 8 1l3 6c1 2 0 4-2 5l-3 2c2 5 6 9 11 11l2-3c1-2 3-3 5-2l6 3c3 2 3 5 1 8l-3 3c-3 3-9 2-15-2-6-4-12-10-16-16-4-6-5-12-2-15z" />
        <path d="M38 12c5 1 9 5 10 10M37 18c3 1 5 3 6 6" />
      </g>
    );
  if (i === 1)
    return (
      <g {...p}>
        <rect x="12" y="10" width="26" height="34" rx="2" />
        <path d="M17 18h16M17 24h16M17 30h9" />
        <circle cx="38" cy="36" r="9" />
        <path d="M44.5 42.5 52 50" />
      </g>
    );
  if (i === 2)
    return (
      <g {...p}>
        <path d="M42 10a10 10 0 0 0-11 13L13 41a4 4 0 0 0 6 6l18-18a10 10 0 0 0 13-11l-6 6-6-2-2-6z" />
        <circle cx="16" cy="44" r="1.2" />
      </g>
    );
  return (
    <g {...p}>
      <rect x="11" y="11" width="38" height="38" rx="3" />
      <path d="M19 31l7 7 15-16" />
    </g>
  );
}

export function Process({ index }: { index?: string } = {}) {
  void index;
  const xs = [150, 450, 750, 1050];
  return (
    <section className="relative overflow-hidden bg-surface py-24 text-ink sm:py-32" aria-labelledby="surec-baslik">
      <div className="tech-grid-light pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHead
          id="surec-baslik"
          tone="light"
          eyebrow="Nasıl çalışıyorum"
          title={
            <>
              Bildirimden
              <br />
              <em>teslime.</em>
            </>
          }
          note="Dört adımın her birinde muhatabınız benim. Süreyi ve kapsamı, arızayı gördükten sonra sizinle birlikte netleştiririz."
        />

        {/* Masaüstü: yatay devre şeması */}
        <div className="hidden md:block">
          <svg viewBox="0 0 1200 230" className="w-full text-ink" data-draw aria-hidden="true">
            {/* ana hat */}
            <path d="M40 110H1160" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.55" />
            <path d="M40 104v12M1160 104v12" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.55" />
            {Array.from({ length: 23 }, (_, k) => (
              <path key={k} d={`M${60 + k * 48} 110v6`} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
            ))}
            {xs.map((x, i) => (
              <g key={x}>
                {/* düğüm */}
                <circle cx={x} cy={110} r={54} fill="#f5f2ec" stroke="currentColor" strokeWidth="1.4" />
                <circle cx={x} cy={110} r={62} fill="none" stroke="#e55a10" strokeWidth="1.2" strokeDasharray="2 5" />
                <g transform={`translate(${x - 30} ${80})`}>
                  <Pictogram i={i} />
                </g>
                {/* ok */}
                {i < xs.length - 1 && <path d={`M${x + 150 - 8} 104l8 6-8 6`} stroke="#e55a10" strokeWidth="1.6" fill="none" />}
                <text x={x} y={28} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="2" fill="#e55a10">
                  {processSteps[i].index}
                </text>
                <path d={`M${x} 36v12`} stroke="#e55a10" strokeWidth="1.2" fill="none" />
              </g>
            ))}
            <text x={40} y={150} fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2" fill="currentColor" opacity="0.5">
              ARIZA
            </text>
            <text x={1160} y={150} textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2" fill="currentColor" opacity="0.5">
              ÜRETİM
            </text>
          </svg>
          <ol className="mt-4 grid grid-cols-4 gap-8" data-stagger>
            {processSteps.map((s) => (
              <li key={s.index} className="text-center">
                <h3 className="font-display text-[1.25rem] uppercase leading-[1.05] text-ink">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-[17rem] text-[0.94rem] leading-relaxed text-ink/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobil: dikey şema */}
        <ol className="md:hidden">
          {processSteps.map((s, i) => (
            <li key={s.index} className="grid grid-cols-[4.5rem_1fr] gap-4" data-draw>
              <svg viewBox="0 0 72 200" className="h-full min-h-48 w-[4.5rem] text-ink" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
                <circle cx={36} cy={36} r={32} fill="#f5f2ec" stroke="currentColor" strokeWidth="1.4" />
                <g transform="translate(9 9) scale(0.9)">
                  <Pictogram i={i} />
                </g>
                {i < processSteps.length - 1 && <path d="M36 70V200" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />}
              </svg>
              <div className="pb-10 pt-3">
                <p className="font-mono text-[11px] tracking-[0.18em] text-accent-strong">{s.index}</p>
                <h3 className="mt-1 font-display text-[1.25rem] uppercase leading-[1.05] text-ink">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
