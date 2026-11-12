'use client';

import * as THREE from 'three';
import { useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MODELS } from '@/lib/asset';
import { story, local, smoothstep, ease as EASE } from '@/lib/story';
import { RULES, HIDDEN, EXTRA_ANIMS, type Anim } from './choreography';
import { materialFor, useMaterialLibrary, type MaterialLibrary, type MatKey } from './materials';
import { upgradedGeometry, boxProjectUV, branch, curtainGeometry } from './geometry';

type Member = { name: string; center: THREE.Vector3; size: THREE.Vector3 };

type Actor = {
  key: string;
  anim: Anim;
  group: THREE.Group;
  final: THREE.Vector3;
  box: THREE.Box3;
  meshes: THREE.Mesh[];
  mats: { m: THREE.Material & { opacity: number; transparent: boolean }; base: number; baseTransparent: boolean }[];
  plane?: THREE.Plane;
  emissive?: { m: THREE.MeshStandardMaterial; max: number }[];
  lastTransparent?: boolean;
};

/** read every mesh node of a GLB with its world-space footprint */
function readNodes(scene: THREE.Object3D): Member[] {
  scene.updateMatrixWorld(true);
  const out: Member[] = [];
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld);
    out.push({ name: mesh.name, center: b.getCenter(new THREE.Vector3()), size: b.getSize(new THREE.Vector3()) });
  });
  return out;
}

function buildMesh(m: Member, lib: MaterialLibrary, cloneCache?: Map<MatKey, THREE.Material>) {
  const spec = materialFor(m.name);
  const g = upgradedGeometry(m.name, { center: m.center, size: m.size });
  if (!g.attributes.normal) g.computeVertexNormals();
  boxProjectUV(g, spec.tile, m.center, spec.rot ?? 0, spec.uvAxisSwap);
  let mat: THREE.Material = lib.lib[spec.mat];
  if (cloneCache) {
    if (!cloneCache.has(spec.mat)) cloneCache.set(spec.mat, lib.lib[spec.mat].clone());
    mat = cloneCache.get(spec.mat)!;
  }
  if (m.name.startsWith('detail_plant_leaf')) {
    (mat as THREE.MeshStandardMaterial).vertexColors = true;
    (mat as THREE.MeshStandardMaterial).color.set('#ffffff');
  }
  const mesh = new THREE.Mesh(g, mat);
  mesh.name = m.name;
  mesh.castShadow = !/cove_light|pendant_cable/.test(m.name);
  mesh.receiveShadow = true;
  return { mesh, matKey: spec.mat };
}

function makeActor(key: string, anim: Anim, members: Member[], lib: MaterialLibrary): Actor {
  const box = new THREE.Box3();
  members.forEach((m) => box.union(new THREE.Box3().setFromCenterAndSize(m.center, m.size)));
  const c = box.getCenter(new THREE.Vector3());
  // pivot: bottom centre (unroll: bottom back edge)
  const pivot = new THREE.Vector3(c.x, box.min.y, anim.kind === 'unroll' ? box.min.z : c.z);
  const group = new THREE.Group();
  group.name = `actor:${key}`;
  group.position.copy(pivot);
  const cache = new Map<MatKey, THREE.Material>();
  const meshes: THREE.Mesh[] = [];
  members.forEach((m) => {
    const { mesh } = buildMesh(m, lib, cache);
    mesh.position.copy(m.center).sub(pivot);
    group.add(mesh);
    meshes.push(mesh);
  });
  const mats = [...cache.values()].map((mm) => {
    const m = mm as Actor['mats'][number]['m'];
    return { m, base: m.opacity, baseTransparent: m.transparent };
  });
  const actor: Actor = { key, anim, group, final: pivot.clone(), box, meshes, mats };
  if (anim.kind === 'rise' || anim.kind === 'sweep') {
    actor.plane = anim.kind === 'rise' ? new THREE.Plane(new THREE.Vector3(0, -1, 0), box.min.y) : new THREE.Plane(new THREE.Vector3(0, 0, -1), box.min.z);
    mats.forEach(({ m }) => {
      m.clippingPlanes = [actor.plane!];
      m.clipShadows = true;
    });
  }
  if (anim.kind === 'light') {
    actor.emissive = mats.map(({ m }) => ({ m: m as unknown as THREE.MeshStandardMaterial, max: 4 }));
  }
  return actor;
}

