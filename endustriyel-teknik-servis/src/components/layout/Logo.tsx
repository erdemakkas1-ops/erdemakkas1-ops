import Link from 'next/link';
import { business, fieldText, profile } from '@/data/site';
import { Ph } from '@/components/ui/Ph';

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-3" aria-label={`${fieldText(profile.name)} – Ana sayfa`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center border border-mist/30 font-display text-lg font-bold text-white transition-colors group-hover:border-accent">
        {business.shortMark}
        <span className="absolute -bottom-px -right-px h-2 w-2 bg-accent" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="max-w-[10.5rem] font-display text-[0.74rem] uppercase leading-[1.15] tracking-[0.06em] text-paper min-[420px]:max-w-none min-[420px]:whitespace-nowrap min-[420px]:text-[0.82rem] sm:text-[0.95rem] sm:tracking-[0.12em]"><Ph f={profile.name} /></span>
        <span className="mt-1 hidden font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist/55 sm:block">Baskı & ambalaj · teknik servis</span>
      </span>
    </Link>
  );
}
