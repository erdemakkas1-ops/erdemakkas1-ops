/**
 * Single source of truth for the scroll story.
 *
 * GSAP ScrollTrigger scrubs `story.p` (0..1). Everything else — the 3D reveal of every GLB node, the camera,
 * the lights and the DOM overlay — is a *pure function* of that number. That is what makes scrolling back up
 * rewind the room exactly, without drift, however fast or erratically the user scrolls.
 */

export const story = {
  /** smoothed (scrubbed) progress 0..1 */
  p: 0,
  /** first real frame of the empty room has been rendered */
  ready: false,
  reducedMotion: false,
};

type Listener = () => void;
const readyListeners = new Set<Listener>();
export function onReady(fn: Listener) {
  readyListeners.add(fn);
  return () => readyListeners.delete(fn);
}
export function markReady() {
  if (story.ready) return;
  story.ready = true;
  readyListeners.forEach((fn) => fn());
}

/** Timeline windows from 3d/scene_manifest.json + docs/SAHNE_VE_ANIMASYON.md */
export const WINDOWS = {
  empty: [0, 0.12],
  surfaces: [0.12, 0.38],
  furniture: [0.34, 0.79],
  details: [0.72, 0.94],
  final: [0.94, 1],
} as const;

export const STAGES = [
  {
    id: 'bos',
    rail: 'BOŞ',
    no: '01',
    title: 'Boş mekân',
    text: 'Ham beton zemin, çıplak sıva, tek bir pencere. Her şey buradan başlar.',
    at: 0,
  },
  {
    id: 'yuzeyler',
    rail: 'YÜZEYLER',
    no: '02',
    title: 'Zemin & duvar',
    text: 'Balıksırtı meşe parke, ceviz çıtalı duvar ve traverten TV duvarı yerine oturur.',
    at: 0.2,
  },
  {
    id: 'mobilyalar',
    rail: 'MOBİLYALAR',
    no: '03',
    title: 'Mobilya yerleşimi',
    text: 'L koltuk, traverten sehpa, deri berjerler ve TV ünitesi ölçüsüne göre yerleşir.',
    at: 0.52,
  },
  {
    id: 'son-dokunus',
    rail: 'SON DOKUNUŞ',
    no: '04',
    title: 'Tamamlanmış yaşam alanı',
    text: 'Halı, tekstil, bitkiler, sarkıt ve gizli LED ile mekân yaşanır hâle gelir.',
    at: 0.82,
  },
] as const;

/** progress -> active stage index (used by overlay + rail) */
export function stageIndex(p: number) {
  if (p < 0.12) return 0;
  if (p < 0.36) return 1;
  if (p < 0.72) return 2;
  return 3;
}

// ------------------------------------------------------------------ math helpers
export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** local 0..1 for a window [start, start+dur] */
export const local = (p: number, start: number, dur: number) => clamp01((p - start) / dur);

export const ease = {
  linear: (t: number) => t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  /** settles with a tiny, physical overshoot (a sofa being set down) */
  outBackSoft: (t: number) => {
    const c1 = 0.6;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};
