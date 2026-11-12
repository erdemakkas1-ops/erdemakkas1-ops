import { WINDOWS } from '@/lib/story';

/**
 * Which GLB nodes move together (an "actor") and how each actor enters the room.
 *
 * kinds:
 *  - rise   : clipping plane rises from the floor (wall panels, slats, stone) — no stretching of textures
 *  - sweep  : clipping plane sweeps from the window towards the camera (parquet being laid)
 *  - place  : slides a short metric distance into its final position while fading in (furniture)
 *  - drop   : settles from a few centimetres above (cushions, books, vases)
 *  - unroll : grows along +Z from its back edge (rug)
 *  - lower  : descends out of the ceiling (pendant)
 *  - draw   : grows along X from the window edge (curtains)
 *  - fade   : opacity only
 *  - light  : emissive ramp; also drives the room lights (cove LEDs, downlights)
 *
 * Every actor stores its exact final transform; the pose is always computed from progress, never accumulated.
 */
export type Kind = 'rise' | 'sweep' | 'place' | 'drop' | 'unroll' | 'lower' | 'draw' | 'fade' | 'light';
export type Ease = 'outCubic' | 'outQuart' | 'inOutCubic' | 'inOutSine' | 'outBackSoft' | 'linear';

export type Anim = {
  kind: Kind;
  start: number;
  dur: number;
  offset?: [number, number, number];
  ease?: Ease;
};

type Rule = {
  test: RegExp;
  /** actor key; nodes sharing a key move as one object */
  key: (name: string) => string;
  anim: (index: number, count: number) => Anim;
  /** sort key for stagger order */
  order?: (name: string, center: { x: number; y: number; z: number }) => number;
};

const [S0, S1] = WINDOWS.surfaces;
const [F0] = WINDOWS.furniture;
const [D0] = WINDOWS.details;

export const HIDDEN = /^floor_(plank|cross)_joint_/; // replaced by the real herringbone texture

