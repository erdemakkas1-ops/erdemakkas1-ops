/**
 * Single source of truth for the scroll story.
 *
 * GSAP ScrollTrigger scrubs `story.p` (0..1). The film frame, the phone pan and the DOM overlay are all
 * pure functions of that number, so scrolling back up rewinds the room exactly.
 */

export const story = {
  /** smoothed (scrubbed) progress 0..1 */
  p: 0,
  /** first frame (the empty room) is on screen */
  ready: false,
  /** 0..1 share of film frames downloaded */
  loaded: 0,
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

/**
 * The film: V1 (K0 empty -> K1 finishes), V2 (K1 -> K2 furniture), V3 (K2 -> K3 finished), joined end to end.
 * The empty room holds for a moment at the top and the finished room at the bottom.
 */
export const FILM = { start: 0.06, end: 0.94 } as const;
/** progress -> 0..1 position in the film */
export const filmT = (p: number) => clamp01((p - FILM.start) / (FILM.end - FILM.start));
/** film position -> progress (inverse of filmT) */
const atFilm = (t: number) => FILM.start + t * (FILM.end - FILM.start);

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
    text: 'Balıksırtı meşe parke, ceviz çıtalı duvar, traverten TV duvarı ve gizli tavan.',
    at: atFilm(0.2),
  },
  {
    id: 'mobilyalar',
    rail: 'MOBİLYALAR',
    no: '03',
    title: 'Mobilya yerleşimi',
    text: 'L koltuk, traverten sehpa, deri berjerler ve TV ünitesi ölçüsüne göre yerleşir.',
    at: atFilm(0.55),
  },
  {
    id: 'son-dokunus',
    rail: 'SON DOKUNUŞ',
    no: '04',
    title: 'Tamamlanmış yaşam alanı',
    text: 'Halı, tekstil, zeytin ağacı, perdeler, sarkıt ve gizli LED ile mekân yaşanır hâle gelir.',
    at: atFilm(0.85),
  },
] as const;

/** boundaries between the three clips, in progress units */
export const SEAMS = [atFilm(1 / 3), atFilm(2 / 3)] as const;

/** progress -> active stage index (used by overlay + rail) */
export function stageIndex(p: number) {
  if (p < FILM.start) return 0;
  if (p < SEAMS[0]) return 1;
  if (p < SEAMS[1]) return 2;
  return 3;
}

/** caption visibility windows (progress), one per stage; stage 0 uses the hero */
export const CAPTION_WINDOWS: [number, number][] = [
  [-1, -1],
  [FILM.start + 0.02, SEAMS[0] - 0.02],
  [SEAMS[0] + 0.02, SEAMS[1] - 0.02],
  [SEAMS[1] + 0.02, FILM.end - 0.015],
];

// ------------------------------------------------------------------ math helpers
export function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
