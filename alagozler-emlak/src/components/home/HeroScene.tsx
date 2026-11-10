/*
 * Layered golden-hour panorama of an open plain with surveyed parcels and a distant hilltop
 * citadel silhouette — a representative image of the region, not a photo of a listing.
 * Layers are separate so the hero can drift them at different speeds.
 */
const W = 1600;
const H = 1000;

export function HeroSky() {
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e1d22" />
        <stop offset="0.38" stopColor="#4a3a3a" />
        <stop offset="0.62" stopColor="#b97c55" />
        <stop offset="0.78" stopColor="#efc184" />
        <stop offset="1" stopColor="#f6dcae" />
      </linearGradient>
      <radialGradient id="hs-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff4da" />
        <stop offset="0.1" stopColor="#ffe6b5" stopOpacity="0.95" />
        <stop offset="0.35" stopColor="#f8c27e" stopOpacity="0.35" />
        <stop offset="1" stopColor="#f8c27e" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hs-sky)" />
    <circle cx="1080" cy="640" r="420" fill="url(#hs-sun)" />
  </svg>;
}

export function HeroHills() {
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
    <path d="M0 700 L120 672 L260 690 L420 650 L560 676 L700 640 L820 662 L960 630 L1100 668 L1260 640 L1420 672 L1600 650 V1000 H0Z" fill="#8b5f4a" opacity="0.55" />
    {/* hilltop citadel with two columns */}
    <g fill="#5a4038" transform="translate(860 0)">
      <path d="M300 702 Q340 610 430 600 L520 600 Q600 610 640 702 Z" />
      <rect x="420" y="560" width="62" height="44" />
      <rect x="432" y="536" width="10" height="66" /><rect x="462" y="536" width="10" height="66" />
      <rect x="428" y="530" width="18" height="8" /><rect x="458" y="530" width="18" height="8" />
      <path d="M500 600 h12 v-22 h10 v22 h12 v-14 h10 v14 h10 v6 h-54Z" />
    </g>
    {/* low city */}
    <path d="M640 712 V690 h30 v-14 h24 v14 h40 v-22 h18 v22 h36 v-10 h44 v10 h30 v-30 h6 v-10 h4 v10 h6 v30 h40 v-18 h50 v18 h26 V712Z" fill="#6a4a40" opacity="0.8" />
    <path d="M0 735 L200 718 L380 730 L600 712 L820 728 L1040 710 L1260 726 L1460 712 L1600 722 V1000 H0Z" fill="#6c4a3b" opacity="0.85" />
  </svg>;
}

export function HeroPlain() {
  const vx = 1060;
  const vy = 735;
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="hs-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c99a62" />
        <stop offset="0.45" stopColor="#8e6640" />
        <stop offset="1" stopColor="#3a2a1d" />
      </linearGradient>
    </defs>
    <rect y={vy} width={W} height={H - vy} fill="url(#hs-ground)" />
    {Array.from({ length: 23 }, (_, i) => {
      const bx = -1400 + i * 200;
      return <line key={i} x1={vx} y1={vy} x2={bx} y2={H} stroke="#f6dcae" strokeOpacity="0.12" strokeWidth="1.5" />;
    })}
    {[760, 790, 835, 900, 990].map(y => <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#f6dcae" strokeOpacity="0.08" />)}
    <path d={`M${vx - 120} 790 L${vx + 160} 790 L${vx + 420} 935 L${vx - 330} 935 Z`} fill="#f6dcae" fillOpacity="0.07" stroke="#e8c88e" strokeOpacity="0.8" strokeWidth="2.5" strokeDasharray="14 10" />
    {[[vx - 120, 790, 0.5], [vx + 160, 790, 0.5], [vx + 420, 935, 1], [vx - 330, 935, 1]].map(([x, y, s], i) =>
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x="-3" y="-52" width="6" height="52" fill="#f2e7d2" />
        <path d="M3 -52 L34 -43 L3 -34 Z" fill="#c9a86a" />
      </g>)}
    <path d={`M${vx + 18} ${vy} L${vx + 34} ${vy} L${W + 300} ${H} L${W - 220} ${H} Z`} fill="#2c2723" />
    <path d={`M${vx + 26} ${vy} L${W + 40} ${H}`} stroke="#e8d9b5" strokeWidth="3" strokeDasharray="22 26" opacity="0.5" />
    <g transform="translate(1480 880)">
      <rect x="-6" y="-8" width="12" height="70" fill="#2d241b" />
      <ellipse cx="0" cy="-50" rx="92" ry="60" fill="#3f4a26" />
      <ellipse cx="-30" cy="-66" rx="52" ry="36" fill="#55622f" />
    </g>
  </svg>;
}
