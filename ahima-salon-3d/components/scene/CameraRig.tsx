'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { story, lerp, clamp01, ease } from '@/lib/story';

/**
 * Camera path from docs/SAHNE_VE_ANIMASYON.md. Small, slow moves only — the room stays framed.
 *   0.00 [0,2.15,7.7] -> 0.20 [0,2.10,7.35] -> 0.65 [0.22,2.05,6.9] -> 1.00 [-0.12,1.98,7.22]
 * Phones (portrait) get a wider lens, a slightly pulled-back camera and a gentle pan that keeps the element
 * being built in frame (left wall -> TV wall -> sofa -> centre).
 */
type Key = [number, number, number, number]; // p, x, y, z
const PATH: Key[] = [
  [0, 0, 2.15, 7.7],
  [0.2, 0, 2.1, 7.35],
  [0.65, 0.22, 2.05, 6.9],
  [1, -0.12, 1.98, 7.22],
];
const TARGET: Key[] = [
  [0, 0, 1.4, -0.35],
  [0.2, 0, 1.36, -0.35],
  [0.65, 0.1, 1.3, -0.35],
  [1, -0.05, 1.32, -0.35],
];
/** portrait focus (x of look target) through the story */
const PORTRAIT_FOCUS: [number, number][] = [
  [0, 0],
  [0.12, 0],
  [0.2, -1.6],
  [0.3, 1.8],
  [0.4, 2.1],
  [0.5, -1.4],
  [0.66, -0.6],
  [0.8, -0.8],
  [0.94, 0],
  [1, 0],
];

function sampleKeys(keys: Key[], p: number, out: THREE.Vector3) {
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p <= b[0] || i === keys.length - 2) {
      const t = ease.inOutSine(clamp01((p - a[0]) / (b[0] - a[0])));
      return out.set(lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t));
    }
  }
  return out;
}
function sample1(keys: [number, number][], p: number) {
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p <= b[0] || i === keys.length - 2) return lerp(a[1], b[1], ease.inOutSine(clamp01((p - a[0]) / (b[0] - a[0]))));
  }
  return 0;
}

export default function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const pointer = useMemo(() => ({ x: 0, y: 0, sx: 0, sy: 0 }), []);
  const v = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3() }), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  useFrame((state, dt) => {
    const p = story.p;
    const aspect = size.width / size.height;
    const portrait = aspect < 0.9;
    sampleKeys(PATH, p, v.pos);
    sampleKeys(TARGET, p, v.tgt);

    let fov = 45;
    if (aspect < 1.25) fov = lerp(62, 48, clamp01((aspect - 0.45) / 0.8));
    if (portrait) {
      // lower and further back: less ceiling, more floor and furniture in the narrow frame
      v.pos.z += 0.8;
      v.pos.y -= 0.3;
      v.tgt.x = sample1(PORTRAIT_FOCUS, p);
      v.tgt.y -= 0.3;
    }

    if (!story.reducedMotion) {
      // very slow idle drift (±few cm) + mouse parallax on desktop
      const t = state.clock.elapsedTime;
      const k = 1 - Math.exp(-dt * 2.5);
      pointer.sx += (pointer.x - pointer.sx) * k;
      pointer.sy += (pointer.y - pointer.sy) * k;
      v.pos.x += Math.sin(t * 0.13) * 0.05 + pointer.sx * 0.18;
      v.pos.y += Math.sin(t * 0.17) * 0.025 - pointer.sy * 0.08;
    }

    camera.position.copy(v.pos);
    camera.lookAt(v.tgt);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
