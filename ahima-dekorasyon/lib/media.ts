import { asset } from './asset';

/** Bump when frames are re-rendered so browsers and CDNs fetch the new files. */
export const MEDIA_VERSION = 1;

/** `map`: optional [scroll time, frame index] keypoints, so a sequence's clips line up with the stage captions. */
export type Sequence = { folder: string; frames: number; width: number; height: number; map?: [number, number][] };

/** Fractional frame position for scroll time p (0..1). */
export function framePos(seq: Sequence, p: number) {
  const m = seq.map;
  if (!m) return p * (seq.frames - 1);
  if (p <= m[0][0]) return m[0][1];
  for (let i = 1; i < m.length; i++) {
    const [s1, f1] = m[i];
    const [s0, f0] = m[i - 1];
    if (p <= s1) return f0 + ((p - s0) / Math.max(1e-6, s1 - s0)) * (f1 - f0);
  }
  return m[m.length - 1][1];
}

/**
 * Concept visualisation. Desktop: path-traced in Blender Cycles from one modelled room (scripts/bathroom.py,
 * scripts/kitchen.py). Phones: the bathroom film is made from Higgsfield video clips (portrait 9:16).
 */
export const media = {
  bath: {
    desktop: { folder: asset('/media/bath/d'), frames: 96, width: 1280, height: 720 } as Sequence,
    // phones: three Higgsfield (Seedance) clips - demolition + tiling, fixtures, lights - joined by short dissolves
    mobile: {
      folder: asset('/media/bath/m'), frames: 108, width: 720, height: 1280,
      map: [[0, 0], [0.09, 0], [0.475, 31], [0.5, 38], [0.715, 69], [0.74, 76], [0.95, 107], [1, 107]],
    } as Sequence,
  },
  kitchen: {
    desktop: { folder: asset('/media/kitchen/d'), frames: 40, width: 1280, height: 720 } as Sequence,
    mobile: { folder: asset('/media/kitchen/m'), frames: 30, width: 720, height: 1280 } as Sequence,
  },
  before: asset('/media/config/once.webp'),
  config: (tile: string, cabinet: string) => asset(`/media/config/${tile}-${cabinet}.webp`),
  swatch: (name: string) => asset(`/media/swatch/${name}.webp`),
  og: asset('/media/og.jpg'),
};

export const frameUrl = (seq: Sequence, i: number) => `${seq.folder}/${String(i + 1).padStart(4, '0')}.webp?v=${MEDIA_VERSION}`;
