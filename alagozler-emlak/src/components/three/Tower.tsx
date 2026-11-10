"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, IcosahedronGeometry, Object3D, PlaneGeometry, type BufferGeometry, type InstancedMesh, type WebGLProgramParametersWithUniforms } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BALCONY_DEPTH, FLOOR_COUNT, FLOOR_HEIGHT, PODIUM_BACK, PODIUM_FRONT, PODIUM_HEIGHT, PODIUM_WIDTH } from "@/lib/buildingConfig";
import { FRONT_Z, HALF_W, TOWER_TOP, facadeWindows, frontBays, type Unit } from "@/lib/buildingLayout";

export type UnitHighlight = { floor: number; unit: Unit } | null;

type Box = [x: number, y: number, z: number, w: number, h: number, d: number];

/** Axis-aligned box from min/max corners. */
const span = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Box =>
  [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)];

function merge(boxes: Box[]): BufferGeometry {
  const parts = boxes.map(([x, y, z, w, h, d]) => new BoxGeometry(w, h, d).translate(x, y, z));
  const merged = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return merged;
}

function mergeBlobs(blobs: Array<[x: number, y: number, z: number, r: number]>): BufferGeometry {
  const parts = blobs.map(([x, y, z, r]) => new IcosahedronGeometry(r, 1).translate(x, y, z));
  const merged = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return merged;
}

const SLAB = 0.14;
const RAIL = 0.42;

