import type { ReactNode } from 'react';

/** Maviron tarzı bölüm başlığı: solda eyebrow + dev geniş başlık, sağda kısa not. */
export function SectionHead({
  id,
  eyebrow,
  title,
  note,
  tone = 'dark',
  as: H = 'h2',
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  note?: ReactNode;
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2';
}) {
  const light = tone === 'light';
  return (
    <header className="mb-12 grid items-end gap-6 sm:mb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:gap-12">
      <div>
        <p className={`eyebrow ${light ? '!text-accent-strong' : ''}`} data-reveal>
          {eyebrow}
        </p>
        <H id={id} className={`display-lg mt-5 ${light ? 'text-ink' : 'text-paper'}`} data-reveal>
          {title}
        </H>
      </div>
      {note && (
        <p className={`text-[0.97rem] leading-relaxed ${light ? 'text-ink/60' : 'text-muted'}`} data-reveal>
          {note}
        </p>
      )}
    </header>
  );
}
