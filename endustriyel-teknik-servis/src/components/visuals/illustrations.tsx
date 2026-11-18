/**
 * Teknik çizim tarzı SVG illüstrasyonlar.
 * Gerçek fotoğraflar gelene kadar premium görünümlü, hafif ve ölçeklenebilir yer tutucular.
 * Tüm çizgiler `non-scaling-stroke` ile her boyutta ince kalır.
 */

import type { ReactNode } from 'react';

const ACCENT = '#C88A4A';
const ns = { vectorEffect: 'non-scaling-stroke' as const };

type SvgProps = { className?: string; title: string };

function Svg({ viewBox, className, title, children }: SvgProps & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

function Label({ x, y, children, anchor = 'start', accent }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; accent?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={accent ? ACCENT : 'currentColor'}
      stroke="none"
      fontFamily="var(--font-mono), ui-monospace, monospace"
      fontSize={13}
      letterSpacing={1.5}
      opacity={accent ? 0.95 : 0.55}
    >
      {children}
    </text>
  );
}

function Cross({ x, y, s = 7, o = 0.5 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g opacity={o} {...ns}>
      <line x1={x - s} y1={y} x2={x + s} y2={y} {...ns} />
      <line x1={x} y1={y - s} x2={x} y2={y + s} {...ns} />
    </g>
  );
}

function Cylinder({ cx, cy, r, accent, detail = true }: { cx: number; cy: number; r: number; accent?: boolean; detail?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} {...ns} stroke={accent ? ACCENT : 'currentColor'} opacity={accent ? 0.95 : 0.8} />
      {detail && <circle cx={cx} cy={cy} r={r * 0.72} {...ns} opacity={0.28} />}
      {detail && <circle cx={cx} cy={cy} r={Math.max(3, r * 0.14)} {...ns} opacity={0.6} />}
      <Cross x={cx} y={cy} s={r * 0.3} o={0.35} />
    </g>
  );
}

function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g opacity={0.5}>
      <line x1={x1} y1={y} x2={x2} y2={y} {...ns} />
      <line x1={x1} y1={y - 8} x2={x1} y2={y + 8} {...ns} />
      <line x1={x2} y1={y - 8} x2={x2} y2={y + 8} {...ns} />
      <path d={`M${x1 + 10} ${y - 4} L${x1} ${y} L${x1 + 10} ${y + 4}`} {...ns} />
      <path d={`M${x2 - 10} ${y - 4} L${x2} ${y} L${x2 - 10} ${y + 4}`} {...ns} />
      <Label x={(x1 + x2) / 2} y={y - 10} anchor="middle">
        {label}
      </Label>
    </g>
  );
}

function gearPath(cx: number, cy: number, rOuter: number, rInner: number, teeth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const p = (ang: number, r: number) => `${(cx + Math.cos(ang) * r).toFixed(1)} ${(cy + Math.sin(ang) * r).toFixed(1)}`;
    pts.push(`${i === 0 ? 'M' : 'L'}${p(a, rInner)}`);
    pts.push(`L${p(a + step * 0.12, rOuter)}`);
    pts.push(`L${p(a + step * 0.45, rOuter)}`);
    pts.push(`L${p(a + step * 0.57, rInner)}`);
  }
  return `${pts.join(' ')} Z`;
}

/* ------------------------------------------------------------------ */
/* Ofset baskı makinesi – yan görünüş                                   */
/* ------------------------------------------------------------------ */

