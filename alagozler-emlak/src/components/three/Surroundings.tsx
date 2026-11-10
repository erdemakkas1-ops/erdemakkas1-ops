"use client";

import { memo, useEffect, useMemo } from "react";
import { BoxGeometry, CylinderGeometry, IcosahedronGeometry, type BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PAVEMENT_EDGE, PODIUM_FRONT, STREET_FAR_EDGE } from "@/lib/buildingConfig";

type Box = [x: number, y: number, z: number, w: number, h: number, d: number];

// Box/cylinder geometries are indexed, icosahedra are not; merge them as non-indexed triangles.
function merge(parts: BufferGeometry[]): BufferGeometry {
  const flat = parts.map(part => (part.index ? part.toNonIndexed() : part));
  const merged = mergeGeometries(flat);
  new Set([...parts, ...flat]).forEach(part => part.dispose());
  return merged;
}
const box = ([x, y, z, w, h, d]: Box) => new BoxGeometry(w, h, d).translate(x, y, z);

const HEDGE_Z = PODIUM_FRONT + 1.7;
const TREE_Z = PAVEMENT_EDGE - 1.1;
const ROAD_TOP = -0.08;
const LANE_Z = (PAVEMENT_EDGE + STREET_FAR_EDGE) / 2;

function createStreet() {
  const paving: BufferGeometry[] = [];
  const asphalt: BufferGeometry[] = [];
  const marking: BufferGeometry[] = [];
  const hedge: BufferGeometry[] = [];
  const foliage: BufferGeometry[] = [];
  const trunk: BufferGeometry[] = [];
  const glow: BufferGeometry[] = [];
  const metal: BufferGeometry[] = [];

  // Pavement around the building, a lighter path to the entrance, the kerb and the street.
  paving.push(box([0, -0.15, -4, 64, 0.3, 26.8]));
  paving.push(box([0, 0.006, (PODIUM_FRONT + PAVEMENT_EDGE) / 2 + 0.6, 3.6, 0.012, PAVEMENT_EDGE - PODIUM_FRONT - 1.2]));
  metal.push(box([0, -0.04, PAVEMENT_EDGE, 64, 0.16, 0.22]));
  asphalt.push(box([0, ROAD_TOP - 0.1, (PAVEMENT_EDGE + STREET_FAR_EDGE) / 2 + 2, 140, 0.2, STREET_FAR_EDGE - PAVEMENT_EDGE + 4]));
  for (let x = -40; x <= 40; x += 3.2) marking.push(box([x, ROAD_TOP + 0.005, LANE_Z, 1.6, 0.01, 0.1]));

  // Hedges in front of the podium, open at the entrance path.
  for (const side of [-1, 1]) hedge.push(box([side * 7, 0.28, HEDGE_Z, 9.6, 0.56, 0.7]));

  // Street trees with warm uplights, palms flanking the entrance, a darker tree line behind.
  const trees: Array<[number, number, number]> = [[-11.5, TREE_Z, 1], [-7.4, TREE_Z, 1.1], [-3.6, TREE_Z, 0.9], [3.6, TREE_Z, 0.9], [7.4, TREE_Z, 1.1], [11.5, TREE_Z, 1], [-15, 3, 1.3], [15, 3, 1.3], [-15.5, -3, 1.2], [15.5, -3.5, 1.2]];
  for (const [x, z, s] of trees) {
    trunk.push(new CylinderGeometry(0.06 * s, 0.09 * s, 1.5 * s, 6).translate(x, 0.75 * s, z));
    foliage.push(new IcosahedronGeometry(0.85 * s, 1).scale(1, 1.1, 1).translate(x, 1.9 * s, z));
    glow.push(new CylinderGeometry(0.12, 0.12, 0.04, 10).translate(x + 0.3, 0.02, z));
  }
  for (const x of [-2.4, 2.4]) {
    trunk.push(new CylinderGeometry(0.07, 0.1, 2.6, 6).translate(x, 1.3, PODIUM_FRONT + 1.4));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      foliage.push(new BoxGeometry(1.1, 0.04, 0.22).translate(0.5, 0, 0).rotateZ(-0.35).rotateY(a).translate(x, 2.6, PODIUM_FRONT + 1.4));
    }
  }
  for (let x = -30; x <= 30; x += 3.5) if (Math.abs(x) > 13) foliage.push(new IcosahedronGeometry(1.4, 1).translate(x, 1.6, -9 - (Math.abs(x) % 3)));

  // Street lamps along the kerb.
  for (const x of [-13.5, -5.5, 5.5, 13.5]) {
    metal.push(new CylinderGeometry(0.05, 0.06, 3.2, 6).translate(x, 1.6, PAVEMENT_EDGE - 0.35));
    metal.push(box([x, 3.2, PAVEMENT_EDGE - 0.1, 0.12, 0.06, 0.6]));
    glow.push(box([x, 3.16, PAVEMENT_EDGE + 0.12, 0.16, 0.03, 0.22]));
  }

  return {
    paving: merge(paving), asphalt: merge(asphalt), marking: merge(marking), hedge: merge(hedge),
    foliage: merge(foliage), trunk: merge(trunk), glow: merge(glow), metal: merge(metal),
  };
}

