import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Geometry upgrades for the blockout GLB nodes.
 *
 * The GLB meshes are axis-aligned boxes / icospheres / 24-sided cylinders with their vertices baked in world
 * space. We keep each node's exact footprint (its world bounding box) and replace the primitive with a
 * better-shaped one of the same size: bevelled boxes, puffed cushions, lathed tables and vases, a real torus
 * for the pendant. Final position and size are therefore identical to the GLB — only the silhouette improves.
 */

export type Footprint = { center: THREE.Vector3; size: THREE.Vector3 };

/** deterministic PRNG so every load builds the same leaves/flowers */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rounded = (s: THREE.Vector3, r: number, seg = 3) => {
  const radius = Math.min(r, s.x / 2 - 1e-4, s.y / 2 - 1e-4, s.z / 2 - 1e-4);
  return new RoundedBoxGeometry(s.x, s.y, s.z, seg, Math.max(radius, 0.0005));
};

/** pillow look: bulge the two large faces along `axis` */
function puff(g: THREE.BufferGeometry, s: THREE.Vector3, axis: 'x' | 'y' | 'z', amount: number) {
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const h = s.clone().multiplyScalar(0.5);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const [a, b] = axis === 'z' ? ['x', 'y'] : axis === 'y' ? ['x', 'z'] : ['z', 'y'];
    const fa = 1 - Math.pow(v[a as 'x'] / h[a as 'x'], 2);
    const fb = 1 - Math.pow(v[b as 'x'] / h[b as 'x'], 2);
    const k = Math.max(0, fa) * Math.max(0, fb);
    const sign = Math.sign(v[axis]) || 1;
    v[axis] += sign * amount * k * h[axis];
    // pinch the edges slightly
    v[a as 'x'] *= 1 - 0.05 * (1 - fb);
    v[b as 'x'] *= 1 - 0.05 * (1 - fa);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function lathe(profile: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

/** cylinder with softened top/bottom edges, centred on origin */
function softCylinder(r: number, h: number, bevel: number, segments = 72) {
  const b = Math.min(bevel, h / 2 - 1e-4, r / 2);
  const pts: [number, number][] = [[0, -h / 2]];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push([r - b + Math.sin(a) * b, -h / 2 + b - Math.cos(a) * b]);
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push([r - b + Math.cos(a) * b, h / 2 - b + Math.sin(a) * b]);
  }
  pts.push([0, h / 2]);
  return lathe(pts, segments);
}

function vase(r: number, h: number) {
  const p: [number, number][] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // belly at 40% height, narrow neck, small lip
    const belly = Math.sin(Math.min(1, t / 0.85) * Math.PI) * 0.75 + 0.25;
    const rr = t > 0.88 ? r * 0.42 : r * (0.55 + 0.45 * belly);
    p.push([Math.max(rr, 0.001), -h / 2 + t * h]);
  }
  p.unshift([0, -h / 2]);
  p.push([r * 0.36, h / 2]);
  return lathe(p, 48);
}

function planter(r: number, h: number) {
  return lathe(
    [
      [0, -h / 2],
      [r * 0.78, -h / 2],
      [r * 0.8, -h / 2 + 0.01],
      [r * 0.98, h / 2 - 0.02],
      [r, h / 2],
      [r * 0.92, h / 2],
      [r * 0.9, h / 2 - 0.06],
      [0, h / 2 - 0.06],
    ],
    64,
  );
}