export function PressIllustration({ className, title, units = 4, labels = true }: SvgProps & { units?: number; labels?: boolean }) {
  const startX = 360;
  const unitW = 880 / units;
  const baseY = 760;
  const impY = 610;
  const unitArr = Array.from({ length: units }, (_, i) => i);
  const impR = Math.min(54, unitW * 0.26);
  const blanketR = impR * 0.82;
  const plateR = impR * 0.82;

  const paperPath = [
    `M120 520`,
    `L300 520`,
    `L${startX - 20} ${impY + impR}`,
    ...unitArr.map((i) => {
      const cx = startX + unitW * i + unitW / 2;
      return `L${cx} ${impY + impR}`;
    }),
    `L${startX + 880 + 40} ${impY + impR}`,
    `L1330 360`,
    `L1480 360`,
    `L1500 600`,
  ].join(' ');

  return (
    <Svg viewBox="0 0 1600 900" className={className} title={title}>
      {/* zemin ve eksen çizgileri */}
      <line x1={40} y1={baseY} x2={1560} y2={baseY} {...ns} opacity={0.7} />
      {Array.from({ length: 38 }, (_, i) => (
        <line key={i} x1={40 + i * 40} y1={baseY} x2={28 + i * 40} y2={baseY + 14} {...ns} opacity={0.25} />
      ))}
      <line x1={40} y1={impY} x2={1560} y2={impY} {...ns} opacity={0.12} strokeDasharray="14 8 2 8" />

      {/* besleme (feeder) */}
      <g>
        <rect x={80} y={430} width={240} height={330} rx={4} {...ns} opacity={0.85} />
        <rect x={100} y={600} width={200} height={140} {...ns} opacity={0.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={108} y1={610 + i * 10} x2={292} y2={610 + i * 10} {...ns} opacity={0.25} />
        ))}
        <rect x={120} y={455} width={140} height={60} rx={3} {...ns} opacity={0.6} />
        <circle cx={150} cy={485} r={12} {...ns} opacity={0.6} />
        <circle cx={190} cy={485} r={12} {...ns} opacity={0.6} />
        <circle cx={230} cy={485} r={12} {...ns} opacity={0.6} />
        {labels && <Label x={80} y={415}>FEEDER</Label>}
      </g>

      {/* baskı üniteleri */}
      {unitArr.map((i) => {
        const x = startX + unitW * i;
        const cx = x + unitW / 2;
        const accent = i === 1;
        return (
          <g key={i}>
            <path
              d={`M${x + 8} ${baseY} L${x + 8} ${300} L${x + 26} ${262} L${x + unitW - 26} ${262} L${x + unitW - 8} ${300} L${x + unitW - 8} ${baseY}`}
              {...ns}
              opacity={0.85}
            />
            <line x1={x + 8} y1={700} x2={x + unitW - 8} y2={700} {...ns} opacity={0.35} />
            {/* baskı, kauçuk, kalıp silindirleri */}
            <Cylinder cx={cx} cy={impY} r={impR} accent={accent} />
            <Cylinder cx={cx + blanketR * 0.55} cy={impY - impR - blanketR + 4} r={blanketR} />
            <Cylinder cx={cx + blanketR * 0.2} cy={impY - impR - blanketR * 3 + 10} r={plateR} />
            {/* mürekkep merdane dizisi */}
            {[
              [-0.55, -4.25, 0.32],
              [0.25, -4.55, 0.3],
              [0.95, -4.15, 0.28],
              [-0.25, -5.15, 0.26],
              [0.6, -5.3, 0.24],
              [-0.95, -3.55, 0.24],
            ].map(([dx, dy, rr], k) => (
              <circle
                key={k}
                cx={cx + dx * impR}
                cy={impY + dy * impR * 0.95}
                r={rr * impR}
                {...ns}
                opacity={0.55}
              />
            ))}
            {/* mürekkep hazne */}
            <path d={`M${cx - impR * 0.9} ${impY - impR * 5.9} l${impR * 1.6} 0 l${-impR * 0.3} ${impR * 0.45} l${-impR * 1.0} 0 z`} {...ns} opacity={0.45} />
            {/* transfer tamburu */}
            {i < units - 1 && <Cylinder cx={x + unitW} cy={impY + impR * 0.55} r={impR * 0.55} detail={false} />}
            {labels && (
              <Label x={cx} y={245} anchor="middle" accent={accent}>
                {`UNIT ${String(i + 1).padStart(2, '0')}`}
              </Label>
            )}
            <line x1={cx} y1={impY - impR * 6.1} x2={cx} y2={baseY - 6} {...ns} opacity={0.12} strokeDasharray="10 6 2 6" />
          </g>
        );
      })}

      {/* platform korkuluğu */}
      <g opacity={0.45}>
        <line x1={startX} y1={200} x2={startX + 880} y2={200} {...ns} />
        <line x1={startX} y1={224} x2={startX + 880} y2={224} {...ns} />
        {Array.from({ length: units * 2 + 1 }, (_, i) => (
          <line key={i} x1={startX + (880 / (units * 2)) * i} y1={200} x2={startX + (880 / (units * 2)) * i} y2={262} {...ns} />
        ))}
      </g>

      {/* çıkış (delivery) */}
      <g>
        <path d={`M${startX + 880 + 10} ${baseY} L${startX + 880 + 10} 340 L1500 340 L1520 380 L1520 ${baseY}`} {...ns} opacity={0.85} />
        <rect x={1340} y={620} width={160} height={120} {...ns} opacity={0.5} />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={1348} y1={628 + i * 11} x2={1492} y2={628 + i * 11} {...ns} opacity={0.25} />
        ))}
        <circle cx={1290} cy={380} r={22} {...ns} opacity={0.6} />
        <circle cx={1470} cy={380} r={22} {...ns} opacity={0.6} />
        {labels && <Label x={1520} y={325} anchor="end">DELIVERY</Label>}
      </g>

      {/* kağıt yolu – vurgu */}
      <path d={paperPath} stroke={ACCENT} strokeWidth={1.8} {...ns} strokeDasharray="1 0" className="draw-path" pathLength={1} />
      {unitArr.map((i) => (
        <circle key={i} cx={startX + unitW * i + unitW / 2} cy={impY + impR} r={4} fill={ACCENT} stroke="none" />
      ))}

      {labels && (
        <>
          <Dim x1={startX} x2={startX + unitW} y={820} label={`${Math.round(unitW * 1.9)} mm`} />
          <Dim x1={80} x2={320} y={820} label="FEED" />
          <Label x={1560} y={880} anchor="end">FIG. 01 — SHEETFED OFFSET / SIDE ELEVATION</Label>
        </>
      )}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Elektrik panosu                                                      */
