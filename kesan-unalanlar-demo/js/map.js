import { ILCELER, MERKEZ } from './data.js';

const NS = 'http://www.w3.org/2000/svg';
// Basit eşdikdörtgen projeksiyon (≈41°K için en/boy düzeltmeli)
const px = (lon) => (lon - 25.9) * 400;
const py = (lat) => (41.85 - lat) * 530;
const pts = (list) => list.map(([lo, la]) => `${px(lo).toFixed(1)} ${py(la).toFixed(1)}`).join(' L');
const KM = 400 / 84; // birim / km

const EGE = [[25.8, 40.76], [26.05, 40.72], [26.25, 40.63], [26.5, 40.6], [26.75, 40.63], [26.6, 40.52], [26.45, 40.43], [26.3, 40.33], [26.15, 40.22], [25.8, 40.2]];
const MARMARA = [[26.67, 40.36], [26.8, 40.47], [26.95, 40.55], [27.11, 40.6], [27.3, 40.69], [27.45, 40.85], [27.52, 40.97], [27.9, 40.99], [27.9, 40.2], [26.55, 40.2]];
const MERIC = [[26.55, 41.85], [26.56, 41.68], [26.6, 41.5], [26.45, 41.3], [26.36, 41.05], [26.33, 40.92], [26.2, 40.8], [26.05, 40.73]];
const ERGENE = [[27.4, 41.35], [27.05, 41.25], [26.75, 41.28], [26.55, 41.2], [26.38, 41.12]];

function el(name, attrs = {}, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}

export function createMap(svgWrap, list, readout) {
  const svg = el('svg', { viewBox: '20 40 700 760', role: 'group', 'aria-label': 'Şematik hizmet bölgesi haritası', class: 'map-svg' });
  svgWrap.appendChild(svg);
  el('title', {}, svg).textContent = 'Keşan merkezli Trakya hizmet bölgesi';
  el('desc', {}, svg).textContent = 'Gerçek ölçekli olmayan şematik harita. Mesafeler yaklaşık karayolu mesafesidir.';

  const base = el('g', { 'pointer-events': 'none' }, svg);
  el('path', { d: `M${pts(EGE)}Z`, class: 'm-sea' }, base);
  el('path', { d: `M${pts(MARMARA)}Z`, class: 'm-sea' }, base);
  el('path', { d: `M${pts(EGE.slice(0, 9))}`, class: 'm-coast' }, base);
  el('path', { d: `M${pts(MARMARA.slice(0, 8))}`, class: 'm-coast' }, base);
  el('path', { d: `M${pts(MERIC)}`, class: 'm-river' }, base);
  el('path', { d: `M${pts(ERGENE)}`, class: 'm-river thin' }, base);

  const t = (x, y, s, c) => (el('text', { x, y, class: c, 'text-anchor': 'middle' }, base).textContent = s);
  t(px(26.25), py(40.45), 'SAROS KÖRFEZİ', 'm-water');
  t(px(27.35), py(40.45), 'MARMARA DENİZİ', 'm-water');
  t(px(26.05), py(41.35), 'YUNANİSTAN', 'm-region');

  const cx = px(MERKEZ.lon);
  const cy = py(MERKEZ.lat);
  for (const r of [50, 100]) {
    el('circle', { cx, cy, r: r * KM, class: 'm-ring' }, base);
    t(cx, cy - r * KM - 8, `${r} km`, 'm-ring-label');
  }

  const routes = el('g', { 'pointer-events': 'none' }, svg);
  const markers = el('g', {}, svg);
  const items = new Map();

  for (const ilce of ILCELER) {
    const x = px(ilce.lon);
    const y = py(ilce.lat);
    const route = el('path', { d: `M${cx} ${cy}Q${(cx + x) / 2 + (y - cy) * 0.12} ${(cy + y) / 2 - (x - cx) * 0.12} ${x} ${y}`, class: 'm-route' }, routes);
    const g = el('g', { role: 'button', tabindex: 0, 'aria-label': `${ilce.ad}, Keşan'a yaklaşık ${ilce.km} kilometre`, class: 'm-poi' }, markers);
    el('circle', { cx: x, cy: y, r: 22, fill: 'transparent' }, g);
    el('circle', { cx: x, cy: y, r: 7, class: 'm-dot' }, g);
    const lbl = el('text', { x, y: y + 24, 'text-anchor': 'middle', class: 'm-label' }, g);
    lbl.textContent = ilce.ad.toLocaleUpperCase('tr-TR');
    items.set(ilce.key, { g, route, ilce });
    for (const ev of ['pointerenter', 'focus', 'click']) g.addEventListener(ev, () => sec(ilce.key));
  }

  // Merkez
  const m = el('g', { 'pointer-events': 'none' }, svg);
  el('circle', { cx, cy, r: 26, class: 'm-center-halo' }, m);
  el('circle', { cx, cy, r: 12, class: 'm-center' }, m);
  el('path', { d: `M${cx - 6} ${cy + 4}V${cy - 1}L${cx} ${cy - 6}L${cx + 6} ${cy - 1}V${cy + 4}Z`, fill: '#1a1408' }, m);
  el('rect', { x: cx - 44, y: cy + 30, width: 88, height: 26, rx: 4, class: 'm-center-tag' }, m);
  el('text', { x: cx, y: cy + 48, 'text-anchor': 'middle', class: 'm-center-label' }, m).textContent = MERKEZ.ad;

  for (const ilce of ILCELER) {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" data-key="${ilce.key}"><span>${ilce.ad}</span><span class="km">~${ilce.km} <small>km</small></span></button>`;
    const b = li.firstChild;
    for (const ev of ['pointerenter', 'focus', 'click']) b.addEventListener(ev, () => sec(ilce.key));
    list.appendChild(li);
  }

  function sec(key) {
    for (const [k, it] of items) {
      const on = k === key;
      it.g.dataset.on = on;
      it.route.dataset.on = on;
    }
    list.querySelectorAll('button').forEach((b) => (b.dataset.on = b.dataset.key === key));
    const it = items.get(key);
    readout.textContent = it ? `Keşan → ${it.ilce.ad} · yaklaşık ${it.ilce.km} km` : '';
  }
  sec('uzunkopru');
}