/** returns a geometry centred on (0,0,0) occupying `size` */
export function upgradedGeometry(name: string, fp: Footprint): THREE.BufferGeometry {
  const s = fp.size;
  // ---------- cushions / pillows (GLB: ellipsoids)
  if (name.startsWith('sofa_cushion')) return puff(rounded(new THREE.Vector3(s.x * 0.94, s.y * 0.9, s.z * 0.55), 0.06, 5), new THREE.Vector3(s.x * 0.94, s.y * 0.9, s.z * 0.55), 'z', 0.45);
  if (name.startsWith('detail_pillow')) return puff(rounded(new THREE.Vector3(s.x * 0.92, s.y * 0.95, s.z * 0.5), 0.04, 5), new THREE.Vector3(s.x * 0.92, s.y * 0.95, s.z * 0.5), 'z', 0.55);
  // ---------- sofa / chairs
  if (name === 'sofa_main_base' || name === 'sofa_chaise_base') return puff(rounded(s, 0.06, 4), s, 'y', 0.05);
  if (name === 'sofa_main_back') return puff(rounded(s, 0.08, 4), s, 'z', 0.12);
  if (name.endsWith('_arm')) return rounded(s, 0.07, 4);
  if (/^chair_\d_seat$/.test(name)) return puff(rounded(s, 0.06, 4), s, 'y', 0.12);
  if (/^chair_\d_back$/.test(name)) return puff(rounded(s, 0.05, 4), s, 'z', 0.15);
  if (/^chair_\d_leg/.test(name)) return rounded(s, 0.012, 2);
  // ---------- tables
  if (name === 'coffee_table_top') return softCylinder(s.x / 2, s.y, 0.025);
  if (name === 'coffee_table_pedestal') return softCylinder(s.x / 2, s.y, 0.01);
  if (name === 'side_table_top') return softCylinder(s.x / 2, s.y, 0.012);
  if (name === 'side_table_foot') return lathe([[0, -s.y / 2], [s.x / 2, -s.y / 2], [s.x / 2, -s.y / 2 + 0.015], [s.x / 5, -s.y / 2 + 0.03], [s.x / 6, s.y / 2], [0, s.y / 2]], 48);
  // ---------- TV
  if (name === 'tv_low_cabinet') return rounded(s, 0.012, 2);
  if (name.startsWith('tv_')) return rounded(s, 0.006, 2);
  // ---------- decor
  if (name === 'detail_vase_body') return vase(s.x / 2, s.y);
  if (name.startsWith('detail_cabinet_vase')) return vase(s.x / 2, s.y);
  if (name === 'detail_plant_pot') return planter(s.x / 2, s.y);
  if (name === 'detail_plant_stem') return new THREE.CylinderGeometry(s.x * 0.28, s.x * 0.5, s.y, 12);
  if (name.startsWith('detail_pendant_ring')) {
    const g = new THREE.TorusGeometry(s.x / 2 - 0.03, 0.022, 20, 128);
    g.rotateX(Math.PI / 2);
    g.scale(1, s.y / 0.044, 1);
    return g;
  }
  if (name.startsWith('detail_pendant_cable')) return new THREE.CylinderGeometry(0.004, 0.004, s.y, 6);
  if (name.startsWith('detail_book')) return rounded(s, 0.003, 2);
  if (name === 'detail_area_rug') return rounded(s, 0.012, 2);
  if (name.startsWith('wall_walnut_slat')) return rounded(s, 0.008, 2);
  if (name.startsWith('detail_flower')) return hydrangea(s, hash(name));
  if (name.startsWith('detail_plant_leaf_cluster')) return foliage(s, hash(name));
  // ---------- architecture: crisp boxes
  return new THREE.BoxGeometry(s.x, s.y, s.z);
}

export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** cluster of small florets filling the GLB flower ellipsoid */
function hydrangea(s: THREE.Vector3, seed: number) {
  const rnd = mulberry32(seed);
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 46; i++) {
    const u = rnd() * Math.PI * 2;
    const v = Math.acos(rnd() * 1.6 - 0.6); // upper hemisphere-biased
    const g = new THREE.IcosahedronGeometry(0.013 + rnd() * 0.008, 1);
    g.translate((Math.sin(v) * Math.cos(u) * s.x) / 2, (Math.cos(v) * s.y) / 2, (Math.sin(v) * Math.sin(u) * s.z) / 2);
    parts.push(g);
  }
  const m = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return m;
}