/** A low-poly saloon; `dir` is +1 driving towards +x, -1 the other way. */
function createCar(dir: 1 | -1) {
  const body = merge([box([0, 0.36, 0, 2.2, 0.34, 0.96]), box([0, 0.2, 0, 2.1, 0.12, 0.9])]);
  const cabin = merge([box([-0.12 * dir, 0.66, 0, 1.15, 0.3, 0.84])]);
  const wheels = merge([-0.68, 0.68].flatMap(x => [-0.45, 0.45].map(z => new CylinderGeometry(0.17, 0.17, 0.14, 12).rotateX(Math.PI / 2).translate(x, 0.17, z))));
  const head = merge([-0.32, 0.32].map(z => box([1.1 * dir, 0.4, z, 0.03, 0.08, 0.2])));
  const tail = merge([-0.34, 0.34].map(z => box([-1.1 * dir, 0.42, z, 0.03, 0.07, 0.22])));
  return { body, cabin, wheels, head, tail };
}

const Car = memo(function Car({ x, z, dir, color }: { x: number; z: number; dir: 1 | -1; color: string }) {
  const car = useMemo(() => createCar(dir), [dir]);
  useEffect(() => () => Object.values(car).forEach(part => part.dispose()), [car]);
  return <group position={[x, ROAD_TOP, z]}>
    <mesh geometry={car.body}><meshStandardMaterial color={color} roughness={0.25} metalness={0.7} /></mesh>
    <mesh geometry={car.cabin}><meshStandardMaterial color="#0e1117" roughness={0.1} metalness={0.6} /></mesh>
    <mesh geometry={car.wheels}><meshStandardMaterial color="#0b0b0c" roughness={0.8} /></mesh>
    <mesh geometry={car.head}><meshBasicMaterial color="#fff4dc" toneMapped={false} /></mesh>
    <mesh geometry={car.tail}><meshBasicMaterial color="#ff3a2a" toneMapped={false} /></mesh>
  </group>;
});

export const Street = memo(function Street() {
  const street = useMemo(createStreet, []);
  useEffect(() => () => Object.values(street).forEach(part => part.dispose()), [street]);
  return <group>
    <mesh geometry={street.paving}><meshStandardMaterial color="#25262b" roughness={0.9} /></mesh>
    <mesh geometry={street.asphalt}><meshStandardMaterial color="#111216" roughness={0.6} metalness={0.1} /></mesh>
    <mesh geometry={street.marking}><meshBasicMaterial color="#a9a9a6" /></mesh>
    <mesh geometry={street.hedge}><meshStandardMaterial color="#223b22" roughness={0.95} emissive="#0f1c0d" emissiveIntensity={0.6} /></mesh>
    <mesh geometry={street.foliage}><meshStandardMaterial color="#26432a" roughness={0.9} flatShading emissive="#1a2a10" emissiveIntensity={0.5} /></mesh>
    <mesh geometry={street.trunk}><meshStandardMaterial color="#3a2a1d" roughness={1} /></mesh>
    <mesh geometry={street.metal}><meshStandardMaterial color="#2b2d31" roughness={0.5} metalness={0.5} /></mesh>
    <mesh geometry={street.glow}><meshBasicMaterial color="#ffd49a" toneMapped={false} /></mesh>
    <Car x={-6.5} z={LANE_Z - 1.4} dir={1} color="#5a5e66" />
    <Car x={7} z={LANE_Z + 1.4} dir={-1} color="#8a8f97" />
  </group>;
});
