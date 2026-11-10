import type { ListingKind } from "@/types/listing";

/*
 * Deterministic, lightweight SVG illustrations used as representative images until the client
 * supplies real photos. Same seed + variant always draws the same picture (SSR-safe).
 */

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 800;
const H = 560;

type Sky = { top: string; mid: string; low: string; sun: string; haze: string; far: string; near: string; light: number };
const skies: Sky[] = [
  // golden hour
  { top: "#3a3540", mid: "#b9825a", low: "#f2cf98", sun: "#fff3d6", haze: "#d9a877", far: "#8f6b55", near: "#6f5544", light: 1 },
  // soft morning
  { top: "#8ea2ad", mid: "#cdc6b6", low: "#f1e6cf", sun: "#fffaf0", haze: "#c9bfae", far: "#a39883", near: "#857a66", light: 0.8 },
  // dusk
  { top: "#1d1c24", mid: "#5d4248", low: "#d98d62", sun: "#ffd7a3", haze: "#9a6a58", far: "#4c3a38", near: "#35292a", light: 0.55 },
  // bright afternoon
  { top: "#9fb2bb", mid: "#d8d4c6", low: "#efe7d4", sun: "#ffffff", haze: "#d6cdb8", far: "#b2a58c", near: "#968a72", light: 0.9 },
];

function ridge(random: () => number, baseY: number, amplitude: number, steps: number) {
  let d = `M0 ${H} L0 ${baseY}`;
  for (let i = 0; i <= steps; i++) {
    const x = (W / steps) * i;
    const y = baseY - random() * amplitude;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${W} ${H} Z`;
}

function SkyLayer({ id, sky, sunX, sunY }: { id: string; sky: Sky; sunX: number; sunY: number }) {
  return <>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={sky.top} />
        <stop offset="0.55" stopColor={sky.mid} />
        <stop offset="1" stopColor={sky.low} />
      </linearGradient>
      <radialGradient id={`${id}-sun`}>
        <stop offset="0" stopColor={sky.sun} stopOpacity="1" />
        <stop offset="0.12" stopColor={sky.sun} stopOpacity="0.9" />
        <stop offset="0.4" stopColor={sky.sun} stopOpacity="0.18" />
        <stop offset="1" stopColor={sky.sun} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id}-sky)`} />
    <circle cx={sunX} cy={sunY} r={210} fill={`url(#${id}-sun)`} />
  </>;
}

function Land({ random, sky, horizon, kind }: { random: () => number; sky: Sky; horizon: number; kind: "arsa" | "tarla" }) {
  const vx = 260 + random() * 280;
  const isField = kind === "tarla";
  const rows = isField ? 26 : 9;
  const groundTop = isField ? "#a9a065" : "#c49a66";
  const groundBottom = isField ? "#5f6b3a" : "#8c6a45";
  const lines = Array.from({ length: rows + 1 }, (_, i) => {
    const bx = -600 + ((W + 1200) / rows) * i;
    return <line key={i} x1={vx} y1={horizon} x2={bx} y2={H} stroke={isField ? (i % 2 ? "#4f5c2f" : "#c9bb78") : "#f3dfb5"} strokeOpacity={isField ? 0.55 : 0.18} strokeWidth={isField ? 7 : 1.2} />;
  });
  const parcel = `M${vx - 70} ${horizon + 28} L${vx + 90} ${horizon + 28} L${vx + 330} ${H - 70} L${vx - 300} ${H - 70} Z`;
  const tree = isField && random() > 0.35;
  const tx = random() > 0.5 ? 120 + random() * 120 : 560 + random() * 120;
  return <>
    <rect y={horizon} width={W} height={H - horizon} fill={groundBottom} />
    <path d={`M0 ${horizon} H${W} V${H} H0 Z`} fill={groundTop} opacity="0.55" />
    <g>{lines}</g>
    {!isField && <>
      <path d={parcel} fill="#f3dfb5" fillOpacity="0.08" stroke="#f6e3b8" strokeOpacity="0.85" strokeWidth="2" strokeDasharray="10 8" />
      {[[vx - 70, horizon + 28, 0.4], [vx + 90, horizon + 28, 0.4], [vx + 330, H - 70, 1], [vx - 300, H - 70, 1]].map(([x, y, s], i) =>
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-2" y="-34" width="4" height="34" fill="#efe6d6" />
          <path d="M2 -34 L22 -28 L2 -22 Z" fill="#c9a86a" />
        </g>)}
      {/* road */}
      <path d={`M${vx + 30} ${horizon} L${vx + 44} ${horizon} L${W + 120} ${H} L${W - 140} ${H} Z`} fill="#3d3a36" opacity="0.92" />
      <path d={`M${vx + 37} ${horizon} L${W - 10} ${H}`} stroke="#e8d9b5" strokeWidth="2" strokeDasharray="14 18" opacity="0.6" />
      {/* utility poles */}
      {[0.25, 0.5, 0.8].map(t => {
        const x = vx + 60 + (W + 40 - vx) * t;
        const y = horizon + (H - horizon) * t;
        const h = 40 + 120 * t;
        return <g key={t} stroke="#2c2925" strokeWidth={1 + 2 * t}><line x1={x} y1={y} x2={x} y2={y - h} /><line x1={x - 12 * t - 4} y1={y - h + 6} x2={x + 12 * t + 4} y2={y - h + 6} /></g>;
      })}
    </>}
    {tree && <g transform={`translate(${tx} ${horizon + 40})`}>
      <rect x="-4" y="-6" width="8" height="40" fill="#3b2f22" />
      <ellipse cx="0" cy="-26" rx="46" ry="30" fill="#4b5a2c" />
      <ellipse cx="-14" cy="-34" rx="26" ry="18" fill="#62723a" />
    </g>}
    <rect y={horizon} width={W} height="10" fill={sky.haze} opacity="0.35" />
  </>;
}

