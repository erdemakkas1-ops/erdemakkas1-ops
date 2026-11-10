/** Interim wordmark in the brand's black & gold; swap for the client's original logo file when supplied. */
export default function Logo({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const text = tone === "dark" ? "text-[#1c1b19]" : "text-[#f6f2ea]";
  return <span className="flex items-center gap-3">
    <svg viewBox="0 0 40 40" aria-hidden="true" className="h-9 w-9 shrink-0">
      <rect width="40" height="40" rx="10" fill="#1c1b19" />
      <path d="M9 30 L20 9 L31 30" fill="none" stroke="#c9a86a" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M14.5 23.5 H25.5" stroke="#c9a86a" strokeWidth="2.2" />
      <path d="M17 30 V26 H23 V30" fill="none" stroke="#e8dcc2" strokeWidth="1.6" />
    </svg>
    <span className="flex flex-col leading-none">
      <span className={`font-serif text-[1.35rem] font-semibold tracking-[0.14em] ${text}`}>ALAGÖZLER</span>
      {!compact && <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a88a55]">Emlak & İnşaat</span>}
    </span>
  </span>;
}