function createTower() {
  const charcoal: Box[] = [];
  const wood: Box[] = [];
  const stone: Box[] = [];
  const railGlass: Box[] = [];
  const light: Box[] = [];
  const plants: Array<[number, number, number, number]> = [];
  const penthouse: Box[] = [];

  // Dark core behind all glazing.
  charcoal.push(span(-HALF_W + 0.02, HALF_W - 0.02, PODIUM_HEIGHT, TOWER_TOP, -FRONT_Z + 0.02, FRONT_Z - 0.02));

  for (let floor = 0; floor <= FLOOR_COUNT; floor++) {
    const y = PODIUM_HEIGHT + floor * FLOOR_HEIGHT;
    const top = floor === FLOOR_COUNT;
    for (const bay of frontBays) {
      if (bay.kind === "wing") {
        const outer = bay.x0 < 0 ? bay.x0 - BALCONY_DEPTH : bay.x1 + BALCONY_DEPTH;
        const inner = bay.x0 < 0 ? bay.x1 : bay.x0;
        const sideX = bay.x0 < 0 ? bay.x0 : bay.x1;
        const front = FRONT_Z + BALCONY_DEPTH;
        // L-shaped balcony wrapping the front corner: front run and side run.
        charcoal.push(span(outer, inner, y - SLAB / 2, y + SLAB / 2, FRONT_Z - 0.02, front));
        charcoal.push(span(outer, sideX, y - SLAB / 2, y + SLAB / 2, FRONT_Z - 2.6, FRONT_Z));
        if (floor > 0) {
          wood.push(span(outer + 0.02 * Math.sign(-outer), inner, y - SLAB / 2 - 0.025, y - SLAB / 2, FRONT_Z, front - 0.02));
          light.push(span(outer, inner, y - SLAB / 2 - 0.035, y - SLAB / 2 - 0.01, front - 0.09, front - 0.05));
        }
        if (!top) {
          railGlass.push(span(outer, inner, y + SLAB / 2, y + SLAB / 2 + RAIL, front - 0.03, front - 0.01));
          railGlass.push(span(outer + Math.sign(-outer) * 0.01, outer + Math.sign(-outer) * 0.03, y + SLAB / 2, y + SLAB / 2 + RAIL, FRONT_Z - 2.6, front));
          charcoal.push(span(outer, inner, y + SLAB / 2 + RAIL, y + SLAB / 2 + RAIL + 0.03, front - 0.04, front));
          // Planters at both ends of each balcony.
          for (const px of [outer + Math.sign(-outer) * 0.35, inner - Math.sign(-outer) * 0.3]) {
            charcoal.push(span(px - 0.17, px + 0.17, y + SLAB / 2, y + SLAB / 2 + 0.2, front - 0.45, front - 0.12));
            plants.push([px, y + SLAB / 2 + 0.33, front - 0.28, 0.2]);
          }
        }
      } else if (bay.kind === "inner") {
        charcoal.push(span(bay.x0, bay.x1, y - SLAB / 2, y + SLAB / 2, FRONT_Z - 0.02, FRONT_Z + 0.35));
        if (!top) railGlass.push(span(bay.x0, bay.x1, y + SLAB / 2, y + SLAB / 2 + RAIL, FRONT_Z + 0.33, FRONT_Z + 0.35));
      } else if (bay.kind === "centre") {
        charcoal.push(span(bay.x0, bay.x1, y - 0.07, y + 0.13, FRONT_Z - 0.02, FRONT_Z + 0.05));
      }
    }
    // Spandrel band around the sides and back.
    charcoal.push(span(-HALF_W - 0.03, HALF_W + 0.03, y - 0.07, y + 0.12, -FRONT_Z - 0.03, -FRONT_Z + 0.05));
    for (const side of [-1, 1]) charcoal.push(span(side * (HALF_W - 0.05), side * (HALF_W + 0.03), y - 0.07, y + 0.12, -FRONT_Z, FRONT_Z - 2.6));
  }

  // Piers clad in timber, fins in charcoal; both run past the roof to carry the canopy.
  for (const bay of frontBays) {
    if (bay.kind === "pier") {
      wood.push(span(bay.x0, bay.x1, PODIUM_HEIGHT, TOWER_TOP + 1.45, FRONT_Z - 0.4, FRONT_Z + 0.35));
      // Vertical timber battens give the cladding grain.
      for (let x = bay.x0 + 0.09; x < bay.x1 - 0.05; x += 0.13) charcoal.push(span(x - 0.008, x + 0.008, PODIUM_HEIGHT, TOWER_TOP + 1.45, FRONT_Z + 0.35, FRONT_Z + 0.36));
      const edge = bay.x0 < 0 ? bay.x1 + 0.005 : bay.x0 - 0.005;
      light.push(span(edge - 0.012, edge + 0.012, PODIUM_HEIGHT + 0.1, TOWER_TOP + 1.2, FRONT_Z + 0.33, FRONT_Z + 0.36));
    }
    if (bay.kind === "fin") charcoal.push(span(bay.x0, bay.x1, PODIUM_HEIGHT, TOWER_TOP + 0.3, FRONT_Z - 0.2, FRONT_Z + 0.26));
  }
  // Light line down the centre of the glazed core.
  light.push(span(-0.03, 0.03, PODIUM_HEIGHT + 0.1, TOWER_TOP - 0.05, FRONT_Z + 0.03, FRONT_Z + 0.07));

  // Window frames: jambs and head for every pane.
  for (const pane of facadeWindows) {
    const [x, y, z] = pane.position;
    const alongX = Math.abs(Math.sin(pane.rotationY)) < 0.5;
    const half = pane.width / 2 + 0.03;
    for (const s of [-1, 1]) {
      charcoal.push(alongX ? span(x + s * half - 0.025, x + s * half + 0.025, y - pane.height / 2, y + pane.height / 2, z - 0.04, z + 0.04)
        : span(x - 0.04, x + 0.04, y - pane.height / 2, y + pane.height / 2, z + s * half - 0.025, z + s * half + 0.025));
    }
    const headY = y + pane.height / 2 + 0.02;
    charcoal.push(alongX ? span(x - half, x + half, headY - 0.02, headY + 0.02, z - 0.04, z + 0.04) : span(x - 0.04, x + 0.04, headY - 0.02, headY + 0.02, z - half, z + half));
  }

  // Roof: slab, glass parapet, planting and the timber-soffit canopy over the penthouse.
  const roofY = TOWER_TOP;
  charcoal.push(span(-HALF_W - BALCONY_DEPTH, HALF_W + BALCONY_DEPTH, roofY, roofY + 0.25, -FRONT_Z - 0.2, FRONT_Z + BALCONY_DEPTH));
  for (const z of [FRONT_Z + BALCONY_DEPTH - 0.02, -FRONT_Z - 0.18]) railGlass.push(span(-HALF_W - BALCONY_DEPTH, HALF_W + BALCONY_DEPTH, roofY + 0.25, roofY + 0.25 + RAIL, z - 0.01, z + 0.01));
  for (const x of [-HALF_W - BALCONY_DEPTH + 0.02, HALF_W + BALCONY_DEPTH - 0.02]) railGlass.push(span(x - 0.01, x + 0.01, roofY + 0.25, roofY + 0.25 + RAIL, -FRONT_Z - 0.2, FRONT_Z + BALCONY_DEPTH));
  penthouse.push(span(-3.4, 3.4, roofY + 0.25, roofY + 1.35, -2.6, 2.4));
  for (let x = -3.4; x <= 3.41; x += 0.85) charcoal.push(span(x - 0.03, x + 0.03, roofY + 0.25, roofY + 1.35, 2.38, 2.45));
  charcoal.push(span(-4.7, 4.7, roofY + 1.45, roofY + 1.75, -3.4, FRONT_Z + 0.5));
  wood.push(span(-4.65, 4.65, roofY + 1.42, roofY + 1.45, -3.35, FRONT_Z + 0.45));
  for (let x = -4; x <= 4.01; x += 1.6) for (const z of [-2, 0, 2, FRONT_Z - 0.2]) light.push(span(x - 0.05, x + 0.05, roofY + 1.405, roofY + 1.42, z - 0.05, z + 0.05));
  for (const [x, z] of [[-7.6, 4.2], [7.6, 4.2], [-7.6, -3.6], [7.6, -3.6], [-5.2, 4.2], [5.2, 4.2]]) {
    charcoal.push(span(x - 0.35, x + 0.35, roofY + 0.25, roofY + 0.55, z - 0.35, z + 0.35));
    plants.push([x, roofY + 0.75, z, 0.38]);
  }

  // Podium: charcoal frame, stone columns, lit two-storey glazing, a double-height lobby and timber slats at the ends.
  const podiumHalf = PODIUM_WIDTH / 2;
  charcoal.push(span(-podiumHalf, podiumHalf, 0, PODIUM_HEIGHT, PODIUM_BACK, PODIUM_FRONT - 0.35));
  charcoal.push(span(-podiumHalf - 0.25, podiumHalf + 0.25, PODIUM_HEIGHT - 0.32, PODIUM_HEIGHT, PODIUM_BACK - 0.25, PODIUM_FRONT + 0.4));
  charcoal.push(span(-podiumHalf, podiumHalf, 1.55, 1.75, PODIUM_FRONT - 0.35, PODIUM_FRONT + 0.15));
  const columns = [-12, -9.6, -6.6, -3.4, -1.7, 1.7, 3.4, 6.6, 9.6, 12];
  for (const x of columns) stone.push(span(x - 0.22, x + 0.22, 0, PODIUM_HEIGHT - 0.32, PODIUM_FRONT - 0.4, PODIUM_FRONT + 0.15));
  for (let x = -11.7; x <= -9.85; x += 0.2) wood.push(span(x - 0.035, x + 0.035, 0.1, PODIUM_HEIGHT - 0.35, PODIUM_FRONT - 0.3, PODIUM_FRONT - 0.18));
  for (let x = 9.85; x <= 11.71; x += 0.2) wood.push(span(x - 0.035, x + 0.035, 0.1, PODIUM_HEIGHT - 0.35, PODIUM_FRONT - 0.3, PODIUM_FRONT - 0.18));
  // Entrance canopy and steps.
  charcoal.push(span(-2.5, 2.5, 1.95, 2.08, PODIUM_FRONT, PODIUM_FRONT + 1.5));
  for (let x = -2; x <= 2.01; x += 1) light.push(span(x - 0.06, x + 0.06, 1.935, 1.95, PODIUM_FRONT + 0.75 - 0.06, PODIUM_FRONT + 0.75 + 0.06));
  for (let i = 0; i < 3; i++) stone.push(span(-1.6, 1.6, 0, 0.08 * (3 - i), PODIUM_FRONT + 0.15 + i * 0.3, PODIUM_FRONT + 0.45 + i * 0.3));
  // Podium roof garden around the tower.
  for (const side of [-1, 1]) {
    charcoal.push(span(side * 8.6, side * 11.8, PODIUM_HEIGHT, PODIUM_HEIGHT + 0.3, PODIUM_FRONT - 0.2, PODIUM_FRONT + 0.3));
    for (let x = 9; x <= 11.5; x += 0.55) plants.push([side * x, PODIUM_HEIGHT + 0.42, PODIUM_FRONT + 0.05, 0.24]);
    plants.push([side * 10.6, PODIUM_HEIGHT + 0.95, PODIUM_FRONT - 1.4, 0.55]);
  }

  return {
    charcoal: merge(charcoal), wood: merge(wood), stone: merge(stone), railGlass: merge(railGlass),
    light: merge(light), penthouse: merge(penthouse), plants: mergeBlobs(plants),
  };
}

