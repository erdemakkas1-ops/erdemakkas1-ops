'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Sofa } from 'lucide-react';
import { buildFloorTexture, CAMERA, patterns, projectFloor, tones, type PatternId } from '@/lib/floor';
import { whatsappLink } from '@/lib/site';

const thicknesses = ['8 mm', '10 mm', '12 mm', 'Masif / Lamine'];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function FloorDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<{ shell: HTMLImageElement; light: HTMLImageElement; furniture: HTMLImageElement } | null>(null);
  const [ready, setReady] = useState(false);
  const [pattern, setPattern] = useState<PatternId>('balik');
  const [tone, setTone] = useState(tones[0].id);
  const [thickness, setThickness] = useState(thicknesses[0]);
  const [furniture, setFurniture] = useState(true);
  const [area, setArea] = useState(40);

  const p = patterns.find(x => x.id === pattern)!;
  const t = tones.find(x => x.id === tone)!;
  const order = useMemo(() => Math.ceil(area * (1 + p.waste) * 10) / 10, [area, p.waste]);

  useEffect(() => {
    let alive = true;
    Promise.all([loadImage('/images/designer/shell.webp'), loadImage('/images/designer/light.webp'), loadImage('/images/designer/furniture.webp')])
      .then(([shell, light, furn]) => { if (alive) { layersRef.current = { shell, light, furniture: furn }; setReady(true); } })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layers = layersRef.current;
    if (!canvas || !layers) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const tex = buildFloorTexture(pattern, t.hex);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, CAMERA.W, CAMERA.H);
    projectFloor(ctx, tex);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(layers.light, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(layers.shell, 0, 0);
    if (furniture) ctx.drawImage(layers.furniture, 0, 0);
  }, [ready, pattern, t.hex, furniture]);

  const message = `Merhaba, sitenizdeki "Zeminini Tasarla" bölümünden yazıyorum.\nDizilim: ${p.name}\nRenk: ${t.name}\nKalınlık: ${thickness}\nAlan: ${area} m² (fire dahil yaklaşık ${order} m²)\nBu seçim için bilgi ve fiyat teklifi almak istiyorum.`;

  return <div className="designer">
    <div className="designer-stage">
      <canvas ref={canvasRef} width={CAMERA.W} height={CAMERA.H} className={`designer-canvas${ready ? ' ready' : ''}`} role="img" aria-label={`${t.name} renginde ${p.name} dizilimli parke ile salon önizlemesi`} />
      {!ready && <div className="designer-loading">Salon hazırlanıyor…</div>}
      <button type="button" className={`designer-toggle${furniture ? ' on' : ''}`} onClick={() => setFurniture(v => !v)} aria-pressed={furniture}><Sofa size={16} /> {furniture ? 'Mobilyayı kaldır' : 'Mobilyayı göster'}</button>
      <div className="designer-badge"><span>{p.name}</span><span>{t.name}</span></div>
    </div>
    <div className="designer-panel">
      <fieldset>
        <legend>01 · Dizilim</legend>
        <div className="chip-row">{patterns.map(x => <button type="button" key={x.id} className={x.id === pattern ? 'chip on' : 'chip'} aria-pressed={x.id === pattern} onClick={() => setPattern(x.id)}>{x.name}</button>)}</div>
        <p className="designer-note">{p.note}</p>
      </fieldset>
      <fieldset>
        <legend>02 · Renk</legend>
        <div className="swatch-row">{tones.map(x => <button type="button" key={x.id} className={x.id === tone ? 'swatch on' : 'swatch'} style={{ background: x.hex }} aria-pressed={x.id === tone} aria-label={x.name} title={x.name} onClick={() => setTone(x.id)} />)}</div>
        <p className="designer-note"><b>{t.name}</b> — {t.note}</p>
      </fieldset>
      <fieldset>
        <legend>03 · Kalınlık</legend>
        <div className="chip-row">{thicknesses.map(x => <button type="button" key={x} className={x === thickness ? 'chip on' : 'chip'} aria-pressed={x === thickness} onClick={() => setThickness(x)}>{x}</button>)}</div>
      </fieldset>
      <fieldset>
        <legend>04 · Alan</legend>
        <label className="area-input"><input type="number" min={1} max={2000} value={area} onChange={e => setArea(Math.max(1, Math.min(2000, Number(e.target.value) || 1)))} /> <span>m²</span></label>
        <p className="designer-note">Bu dizilim için yaklaşık <b>%{Math.round(p.waste * 100)}</b> kesim payı eklenir → <b>{order} m²</b> malzeme önerilir. Kesin ölçü ücretsiz keşifte alınır.</p>
      </fieldset>
      <a className="designer-cta" href={whatsappLink(message)} target="_blank" rel="noreferrer">Bu seçimle teklif al <ArrowUpRight size={18} /></a>
      <p className="designer-disclaimer">Önizleme temsilidir; gerçek ürün rengi ekran ve ışığa göre değişir. Numuneleri mağazamızda görebilirsiniz.</p>
    </div>
  </div>;
}
