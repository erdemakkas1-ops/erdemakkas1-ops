'use client';

import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { story, local, ease } from '@/lib/story';
import { LIGHTS_ON } from './choreography';

RectAreaLightUniformsLib.init();

/**
 * Daylight interior:
 *  - low warm sun through the window (shadow-casting, draws the mullions on the floor)
 *  - a large area light in the window opening for soft sky fill
 *  - an image-based environment built from light formers (no external HDR download)
 * When the details stage finishes, warm 2700K cove LEDs, downlights and the brass pendant come on.
 */
export default function Lights({ quality }: { quality: 'high' | 'low' }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const cove = useRef<THREE.RectAreaLight[]>([]);
  const pendant = useRef<THREE.PointLight>(null);
  const warm = useMemo(() => new THREE.Color('#FFC890'), []);

  useEffect(() => {
    const s = sun.current;
    if (!s) return;
    s.target.position.set(0.6, 0, 0.4);
    s.target.updateMatrixWorld();
  }, []);

  useFrame(() => {
    const k = ease.inOutSine(local(story.p, LIGHTS_ON.start, LIGHTS_ON.dur));
    cove.current.forEach((l) => l && (l.intensity = 9 * k));
    if (pendant.current) pendant.current.intensity = 2.2 * k;
  });

  const size = quality === 'high' ? 2048 : 1024;
  // cove strips (x, z, width, depth) mirrored from the GLB detail_cove_light_* nodes
  const coves: [number, number, number, number, number][] = [
    [0, -2.75, 7.6, 0.25, 0],
    [0, 2.7, 7.6, 0.25, 0],
    [-3.82, 0, 0.25, 5.4, 0],
    [3.82, 0, 0.25, 5.4, 0],
  ];

  return (
    <>
      <Environment resolution={256} frames={1} environmentIntensity={0.7}>
        {/* sky through the window */}
        <Lightformer form="rect" intensity={2.4} color="#f3f1ea" position={[0, 1.6, -6]} scale={[8, 3, 1]} />
        {/* bounce from the warm floor and walls */}
        <Lightformer form="rect" intensity={0.6} color="#e9d6bf" position={[0, -2, 0]} rotation-x={-Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={0.45} color="#f1ebe2" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={0.3} color="#f6efe6" position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={0.3} color="#f6efe6" position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>

      <hemisphereLight args={['#f2efe8', '#b59a7c', 0.5]} />

      <directionalLight
        ref={sun}
        position={[-4.8, 6.2, -12]}
        intensity={7.5}
        color="#ffdcae"
        castShadow
        shadow-mapSize={[size, size]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={2}
        shadow-camera-far={40}
      />

      {/* soft daylight from the window opening */}
      <rectAreaLight args={['#eef1f2', 6, 5.3, 2.6]} position={[0, 1.55, -3.0]} rotation={[0, Math.PI, 0]} />

      {/* warm cove LEDs (pointing down along the walls) */}
      {coves.map(([x, z, w, d], i) => (
        <rectAreaLight
          key={i}
          ref={(el) => {
            if (el) cove.current[i] = el;
          }}
          args={[warm, 0, w, d]}
          position={[x, 2.99, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}

      <pointLight ref={pendant} position={[0.12, 2.45, 0.05]} color="#ffcf98" intensity={0} distance={7} decay={2} />
    </>
  );
}