/* ------------------------------------------------------------------ */

export function PanelIllustration({ className, title }: SvgProps) {
  const rails = [210, 340, 470, 600];
  return (
    <Svg viewBox="0 0 1200 800" className={className} title={title}>
      <rect x={260} y={90} width={680} height={640} rx={6} {...ns} opacity={0.9} />
      <rect x={282} y={112} width={636} height={596} {...ns} opacity={0.35} />
      {/* kablo kanalları */}
      {[150, 275, 405, 535, 665].map((y) => (
        <g key={y} opacity={0.4}>
          <rect x={300} y={y} width={600} height={26} {...ns} />
          {Array.from({ length: 30 }, (_, i) => (
            <line key={i} x1={306 + i * 20} y1={y} x2={306 + i * 20} y2={y + 26} {...ns} opacity={0.5} />
          ))}
        </g>
      ))}
      {rails.map((y, r) => (
        <g key={y}>
          <line x1={300} y1={y + 32} x2={900} y2={y + 32} {...ns} opacity={0.5} />
          {r === 0 &&
            Array.from({ length: 11 }, (_, i) => (
              <g key={i}>
                <rect x={318 + i * 50} y={y - 8} width={36} height={78} rx={3} {...ns} stroke={i === 6 ? ACCENT : 'currentColor'} opacity={i === 6 ? 1 : 0.75} />
                <rect x={330 + i * 50} y={y + 20} width={12} height={20} {...ns} opacity={0.6} />
              </g>
            ))}
          {r === 1 &&
            Array.from({ length: 6 }, (_, i) => (
              <g key={i}>
                <rect x={318 + i * 95} y={y - 10} width={74} height={88} rx={4} {...ns} opacity={0.8} />
                <circle cx={355 + i * 95} cy={y + 22} r={12} {...ns} opacity={0.5} />
                <line x1={330 + i * 95} y1={y + 56} x2={380 + i * 95} y2={y + 56} {...ns} opacity={0.4} />
              </g>
            ))}
          {r === 2 && (
            <g>
              <rect x={318} y={y - 12} width={190} height={92} rx={3} {...ns} opacity={0.8} />
              {Array.from({ length: 4 }, (_, i) => (
                <rect key={i} x={330 + i * 44} y={y} width={34} height={66} {...ns} opacity={0.45} />
              ))}
              {Array.from({ length: 8 }, (_, i) => (
                <circle key={i} cx={530 + i * 20} cy={y + 34} r={4} fill={i % 3 === 0 ? ACCENT : 'currentColor'} stroke="none" opacity={i % 3 === 0 ? 0.9 : 0.35} />
              ))}
              <rect x={720} y={y - 12} width={170} height={92} rx={3} {...ns} opacity={0.7} />
              <rect x={740} y={y + 4} width={130} height={36} {...ns} opacity={0.4} />
            </g>
          )}
          {r === 3 &&
            Array.from({ length: 34 }, (_, i) => (
              <rect key={i} x={318 + i * 17} y={y - 4} width={12} height={64} {...ns} opacity={0.55} />
            ))}
        </g>
      ))}
      {/* ölçüm probu */}
      <path d="M626 200 C 600 120, 1000 80, 1060 260" stroke={ACCENT} {...ns} strokeWidth={1.6} />
      <rect x={1010} y={260} width={110} height={170} rx={10} {...ns} opacity={0.85} />
      <rect x={1028} y={282} width={74} height={40} {...ns} stroke={ACCENT} />
      <Label x={1065} y={308} anchor="middle" accent>
        230V
      </Label>
      <circle cx={1065} cy={380} r={22} {...ns} opacity={0.6} />
      <Label x={260} y={70}>ELECTRICAL CABINET · =A1</Label>
      <Label x={1180} y={780} anchor="end">FIG. 02</Label>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mekanik – dişli, rulman, kayış                                        */
/* ------------------------------------------------------------------ */

export function MechanicalIllustration({ className, title }: SvgProps) {
  return (
    <Svg viewBox="0 0 1200 800" className={className} title={title}>
      <path d={gearPath(420, 400, 230, 205, 28)} {...ns} opacity={0.85} />
      <circle cx={420} cy={400} r={150} {...ns} opacity={0.3} />
      {/* rulman kesiti */}
      <circle cx={420} cy={400} r={110} {...ns} opacity={0.8} />
      <circle cx={420} cy={400} r={66} {...ns} opacity={0.8} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={420 + Math.cos(a) * 88}
            cy={400 + Math.sin(a) * 88}
            r={16}
            {...ns}
            stroke={i === 2 ? ACCENT : 'currentColor'}
            opacity={i === 2 ? 1 : 0.65}
          />
        );
      })}
      <circle cx={420} cy={400} r={40} {...ns} opacity={0.6} />
      <rect x={410} y={355} width={20} height={14} {...ns} opacity={0.6} />
      <Cross x={420} y={400} s={260} o={0.18} />
      {/* ikinci dişli */}
      <path d={gearPath(818, 290, 132, 114, 16)} {...ns} opacity={0.75} />
      <circle cx={818} cy={290} r={36} {...ns} opacity={0.6} />
      <Cross x={818} y={290} s={150} o={0.18} />
      {/* kayış kasnak */}
      <circle cx={860} cy={620} r={70} {...ns} opacity={0.75} />
      <circle cx={1080} cy={560} r={44} {...ns} opacity={0.75} />
      <line x1={846} y1={551} x2={1072} y2={517} {...ns} opacity={0.8} />
      <line x1={876} y1={688} x2={1092} y2={602} {...ns} opacity={0.8} />
      {/* titreşim grafiği */}
      <path
        d={`M690 120 ${Array.from({ length: 40 }, (_, i) => `L${690 + i * 11} ${120 + Math.sin(i * 1.3) * (i > 22 && i < 30 ? 30 : 9)}`).join(' ')}`}
        stroke={ACCENT}
        {...ns}
        strokeWidth={1.5}
      />
      <Label x={690} y={80}>VIBRATION · mm/s</Label>
      <Dim x1={190} x2={650} y={720} label="Ø 460" />
      <Label x={1180} y={780} anchor="end">FIG. 03</Label>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* PLC rack + I/O                                                        */
