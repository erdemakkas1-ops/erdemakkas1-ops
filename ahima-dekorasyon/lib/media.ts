import { asset } from './asset';

/** Bump when frames are re-rendered so browsers and CDNs fetch the new files. */
export const MEDIA_VERSION = 1;

export type Sequence = { folder: string; frames: number; width: number; height: number };

/**
 * Concept visualisation, path-traced in Blender Cycles from one modelled room (scripts/bathroom.py,
 * scripts/kitchen.py). Desktop frames are 16:9; phones get a portrait camera of the same room.
 */
export const media = {
  bath: {
    desktop: { folder: asset('/media/bath/d'), frames: 96, width: 1280, height: 720 } as Sequence,
    mobile: { folder: asset('/media/bath/m'), frames: 60, width: 720, height: 1280 } as Sequence,
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