/** Lit podium glazing: two storeys per bay, the lobby as one double-height pane. */
function podiumPanes() {
  const columns = [-9.6, -6.6, -3.4, -1.7, 1.7, 3.4, 6.6, 9.6];
  const panes: Array<{ x: number; y: number; w: number; h: number; lobby: boolean }> = [];
  for (let i = 0; i < columns.length - 1; i++) {
    const x0 = columns[i] + 0.22, x1 = columns[i + 1] - 0.22, x = (x0 + x1) / 2, w = x1 - x0;
    if (columns[i] === -1.7) panes.push({ x, y: (0.08 + 2.85) / 2, w, h: 2.77, lobby: true });
    else for (const [y0, y1] of [[0.08, 1.5], [1.8, 2.83]]) panes.push({ x, y: (y0 + y1) / 2, w, h: y1 - y0, lobby: false });
  }
  return panes;
}

/**
 * Makes each lit pane read as a room: a brighter ceiling band at the top, a soft falloff, and a
 * darker band at the bottom where furniture would sit. Uses the pane's own UVs, so it stays crisp.
 */
function roomDepth(shader: WebGLProgramParametersWithUniforms) {
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", `#include <common>
varying vec2 vRoomUv;`)
    .replace("#include <begin_vertex>", `#include <begin_vertex>
vRoomUv = uv;`);
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", `#include <common>
varying vec2 vRoomUv;`)
    .replace("#include <color_fragment>", `#include <color_fragment>
      float ceiling = smoothstep(0.78, 0.98, vRoomUv.y) * 0.35;
      float furniture = vRoomUv.y < 0.34 ? 0.55 + 0.45 * smoothstep(0.12, 0.34, vRoomUv.y) : 1.0;
      float edge = smoothstep(0.0, 0.06, vRoomUv.x) * smoothstep(0.0, 0.06, 1.0 - vRoomUv.x);
      diffuseColor.rgb *= (0.78 + ceiling) * furniture * mix(0.7, 1.0, edge);`);
}
const roomDepthKey = () => "room-depth";

const WARM = ["#f4cf98", "#f8dcae", "#eebf82", "#fbe5c0", "#efc890"].map(value => new Color(value));
const DIM = new Color("#6b4a2c");
const DARK = new Color("#1c1a1c");
const HIGHLIGHT = new Color("#ffd27d").multiplyScalar(1.4);

// `primary` stays for API compatibility with the reflection copy used earlier.
export default memo(function Tower({ highlight = null }: { highlight?: UnitHighlight; primary?: boolean }) {
  const geometry = useMemo(createTower, []);
  const paneGeometry = useMemo(() => new PlaneGeometry(1, 1), []);
  const podium = useMemo(podiumPanes, []);
  const windows = useRef<InstancedMesh>(null);
  const podiumWindows = useRef<InstancedMesh>(null);
  useEffect(() => () => {
    Object.values(geometry).forEach(part => part.dispose());
    paneGeometry.dispose();
  }, [geometry, paneGeometry]);

  useLayoutEffect(() => {
    const mesh = windows.current;
    if (!mesh) return;
    const dummy = new Object3D();
    facadeWindows.forEach((pane, i) => {
      dummy.position.set(...pane.position);
      dummy.rotation.set(0, pane.rotationY, 0);
      dummy.scale.set(pane.width, pane.height, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const selected = highlight !== null && pane.floor === highlight.floor && pane.unit === highlight.unit;
      mesh.setColorAt(i, selected ? HIGHLIGHT : pane.seed < 0.08 ? DARK : pane.seed < 0.2 ? DIM : WARM[Math.floor(pane.seed * 97) % WARM.length]);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [highlight]);

  useLayoutEffect(() => {
    const mesh = podiumWindows.current;
    if (!mesh) return;
    const dummy = new Object3D();
    podium.forEach((pane, i) => {
      dummy.position.set(pane.x, pane.y, PODIUM_FRONT - 0.33);
      dummy.scale.set(pane.w, pane.h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, pane.lobby ? new Color("#ffd39a") : WARM[i % WARM.length]);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [podium]);

  return <group>
    <mesh geometry={geometry.charcoal}><meshStandardMaterial color="#26272b" roughness={0.55} metalness={0.25} /></mesh>
    <mesh geometry={geometry.wood}><meshStandardMaterial color="#5e3e26" roughness={0.65} emissive="#2e1a0b" emissiveIntensity={0.5} /></mesh>
    <mesh geometry={geometry.stone}><meshStandardMaterial color="#b9a58a" roughness={0.7} emissive="#4a3520" emissiveIntensity={0.35} /></mesh>
    <mesh geometry={geometry.plants}><meshStandardMaterial color="#2c4a2c" roughness={0.9} flatShading emissive="#13240f" emissiveIntensity={0.6} /></mesh>
    <mesh geometry={geometry.light}><meshBasicMaterial color="#ffd8a0" toneMapped={false} /></mesh>
    <mesh geometry={geometry.penthouse}><meshBasicMaterial color="#c98d50" toneMapped={false} /></mesh>
    <mesh geometry={geometry.railGlass} renderOrder={2}>
      <meshStandardMaterial color="#9fb6c4" roughness={0.05} metalness={0.4} transparent opacity={0.22} depthWrite={false} />
    </mesh>
    <instancedMesh ref={windows} args={[paneGeometry, undefined, facadeWindows.length]} frustumCulled={false}>
      <meshBasicMaterial toneMapped={false} onBeforeCompile={roomDepth} customProgramCacheKey={roomDepthKey} />
    </instancedMesh>
    <instancedMesh ref={podiumWindows} args={[paneGeometry, undefined, podium.length]} frustumCulled={false}>
      <meshBasicMaterial toneMapped={false} onBeforeCompile={roomDepth} customProgramCacheKey={roomDepthKey} />
    </instancedMesh>
  </group>;
});

