'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { onReady, story } from '@/lib/story';

/** plain espresso screen until the *empty* room is on screen (never a poster of the finished room) */
export default function Loader() {
  const { progress } = useProgress();
  const [ready, setReady] = useState(story.ready);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const off = onReady(() => setReady(true));
    return () => {
      off();
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [ready]);

  if (gone) return null;
  return (
    <div className={`loader ${ready ? 'loader--done' : ''}`} aria-live="polite">
      <div className="loader__mark">
        AHIMA<span>DEKORASYON</span>
      </div>
      <div className="loader__bar">
        <i style={{ transform: `scaleX(${Math.max(0.04, progress / 100)})` }} />
      </div>
      <p className="loader__label">Mekân hazırlanıyor · {Math.round(progress)}%</p>
    </div>
  );
}