export const RULES: Rule[] = [
  // ------------------------------------------------------------- 01 surfaces (0.12 – 0.38)
  { test: /^surface_oak_parquet$/, key: (n) => n, anim: () => ({ kind: 'sweep', start: S0, dur: 0.13, ease: 'inOutSine' }) },
  { test: /^surface_walnut_backing$/, key: (n) => n, anim: () => ({ kind: 'rise', start: S0 + 0.04, dur: 0.07, ease: 'inOutCubic' }) },
  {
    test: /^wall_walnut_slat_\d+$/,
    key: (n) => n,
    order: (_n, c) => c.z,
    anim: (i, count) => ({ kind: 'rise', start: S0 + 0.07 + (i / (count - 1)) * 0.09, dur: 0.045, ease: 'outCubic' }),
  },
  { test: /^surface_right_travertine$/, key: (n) => n, anim: () => ({ kind: 'rise', start: S0 + 0.1, dur: 0.1, ease: 'inOutCubic' }) },
  { test: /^stone_vertical_seam_\d$/, key: (n) => n, anim: (i) => ({ kind: 'rise', start: S0 + 0.13 + i * 0.012, dur: 0.07, ease: 'inOutCubic' }) },
  { test: /^surface_cove_ceiling$/, key: (n) => n, anim: () => ({ kind: 'lower', start: S1 - 0.1, dur: 0.08, offset: [0, 0.07, 0], ease: 'outCubic' }) },

  // ------------------------------------------------------------- 02 furniture (0.34 – 0.79)
  { test: /^tv_low_cabinet$/, key: () => 'tv_cabinet', anim: () => ({ kind: 'place', start: F0 + 0.01, dur: 0.09, offset: [-0.4, 0.12, 0.3] }) },
  { test: /^tv_(display_black_screen|screen_trim|screen_front)$/, key: () => 'tv', anim: () => ({ kind: 'place', start: F0 + 0.07, dur: 0.08, offset: [-0.28, 0.1, 0] }) },
  {
    test: /^sofa_(main_base|main_back|chaise_base|left_arm|right_arm)$/,
    key: () => 'sofa',
    anim: () => ({ kind: 'place', start: F0 + 0.1, dur: 0.13, offset: [0.1, 0.2, 0.7], ease: 'outBackSoft' }),
  },
  {
    test: /^sofa_cushion_\d$/,
    key: (n) => n,
    order: (_n, c) => c.x,
    anim: (i) => ({ kind: 'drop', start: F0 + 0.2 + i * 0.025, dur: 0.06, offset: [0, 0.22, 0.12], ease: 'outBackSoft' }),
  },
  { test: /^coffee_table_/, key: () => 'coffee_table', anim: () => ({ kind: 'place', start: F0 + 0.23, dur: 0.1, offset: [0, 0.16, 0.5] }) },
  { test: /^side_table_/, key: () => 'side_table', anim: () => ({ kind: 'place', start: F0 + 0.28, dur: 0.08, offset: [0.25, 0.12, 0.35] }) },
  {
    test: /^chair_\d_/,
    key: (n) => n.slice(0, 7),
    anim: (i) => ({ kind: 'place', start: F0 + 0.3 + i * 0.05, dur: 0.1, offset: [0, 0.15, 0.55] }),
    order: (n) => Number(n[6]),
  },

  // ------------------------------------------------------------- 03 details (0.72 – 0.94)
  { test: /^detail_area_rug$/, key: (n) => n, anim: () => ({ kind: 'unroll', start: D0, dur: 0.07, ease: 'inOutCubic' }) },
  {
    test: /^detail_plant_(pot|stem|leaf_cluster_\d)$/,
    key: () => 'plant',
    anim: () => ({ kind: 'place', start: D0 + 0.03, dur: 0.08, offset: [0.25, 0.12, 0.45] }),
  },
  {
    test: /^detail_pillow_\d$/,
    key: (n) => n,
    order: (_n, c) => c.x,
    anim: (i) => ({ kind: 'drop', start: D0 + 0.05 + i * 0.02, dur: 0.05, offset: [0, 0.2, 0.1], ease: 'outBackSoft' }),
  },
  {
    test: /^detail_book_\d$/,
    key: (n) => n,
    order: (_n, c) => c.y,
    anim: (i) => ({ kind: 'drop', start: D0 + 0.08 + i * 0.014, dur: 0.035, offset: [0, 0.08, 0] }),
  },
  {
    test: /^detail_(vase_body|flower_\d)$/,
    key: () => 'vase',
    anim: () => ({ kind: 'drop', start: D0 + 0.11, dur: 0.045, offset: [0, 0.1, 0] }),
  },
  {
    test: /^detail_cabinet_vase_\d$/,
    key: (n) => n,
    order: (_n, c) => c.z,
    anim: (i) => ({ kind: 'drop', start: D0 + 0.1 + i * 0.015, dur: 0.04, offset: [0, 0.1, 0] }),
  },
  {
    test: /^detail_pendant_(ring|cable)_\d$/,
    key: () => 'pendant',
    anim: () => ({ kind: 'lower', start: D0 + 0.11, dur: 0.07, offset: [0, 0.75, 0], ease: 'outCubic' }),
  },
  { test: /^detail_cove_light_\d$/, key: () => 'cove_lights', anim: () => ({ kind: 'light', start: D0 + 0.13, dur: 0.08, ease: 'inOutSine' }) },
];

/** additions that are not GLB nodes (clearly separated from the provided models) */
export const EXTRA_ANIMS: Record<string, Anim> = {
  curtains: { kind: 'draw', start: D0 + 0.07, dur: 0.07, ease: 'inOutCubic' },
  downlights: { kind: 'light', start: D0 + 0.15, dur: 0.06, ease: 'inOutSine' },
};

/** room light factor for the cove/pendant/downlights (0..1) */
export const LIGHTS_ON = { start: D0 + 0.12, dur: 0.1 };