/** apply the pose for progress p — a pure function of p */
function pose(a: Actor, p: number) {
  const { anim } = a;
  const raw = local(p, anim.start, anim.dur);
  const t = EASE[anim.ease ?? 'outQuart'](raw);
  const g = a.group;
  let op = 1;
  const motion = story.reducedMotion ? 0.25 : 1;

  switch (anim.kind) {
    case 'rise':
    case 'sweep': {
      g.visible = raw > 0;
      const span = anim.kind === 'rise' ? a.box.max.y - a.box.min.y : a.box.max.z - a.box.min.z;
      const min = anim.kind === 'rise' ? a.box.min.y : a.box.min.z;
      a.plane!.constant = raw >= 1 ? 1e4 : min + t * span + 1e-4;
      return;
    }
    case 'place':
    case 'drop':
    case 'lower': {
      const o = anim.offset ?? [0, 0.15, 0.45];
      const k = (1 - t) * motion;
      g.position.set(a.final.x + o[0] * k, a.final.y + o[1] * k, a.final.z + o[2] * k);
      op = smoothstep(0, anim.kind === 'lower' ? 0.25 : 0.55, raw);
      break;
    }
    case 'unroll':
      g.scale.set(1, 1, Math.max(t, 1e-3));
      op = smoothstep(0, 0.15, raw);
      break;
    case 'draw':
      g.scale.set(0.12 + 0.88 * t, 1, 1);
      op = smoothstep(0, 0.4, raw);
      break;
    case 'fade':
      op = t;
      break;
    case 'light':
      op = smoothstep(0, 0.15, raw);
      a.emissive?.forEach(({ m, max }) => (m.emissiveIntensity = t * max));
      break;
  }
  g.visible = op > 0.002;
  const transparent = op < 0.999;
  for (const { m, base, baseTransparent } of a.mats) {
    m.opacity = base * op;
    const want = baseTransparent || transparent;
    if (m.transparent !== want) {
      m.transparent = want;
      m.needsUpdate = true;
    }
  }
  if (a.lastTransparent !== transparent) {
    a.lastTransparent = transparent;
    a.meshes.forEach((mesh) => (mesh.castShadow = !transparent && !/cove_light|pendant_cable|curtain|downlight/.test(mesh.name)));
  }
}

