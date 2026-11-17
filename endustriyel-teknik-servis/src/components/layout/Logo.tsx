import Link from 'next/link';
import { business, displayName } from '@/data/site';

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-3" aria-label={`${displayName} – Ana sayfa`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center border border-mist/30 font-display text-lg font-bold text-white transition-colors group-hover:border-accent">
        {business.shortMark}
        <span className="absolute -bottom-px -right-px h-2 w-2 bg-accent" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-display text-[0.74rem] uppercase tracking-[0.08em] text-paper min-[400px]:text-[0.82rem] sm:text-[0.95rem] sm:tracking-[0.12em]">{displayName}</span>
        <span className="mt-1 hidden font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist/55 sm:block">{business.tagline}</span>
      </span>
    </Link>
  );
}
