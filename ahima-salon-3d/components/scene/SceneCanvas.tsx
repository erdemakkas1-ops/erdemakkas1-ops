'use client';

import * as THREE from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, N8AO, Bloom, ToneMapping, Vignette, SMAA } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import Room from './Room';
import Lights from './Lights';
import CameraRig from './CameraRig';
import { markReady } from '@/lib/story';

/** flags the overlay once the empty room has actually been drawn (not just downloaded) */
function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) markReady();
  });
  return null;
}

/** compile all programs up front so the first scroll does not stutter when furniture appears */
function Precompile() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);
  return null;
}

export default function SceneCanvas({ active }: { active: boolean }) {
  const [quality] = useState<'high' | 'low'>(() =>
    typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820) ? 'low' : 'high',
  );
  const [dpr, setDpr] = useState(() => (quality === 'high' ? 1.75 : 1.5));

  return (
    <Canvas
      className="scene-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, dpr]}
      shadows={{ type: THREE.PCFSoftShadowMap }}
      flat
      camera={{ position: [0, 2.15, 7.7], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, alpha: false }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor('#231E1A');
        gl.outputColorSpace = THREE.SRGBColorSpace;
        camera.lookAt(0, 1.4, -0.35);
      }}
    >
      <PerformanceMonitor
        bounds={() => (quality === 'high' ? [50, 60] : [28, 40])}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(quality === 'high' ? 2 : 1.5, d + 0.25))}
      />
      <Suspense fallback={null}>
        <Lights quality={quality} />
        <Room />
        <CameraRig />
        <Precompile />
        <ReadySignal />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <N8AO aoRadius={0.6} distanceFalloff={0.6} intensity={quality === 'high' ? 2.6 : 2} quality={quality === 'high' ? 'medium' : 'low'} halfRes={quality !== 'high'} />
          <Bloom mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.15} intensity={0.4} radius={0.65} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.3} darkness={0.42} />
          <SMAA />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
