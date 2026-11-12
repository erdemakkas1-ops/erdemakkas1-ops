'use client';

import { useEffect, useState } from 'react';
import { onReady, story } from '@/lib/story';

/** plain espresso screen until the first film frame (the *empty* room) is on screen */
export default function Loader() {
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (story.ready) setReady(true);
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
        <i />
      </div>
      <p className="loader__label">Mekân hazırlanıyor</p>
    </div>
  );
}