function Buildings({ random, sky, horizon, kind }: { random: () => number; sky: Sky; horizon: number; kind: "daire" | "mustakil" | "diger" }) {
  const windowLit = sky.light < 0.7 ? "#ffcf8a" : "#5d6770";
  const stone = "#d8c6a2";
  const ground = <>
    <rect y={horizon} width={W} height={H - horizon} fill="#8d8170" />
    <rect y={H - 90} width={W} height="90" fill="#46423c" />
    <rect y={H - 96} width={W} height="8" fill="#b9ab92" />
  </>;
  if (kind === "daire") {
    const blocks = Array.from({ length: 4 }, (_, i) => {
      const w = 120 + random() * 70;
      const x = 30 + i * 190 + random() * 30;
      const floors = 6 + Math.floor(random() * 6);
      const h = floors * 30;
      const y = H - 96 - h;
      const shade = i % 2 ? "#cdbb98" : "#e6dcc7";
      const cols = Math.floor(w / 30);
      return <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill={shade} />
        <rect x={x + w - 10} y={y} width="10" height={h} fill="#000" opacity="0.12" />
        {Array.from({ length: floors }, (_, f) => Array.from({ length: cols }, (_, c) => (
          <rect key={`${f}-${c}`} x={x + 8 + c * 30} y={y + 8 + f * 30} width="16" height="18" fill={random() > (sky.light < 0.7 ? 0.45 : 0.9) ? "#ffd99a" : windowLit} opacity={0.9} />
        )))}
        {Array.from({ length: floors }, (_, f) => <rect key={f} x={x - 4} y={y + 28 + f * 30} width={w + 8} height="3" fill="#7d705e" opacity="0.6" />)}
      </g>;
    });
    return <>{ground}{blocks}</>;
  }
  if (kind === "mustakil") {
    // Flat-roofed cut-stone house with arched openings, a nod to the region's architecture.
    const x = 190 + random() * 120;
    const y = H - 96 - 190;
    return <>
      {ground}
      <rect x="0" y={H - 150} width={W} height="58" fill="#c9b48e" />
      <path d={`M0 ${H - 150} H${W}`} stroke="#a8936d" strokeWidth="4" />
      <rect x={x} y={y} width="360" height="190" fill={stone} />
      <rect x={x - 8} y={y - 10} width="376" height="14" fill="#bfa97f" />
      <rect x={x + 210} y={y - 80} width="150" height="72" fill="#e2d3b3" />
      <rect x={x + 202} y={y - 88} width="166" height="12" fill="#bfa97f" />
      {[0, 1, 2].map(i => <path key={i} d={`M${x + 30 + i * 62} ${y + 150} v-70 a22 22 0 0 1 44 0 v70 Z`} fill={windowLit} stroke="#9f8a63" strokeWidth="4" />)}
      <path d={`M${x + 236} ${y + 190} v-96 a30 30 0 0 1 60 0 v96 Z`} fill="#5b4632" stroke="#9f8a63" strokeWidth="4" />
      {[0, 1].map(i => <rect key={i} x={x + 225 + i * 70} y={y - 62} width="40" height="40" fill={windowLit} />)}
      <g transform={`translate(${x > 260 ? 110 : 650} ${H - 150})`}>
        <rect x="-5" y="-60" width="10" height="64" fill="#3b2f22" />
        <circle cx="0" cy="-98" r="56" fill="#55653a" />
        <circle cx="-22" cy="-112" r="34" fill="#6d7d47" />
      </g>
    </>;
  }
  const x = 140 + random() * 80;
  const y = H - 96 - 220;
  return <>
    {ground}
    <rect x={x} y={y} width="520" height="220" fill="#e7dfcf" />
    <rect x={x} y={y} width="520" height="34" fill="#2a2826" />
    <text x={x + 260} y={y + 23} textAnchor="middle" fontSize="15" letterSpacing="6" fill="#c9a86a" fontFamily="sans-serif">MAĞAZA</text>
    <rect x={x + 20} y={y + 70} width="480" height="150" fill={sky.light < 0.7 ? "#f5c98a" : "#7f8d93"} opacity="0.85" />
    {[1, 2, 3].map(i => <rect key={i} x={x + 20 + i * 120} y={y + 70} width="5" height="150" fill="#2a2826" />)}
    <path d={`M${x + 10} ${y + 70} L${x + 510} ${y + 70} L${x + 530} ${y + 104} L${x - 10} ${y + 104} Z`} fill="#3a3632" />
  </>;
}

export default function PropertyArt({ kind, seed, variant = 0, className, title }: { kind: ListingKind; seed: string; variant?: number; className?: string; title?: string }) {
  const random = rng(hash(`${seed}:${variant}`));
  const sky = skies[(hash(seed) + variant) % skies.length];
  const id = `pa-${hash(`${seed}-${variant}`).toString(36)}`;
  const horizon = 250 + random() * 70;
  const sunX = 120 + random() * 560;
  const sunY = horizon - 40 - random() * 90;
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    <SkyLayer id={id} sky={sky} sunX={sunX} sunY={sunY} />
    <path d={ridge(random, horizon - 8, 60, 9)} fill={sky.far} opacity="0.55" />
    <path d={ridge(random, horizon + 2, 26, 14)} fill={sky.near} opacity="0.75" />
    {kind === "arsa" || kind === "tarla"
      ? <Land random={random} sky={sky} horizon={horizon} kind={kind} />
      : <Buildings random={random} sky={sky} horizon={horizon} kind={kind} />}
    <rect width={W} height={H} fill="#000" opacity={0.18 * (1 - sky.light)} />
  </svg>;
}
