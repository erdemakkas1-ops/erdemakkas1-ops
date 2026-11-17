import type { ReactNode } from 'react';

type Props = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2';
  className?: string;
};

export function SectionHeading({ index, eyebrow, title, lead, tone = 'dark', as: H = 'h2', className = '' }: Props) {
  const light = tone === 'light';
  return (
    <header className={`max-w-3xl ${className}`}>
      <p className="eyebrow" data-reveal>
        {index && <span className={light ? 'text-ink/50' : 'text-mist/50'}>{index}</span>}
        {eyebrow}
      </p>
      <H className={`display-lg mt-5 ${light ? 'text-ink' : 'text-white'}`} data-reveal>
        {title}
      </H>
      {lead && (
        <p className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${light ? 'text-ink-text/75' : 'text-mist/80'}`} data-reveal>
          {lead}
        </p>
      )}
    </header>
  );
}
