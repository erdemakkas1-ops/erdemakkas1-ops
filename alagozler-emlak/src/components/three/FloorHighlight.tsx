"use client";

import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";
import type { BuildingFloor } from "@/lib/buildingLayout";
import { HIGHLIGHT_HEIGHT_RATIO, HIGHLIGHT_PADDING } from "@/lib/buildingConfig";

// Decorative meshes must never intercept a hitbox's pointer events.
const ignoreRaycast = () => {};

export default function FloorHighlight({ floor, label = null, active = true }: {
  active?: boolean;
  floor: BuildingFloor;
  /** Hover tooltip; null hides it. */
  label?: { title: string; detail: string } | null;
}) {
  const [width, height, depth] = floor.size;
  const material = useRef<MeshStandardMaterial>(null);
  const mesh = useRef<Mesh>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    const surface = material.current;
    const object = mesh.current;
    if (!surface || !object) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = active ? 0.26 : 0;
    const start = surface.opacity;
    const started = performance.now();
    let frame = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      surface.opacity = target;
      object.visible = active;
      invalidate();
    };
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 190, 1);
      surface.opacity = start + (target - start) * (1 - Math.pow(1 - progress, 3));
      object.visible = surface.opacity > 0;
      invalidate();
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    if (preference.matches || start === target) finish();
    else frame = requestAnimationFrame(tick);
    const reduce = () => { if (preference.matches) finish(); };
    preference.addEventListener("change", reduce);
    return () => { cancelAnimationFrame(frame); preference.removeEventListener("change", reduce); };
  }, [active, invalidate]);

  return (
    <group position={floor.center}>
      <mesh ref={mesh} raycast={ignoreRaycast} renderOrder={1}>
        <boxGeometry args={[width * HIGHLIGHT_PADDING, height * HIGHLIGHT_HEIGHT_RATIO, depth * HIGHLIGHT_PADDING]} />
        <meshStandardMaterial
          ref={material}
          color="#d99a38"
          emissive="#b97718"
          emissiveIntensity={0.3}
          transparent
          opacity={0}
          depthWrite={false}
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      {label && (
        <Html
          position={[-width * 0.28, 0.1, depth * 0.56]}
          center
          zIndexRange={[20, 0]}
          wrapperClass="pointer-events-none"
          pointerEvents="none"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className="motion-label whitespace-nowrap rounded-lg border border-white/10 bg-[#0b1220]/92 px-3.5 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <p className="font-display text-sm font-semibold text-[#f1ebdf]">{label.title}</p>
            <p className="mt-0.5 text-xs text-[#9fb0c4]">{label.detail}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
