import { BALCONY_DEPTH, FLOOR_COUNT, FLOOR_HEIGHT, PODIUM_HEIGHT, TOWER_DEPTH, TOWER_WIDTH } from "./buildingConfig";

export type BuildingFloor = {
  floorNumber: number;
  center: [number, number, number];
  size: [number, number, number];
};

export type Unit = "A" | "B" | "C";

export type FacadeWindow = {
  floor: number;
  /** A: west wing (left from the street), B: centre and back, C: east wing. */
  unit: Unit;
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  /** 0–1, stable per pane; drives each room's light level. */
  seed: number;
};

export type BayKind = "wing" | "pier" | "inner" | "fin" | "centre";
export type Bay = { x0: number; x1: number; kind: BayKind; unit?: Unit; panes?: number };

export const TOWER_TOP = PODIUM_HEIGHT + FLOOR_COUNT * FLOOR_HEIGHT;
export const FRONT_Z = TOWER_DEPTH / 2;
export const HALF_W = TOWER_WIDTH / 2;

/** Pane band within a storey: slab and spandrel below, transom above. */
export const PANE_BOTTOM = 0.13;
export const PANE_TOP = 0.88;

// Front facade, west half; the east half mirrors it (see `frontBays`).
const WEST_BAYS: Bay[] = [
  { x0: -7.5, x1: -3.5, kind: "wing", unit: "A", panes: 4 },
  { x0: -3.5, x1: -2.6, kind: "pier" },
  { x0: -2.6, x1: -1.25, kind: "inner", unit: "A", panes: 2 },
  { x0: -1.25, x1: -1.0, kind: "fin" },
  { x0: -1.0, x1: 0, kind: "centre", unit: "B", panes: 1 },
];

export const frontBays: Bay[] = [
  ...WEST_BAYS,
  ...WEST_BAYS.slice().reverse().map(bay => ({ ...bay, x0: -bay.x1, x1: -bay.x0, unit: bay.unit === "A" ? "C" as const : bay.unit })),
];

export const buildingFloors: BuildingFloor[] = Array.from({ length: FLOOR_COUNT }, (_, index) => ({
  floorNumber: index + 1,
  center: [0, PODIUM_HEIGHT + (index + 0.5) * FLOOR_HEIGHT, BALCONY_DEPTH / 2],
  size: [TOWER_WIDTH + BALCONY_DEPTH * 2, FLOOR_HEIGHT, TOWER_DEPTH + BALCONY_DEPTH],
}));

function hash(a: number, b: number, c: number) {
  const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

const OUTSET = 0.012;
const PANE_HEIGHT = (PANE_TOP - PANE_BOTTOM) * FLOOR_HEIGHT;

function panesAcross(floor: number, from: number, to: number, count: number, place: (along: number) => Pick<FacadeWindow, "position" | "rotationY" | "unit">, salt: number): FacadeWindow[] {
  const width = (to - from) / count;
  const y = PODIUM_HEIGHT + (floor - 1) * FLOOR_HEIGHT + (PANE_BOTTOM + PANE_TOP) / 2 * FLOOR_HEIGHT;
  return Array.from({ length: count }, (_, i) => {
    const spot = place(from + (i + 0.5) * width);
    spot.position[1] = y;
    return { floor, ...spot, width: width - 0.06, height: PANE_HEIGHT, seed: hash(floor, salt, i) };
  });
}

const westOrEast = (x: number): Unit => (x < -2 ? "A" : x > 2 ? "C" : "B");

export const facadeWindows: FacadeWindow[] = Array.from({ length: FLOOR_COUNT }, (_, index) => index + 1).flatMap(floor => [
  // Street front.
  ...frontBays.filter(bay => bay.panes).flatMap((bay, i) => panesAcross(floor, bay.x0, bay.x1, bay.panes!, x => ({ position: [x, 0, FRONT_Z + OUTSET], rotationY: 0, unit: bay.unit! }), i)),
  // Sides: west (A) and east (C), behind the wrap-around balconies at the front corner.
  ...panesAcross(floor, -FRONT_Z + 0.4, FRONT_Z - 0.2, 5, z => ({ position: [-HALF_W - OUTSET, 0, z], rotationY: -Math.PI / 2, unit: "A" }), 20),
  ...panesAcross(floor, -FRONT_Z + 0.4, FRONT_Z - 0.2, 5, z => ({ position: [HALF_W + OUTSET, 0, z], rotationY: Math.PI / 2, unit: "C" }), 30),
  // Back.
  ...panesAcross(floor, -HALF_W + 0.4, HALF_W - 0.4, 9, x => ({ position: [x, 0, -FRONT_Z - OUTSET], rotationY: Math.PI, unit: westOrEast(x) }), 40),
]);