/** olive-like foliage: many small leaves scattered on/inside the GLB leaf ellipsoid; vertex colours vary */
function foliage(s: THREE.Vector3, seed: number) {
  const rnd = mulberry32(seed);
  const count = 420;
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const tmp = new THREE.Vector3();
  const base = [
    [0, 0, 0],
    [0.011, 0.002, 0.035],
    [0, 0.004, 0.085],
    [-0.011, 0.002, 0.035],
  ];
  const c1 = new THREE.Color('#7f9466');
  const c2 = new THREE.Color('#4d6340');
  const c3 = new THREE.Color('#a4ad80');
  for (let i = 0; i < count; i++) {
    // point in ellipsoid shell
    const u = rnd() * Math.PI * 2;
    const v = Math.acos(2 * rnd() - 1);
    const r = 0.55 + 0.45 * Math.cbrt(rnd());
    const p = new THREE.Vector3((Math.sin(v) * Math.cos(u) * s.x * r) / 2, (Math.cos(v) * s.y * r) / 2, (Math.sin(v) * Math.sin(u) * s.z * r) / 2);
    e.set(rnd() * Math.PI * 2, rnd() * Math.PI * 2, rnd() * Math.PI * 2);
    q.setFromEuler(e);
    const sc = 0.8 + rnd() * 0.6;
    const col = c2.clone().lerp(c1, rnd());
    if (rnd() > 0.85) col.lerp(c3, 0.5);
    // slightly brighter towards the top (sky light)
    col.multiplyScalar(0.85 + 0.3 * ((p.y / s.y) + 0.5));
    const n = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    const b = positions.length / 3;
    for (const [x, y, z] of base) {
      tmp.set(x * sc, y * sc, z * sc).applyQuaternion(q).add(p);
      positions.push(tmp.x, tmp.y, tmp.z);
      normals.push(n.x, n.y, n.z);
      colors.push(col.r, col.g, col.b);
    }
    indices.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  return g;
}

/** thin tapered branch between two points (used to connect leaf clusters to the trunk) */
export function branch(from: THREE.Vector3, to: THREE.Vector3, r0: number, r1: number) {
  const dir = to.clone().sub(from);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r1, r0, len, 7, 1);
  g.translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.applyQuaternion(q);
  g.translate(from.x, from.y, from.z);
  return g;
}

/** gathered sheer curtain panel with vertical folds; origin at top-centre */
export function curtainGeometry(width: number, height: number, folds: number, depth: number) {
  const g = new THREE.PlaneGeometry(width, height, Math.max(48, folds * 10), 6);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const t = (x / width + 0.5) * folds * Math.PI * 2;
    // folds open up slightly towards the floor
    const d = depth * (0.85 + 0.15 * (0.5 - y / height));
    pos.setZ(i, Math.sin(t) * d);
  }
  g.translate(0, -height / 2, 0);
  g.computeVertexNormals();
  return g;
}

/**
 * World-space box projection UVs. `offset` is the mesh's world centre so neighbouring parts
 * (sofa pieces, parquet, panels) share one continuous texture field.
 */
export function boxProjectUV(g: THREE.BufferGeometry, tile: number, offset: THREE.Vector3, rot = 0, swapSides = false) {
  if (!g.attributes.normal) g.computeVertexNormals();
  const pos = g.attributes.position as THREE.BufferAttribute;
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + offset.x;
    const y = pos.getY(i) + offset.y;
    const z = pos.getZ(i) + offset.z;
    const ax = Math.abs(nrm.getX(i));
    const ay = Math.abs(nrm.getY(i));
    const az = Math.abs(nrm.getZ(i));
    let u: number;
    let v: number;
    if (ay >= ax && ay >= az) {
      u = x;
      v = -z;
    } else if (ax >= az) {
      u = z;
      v = y;
      if (swapSides) [u, v] = [v, u];
    } else {
      u = x;
      v = y;
      if (swapSides) [u, v] = [v, u];
    }
    const ru = u * c - v * s;
    const rv = u * s + v * c;
    uv[i * 2] = ru / tile;
    uv[i * 2 + 1] = rv / tile;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