/* ------------------------------------------------------------------ */

export function PlcIllustration({ className, title }: SvgProps) {
  return (
    <Svg viewBox="0 0 1200 800" className={className} title={title}>
      <rect x={140} y={230} width={760} height={300} rx={6} {...ns} opacity={0.85} />
      <line x1={140} y1={265} x2={900} y2={265} {...ns} opacity={0.35} />
      {/* CPU */}
      <rect x={160} y={280} width={140} height={232} rx={3} {...ns} opacity={0.85} />
      <rect x={174} y={300} width={110} height={54} {...ns} opacity={0.5} />
      <circle cx={186} cy={378} r={5} fill={ACCENT} stroke="none" />
      <circle cx={206} cy={378} r={5} fill="currentColor" stroke="none" opacity={0.4} />
      <rect x={174} y={410} width={46} height={30} {...ns} opacity={0.5} />
      <rect x={230} y={410} width={46} height={30} {...ns} opacity={0.5} />
      {/* I/O modül gövdeleri */}
      {Array.from({ length: 8 }, (_, j) => (
        <rect key={j} x={312 + j * 74} y={280} width={64} height={232} rx={3} {...ns} opacity={0.8} />
      ))}
      {/* modül LED ve klemensleri */}
      {Array.from({ length: 8 }, (_, j) => {
        const i = j + 1;
        const x = 160 + 140 + 12 + j * 74;
        return (
          <g key={`m${i}`}>
            {Array.from({ length: 8 }, (_, k) => (
              <circle
                key={k}
                cx={x + 18 + (k % 2) * 28}
                cy={300 + Math.floor(k / 2) * 18}
                r={4}
                fill={(i * 3 + k) % 5 === 0 ? ACCENT : 'currentColor'}
                stroke="none"
                opacity={(i * 3 + k) % 5 === 0 ? 0.95 : 0.3}
              />
            ))}
            {Array.from({ length: 10 }, (_, k) => (
              <rect key={k} x={x + 8} y={384 + k * 12} width={48} height={7} {...ns} opacity={0.35} />
            ))}
          </g>
        );
      })}
      {/* sinyal hatları */}
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M${360 + k * 148} 512 L${360 + k * 148} ${590 + k * 10} L${1000} ${590 + k * 10}`}
          {...ns}
          stroke={k === 1 ? ACCENT : 'currentColor'}
          opacity={k === 1 ? 1 : 0.45}
          strokeWidth={k === 1 ? 1.6 : 1.1}
        />
      ))}
      {/* sensör ve aktüatörler */}
      <g>
        <rect x={1000} y={570} width={90} height={26} rx={13} {...ns} opacity={0.8} />
        <line x1={1090} y1={583} x2={1140} y2={583} {...ns} strokeDasharray="4 6" stroke={ACCENT} />
        <rect x={1000} y={620} width={120} height={40} rx={4} {...ns} opacity={0.6} />
        <line x1={1120} y1={640} x2={1160} y2={640} {...ns} opacity={0.6} />
      </g>
      <Label x={140} y={210}>PLC RACK · I/O MAP</Label>
      <Label x={1000} y={550}>%I 4.2</Label>
      <Label x={1180} y={780} anchor="end">FIG. 04</Label>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Servo sürücü + motor                                                 */
/* ------------------------------------------------------------------ */

export function DriveIllustration({ className, title }: SvgProps) {
  return (
    <Svg viewBox="0 0 1200 800" className={className} title={title}>
      {[0, 1, 2].map((i) => {
        const x = 140 + i * 150;
        return (
          <g key={i}>
            <rect x={x} y={160} width={120} height={380} rx={4} {...ns} opacity={0.85} />
            <rect x={x + 16} y={182} width={88} height={50} {...ns} stroke={i === 1 ? ACCENT : 'currentColor'} opacity={i === 1 ? 1 : 0.5} />
            {i === 1 && (
              <Label x={x + 60} y={213} anchor="middle" accent>
                E.OC
              </Label>
            )}
            {Array.from({ length: 4 }, (_, k) => (
              <circle key={k} cx={x + 28 + k * 22} cy={256} r={5} {...ns} opacity={0.5} />
            ))}
            {Array.from({ length: 12 }, (_, k) => (
              <line key={k} x1={x + 16} y1={290 + k * 18} x2={x + 104} y2={290 + k * 18} {...ns} opacity={0.3} />
            ))}
            <path d={`M${x + 60} 540 L${x + 60} ${600 + i * 14} L700 ${600 + i * 14}`} {...ns} opacity={0.5} />
          </g>
        );
      })}
      {/* servo motor */}
      <g>
        <rect x={700} y={520} width={290} height={170} rx={8} {...ns} opacity={0.9} />
        {Array.from({ length: 9 }, (_, k) => (
          <line key={k} x1={730 + k * 28} y1={520} x2={730 + k * 28} y2={690} {...ns} opacity={0.25} />
        ))}
        <rect x={660} y={545} width={40} height={120} rx={4} {...ns} opacity={0.7} />
        <rect x={990} y={560} width={34} height={90} {...ns} opacity={0.7} />
        <line x1={1024} y1={605} x2={1110} y2={605} {...ns} strokeWidth={2} opacity={0.8} />
        <rect x={1090} y={590} width={12} height={30} {...ns} opacity={0.5} />
        <Cross x={860} y={605} s={190} o={0.15} />
      </g>
      {/* hareket profili */}
      <g>
        <line x1={700} y1={380} x2={1120} y2={380} {...ns} opacity={0.3} />
        <line x1={700} y1={200} x2={700} y2={380} {...ns} opacity={0.3} />
        <path d="M700 380 L780 220 L960 220 L1040 380" stroke={ACCENT} {...ns} strokeWidth={1.8} />
        <path
          d={`M700 300 ${Array.from({ length: 60 }, (_, i) => `L${700 + i * 7} ${300 + Math.sin(i * 0.55) * 34}`).join(' ')}`}
          {...ns}
          opacity={0.4}
        />
        <Label x={700} y={180}>VELOCITY PROFILE · rpm</Label>
      </g>
      <Label x={140} y={140}>SERVO DRIVES · AX1–AX3</Label>
      <Label x={1180} y={780} anchor="end">FIG. 05</Label>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Periyodik bakım – gösterge + kontrol listesi                         */
/* ------------------------------------------------------------------ */

export function MaintenanceIllustration({ className, title }: SvgProps) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <Svg viewBox="0 0 1200 800" className={className} title={title}>
      {/* gösterge */}
      <g>
        <circle cx={400} cy={420} r={230} {...ns} opacity={0.8} />
        <circle cx={400} cy={420} r={200} {...ns} opacity={0.3} />
        {ticks.map((i) => {
          const a = Math.PI * 0.75 + (i / 40) * Math.PI * 1.5;
          const long = i % 5 === 0;
          const r1 = long ? 168 : 180;
          return (
            <line
              key={i}
              x1={400 + Math.cos(a) * r1}
              y1={420 + Math.sin(a) * r1}
              x2={400 + Math.cos(a) * 196}
              y2={420 + Math.sin(a) * 196}
              {...ns}
              stroke={i > 32 ? ACCENT : 'currentColor'}
              opacity={i > 32 ? 0.95 : long ? 0.7 : 0.35}
            />
          );
        })}
        <line x1={400} y1={420} x2={400 + Math.cos(Math.PI * 1.65) * 150} y2={420 + Math.sin(Math.PI * 1.65) * 150} stroke={ACCENT} strokeWidth={2.4} {...ns} />
        <circle cx={400} cy={420} r={14} {...ns} />
        <Label x={400} y={540} anchor="middle">
          OPERATING HOURS
        </Label>
      </g>
      {/* kontrol listesi */}
      <g>
        <rect x={720} y={150} width={360} height={500} rx={6} {...ns} opacity={0.85} />
        <rect x={850} y={130} width={100} height={40} rx={6} {...ns} opacity={0.7} />
        {Array.from({ length: 7 }, (_, i) => {
          const y = 220 + i * 58;
          const done = i < 4;
          return (
            <g key={i}>
              <rect x={750} y={y} width={26} height={26} rx={3} {...ns} stroke={done ? ACCENT : 'currentColor'} opacity={done ? 1 : 0.5} />
              {done && <path d={`M756 ${y + 13} l6 7 l10 -14`} stroke={ACCENT} {...ns} strokeWidth={1.8} />}
              <line x1={796} y1={y + 9} x2={1040 - (i % 3) * 40} y2={y + 9} {...ns} opacity={0.5} />
              <line x1={796} y1={y + 21} x2={960 - (i % 2) * 50} y2={y + 21} {...ns} opacity={0.25} />
            </g>
          );
        })}
      </g>
      <Label x={720} y={110}>PM CHECKLIST · REV.04</Label>
      <Label x={1180} y={780} anchor="end">FIG. 06</Label>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Platin kesim hattı (ambalaj)                                          */
/* ------------------------------------------------------------------ */

export function DieCutterIllustration({ className, title }: SvgProps) {
  const baseY = 700;
  const stations = [
    { x: 120, w: 230, label: 'FEEDER' },
    { x: 360, w: 260, label: 'DIE-CUT' },
    { x: 630, w: 210, label: 'STRIPPING' },
    { x: 850, w: 210, label: 'BLANKING' },
  ];
  return (
    <Svg viewBox="0 0 1200 800" className={className} title={title}>
      <line x1={60} y1={baseY} x2={1140} y2={baseY} {...ns} opacity={0.7} />
      {stations.map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={250} width={s.w} height={baseY - 250} rx={4} {...ns} opacity={0.85} />
          <Label x={s.x + s.w / 2} y={232} anchor="middle" accent={i === 1}>
            {s.label}
          </Label>
        </g>
      ))}
      {/* platin mekanizması */}
      <rect x={385} y={300} width={210} height={46} {...ns} opacity={0.8} />
      <rect x={385} y={430} width={210} height={46} {...ns} stroke={ACCENT} />
      <path d="M420 476 L470 560 L420 640 M560 476 L510 560 L560 640" {...ns} opacity={0.65} />
      <circle cx={470} cy={560} r={9} {...ns} opacity={0.7} />
      <circle cx={510} cy={560} r={9} {...ns} opacity={0.7} />
      <Cylinder cx={490} cy={640} r={34} />
      {/* pense zinciri */}
      <path d="M150 400 L1040 400" stroke={ACCENT} strokeWidth={1.8} {...ns} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={170 + i * 74} y={394} width={18} height={12} fill={ACCENT} stroke="none" opacity={0.8} />
      ))}
      <circle cx={150} cy={400} r={20} {...ns} opacity={0.7} />
      <circle cx={1040} cy={400} r={20} {...ns} opacity={0.7} />
      {/* yığınlar */}
      {[150, 880].map((x) => (
        <g key={x}>
          <rect x={x} y={560} width={170} height={120} {...ns} opacity={0.5} />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={x + 8} y1={570 + i * 12} x2={x + 162} y2={570 + i * 12} {...ns} opacity={0.25} />
          ))}
        </g>
      ))}
      <Label x={60} y={760}>DIE-CUTTING LINE · SIDE ELEVATION</Label>
      <Label x={1180} y={780} anchor="end">FIG. 07</Label>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Fotoğraf yer tutucu                                                   */
/* ------------------------------------------------------------------ */

export function PhotoPlaceholder({ className, title }: SvgProps) {
  return (
    <Svg viewBox="0 0 800 600" className={className} title={title}>
      {[
        'M60 60 h60 M60 60 v60',
        'M740 60 h-60 M740 60 v60',
        'M60 540 h60 M60 540 v-60',
        'M740 540 h-60 M740 540 v-60',
      ].map((d) => (
        <path key={d} d={d} {...ns} opacity={0.6} />
      ))}
      <rect x={330} y={250} width={140} height={100} rx={10} {...ns} opacity={0.6} />
      <circle cx={400} cy={300} r={30} {...ns} stroke={ACCENT} />
      <rect x={350} y={236} width={40} height={14} rx={3} {...ns} opacity={0.6} />
    </Svg>
  );
}