export default function Room() {
  const gl = useThree((s) => s.gl);
  const lib = useMaterialLibrary();
  const shell = useGLTF(MODELS.shell);
  const surfaces = useGLTF(MODELS.surfaces);
  const furniture = useGLTF(MODELS.furniture);
  const details = useGLTF(MODELS.details);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const built = useMemo(() => {
    const root = new THREE.Group();
    root.name = 'ahima-room';

    // ----------------------------------------------------- 00 shell: always visible
    const shellGroup = new THREE.Group();
    shellGroup.name = 'stage:00_shell';
    readNodes(shell.scene).forEach((m) => {
      // The camera stands ~4.5 m in front of the room's open front. Floor, ceiling and side walls are
      // continued towards (and behind) the camera so the frame never shows the void around the shell.
      // The part of the room inside the GLB footprint is unchanged.
      if (/^shell_(raw_concrete_floor|ceiling|left_wall|right_wall)$/.test(m.name)) {
        const zMin = m.center.z - m.size.z / 2;
        const zMax = 8.8;
        m.size.z = zMax - zMin;
        m.center.z = (zMin + zMax) / 2;
      }
      const { mesh } = buildMesh(m, lib);
      mesh.position.copy(m.center);
      shellGroup.add(mesh);
    });
    // glazing (addition): the GLB has an open frame
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(5.36, 2.7), lib.lib.glass);
    glass.position.set(0, 1.535, -3.083);
    glass.name = 'extra:glass';
    shellGroup.add(glass);
    // garden backdrop seen through the window — far away, unlit
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), lib.backdrop);
    backdrop.position.set(0, 0.5, -14);
    backdrop.name = 'extra:garden-backdrop';
    shellGroup.add(backdrop);
    root.add(shellGroup);

    // ----------------------------------------------------- animated stages
    const actors: Actor[] = [];
    const stageGroups: THREE.Group[] = [];
    for (const [label, gltf] of [
      ['01_surfaces', surfaces],
      ['02_furniture', furniture],
      ['03_details', details],
    ] as const) {
      const sg = new THREE.Group();
      sg.name = `stage:${label}`;
      const byRule = new Map<number, Map<string, Member[]>>();
      for (const m of readNodes(gltf.scene)) {
        if (HIDDEN.test(m.name)) continue;
        const ri = RULES.findIndex((r) => r.test.test(m.name));
        if (ri < 0) {
          console.warn('[ahima] no choreography rule for node', m.name);
          continue;
        }
        const key = RULES[ri].key(m.name);
        if (!byRule.has(ri)) byRule.set(ri, new Map());
        const map = byRule.get(ri)!;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(m);
      }
      for (const [ri, map] of byRule) {
        const rule = RULES[ri];
        const entries = [...map.entries()].map(([key, members]) => {
          const c = members.reduce((acc, m) => acc.add(m.center), new THREE.Vector3()).divideScalar(members.length);
          return { key, members, ord: rule.order ? rule.order(members[0].name, c) : 0 };
        });
        entries.sort((a, b) => a.ord - b.ord || a.key.localeCompare(b.key, 'en', { numeric: true }));
        entries.forEach((e, i) => {
          const actor = makeActor(e.key, rule.anim(i, entries.length), e.members, lib);
          actors.push(actor);
          sg.add(actor.group);
        });
      }
      stageGroups.push(sg);
      root.add(sg);
    }

    // ----------------------------------------------------- additions (not in the GLBs)
    const parquet = actors.find((a) => a.key === 'surface_oak_parquet');
    if (parquet) {
      const src = parquet.meshes[0];
      const c = new THREE.Vector3(0, 0.0115, 4.92);
      const g = boxProjectUV(new THREE.BoxGeometry(8.32, 0.045, 3.6), 1.2, c, Math.PI / 4);
      const m = new THREE.Mesh(g, src.material);
      m.position.copy(c).sub(parquet.final);
      m.receiveShadow = true;
      m.name = 'extra:parquet-extension';
      parquet.group.add(m);
      parquet.meshes.push(m);
      parquet.box.max.z = 3.9; // sweep through the visible part; the rest is off-frame
    }
    const detailsGroup = stageGroups[2];
    // olive branches connecting the trunk to each leaf cluster
    const plant = actors.find((a) => a.key === 'plant');
    if (plant) {
      const stem = plant.meshes.find((m) => m.name === 'detail_plant_stem')!;
      const top = stem.position.clone().add(plant.final).add(new THREE.Vector3(0, 0.3, 0));
      const barkMat = stem.material as THREE.MeshStandardMaterial;
      plant.meshes
        .filter((m) => m.name.startsWith('detail_plant_leaf'))
        .forEach((leafMesh) => {
          const to = leafMesh.position.clone().add(plant.final);
          const b = new THREE.Mesh(branch(top.clone().sub(plant.final), to.clone().sub(plant.final).multiplyScalar(1), 0.016, 0.006), barkMat);
          b.castShadow = true;
          b.name = 'extra:branch';
          plant.group.add(b);
          plant.meshes.push(b);
        });
    }

    // sheer curtains at both sides of the window
    const curtainMat = lib.lib.curtain.clone();
    const curtains: Actor[] = [-1, 1].map((side) => {
      const w = 0.95;
      const h = 2.97;
      const g = curtainGeometry(w, h, 9, 0.045);
      g.translate((side < 0 ? 1 : -1) * (w / 2), 0, 0);
      boxProjectUV(g, 0.5, new THREE.Vector3(), 0);
      const mesh = new THREE.Mesh(g, curtainMat);
      mesh.name = 'extra:curtain';
      mesh.receiveShadow = true;
      const group = new THREE.Group();
      const final = new THREE.Vector3(side * 2.78, 2.995, -2.93);
      group.position.copy(final);
      group.add(mesh);
      detailsGroup.add(group);
      const box = new THREE.Box3().setFromObject(group);
      return {
        key: `curtain_${side}`,
        anim: EXTRA_ANIMS.curtains,
        group,
        final,
        box,
        meshes: [mesh],
        mats: [{ m: curtainMat, base: curtainMat.opacity, baseTransparent: true }],
      };
    });
    actors.push(...curtains);

    // recessed downlights in the new ceiling
    const dlMat = lib.lib.downlight.clone();
    const dlGroup = new THREE.Group();
    const dlGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.008, 32);
    for (const x of [-2.9, 2.9]) {
      for (const z of [-2.0, -0.2, 1.6]) {
        const d = new THREE.Mesh(dlGeo, dlMat);
        d.position.set(x, -0.004, z);
        d.name = 'extra:downlight';
        dlGroup.add(d);
      }
    }
    dlGroup.position.set(0, 3.011, 0);
    detailsGroup.add(dlGroup);
    actors.push({
      key: 'downlights',
      anim: EXTRA_ANIMS.downlights,
      group: dlGroup,
      final: dlGroup.position.clone(),
      box: new THREE.Box3(),
      meshes: dlGroup.children as THREE.Mesh[],
      mats: [{ m: dlMat, base: 1, baseTransparent: false }],
      emissive: [{ m: dlMat, max: 6 }],
    });

    return { root, actors };
  }, [shell, surfaces, furniture, details, lib]);

  // initial pose before first frame (empty room)
  useMemo(() => built.actors.forEach((a) => pose(a, story.p)), [built]);

  useFrame(() => {
    const p = story.p;
    for (const a of built.actors) pose(a, p);
  });

  return <primitive object={built.root} />;
}

useGLTF.preload(MODELS.shell);
useGLTF.preload(MODELS.surfaces);
useGLTF.preload(MODELS.furniture);
useGLTF.preload(MODELS.details);
