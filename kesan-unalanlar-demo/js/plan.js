import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { ODA_RENK, odaAlani } from './data.js';

const S = 50; // 1 m = 50 birim
const NS = 'http://www.w3.org/2000/svg';
const VURGU = '#f0b85a';
const fmt = (n) => (Math.round(n * 10) / 10).toLocaleString('tr-TR');

function el(name, attrs = {}, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}

function buyukRect(oda) {
  return oda.r.reduce((a, b) => (b[2] * b[3] > a[2] * a[3] ? b : a));
}

export function createPlan({ svgWrap, threeWrap, list, summary, readout }) {
  let model = null;
  let active = null;
  let view = '2d';
  let three = null;

  const svg = el('svg', { role: 'group', 'aria-label': 'İnteraktif 2D kat planı', class: 'plan-svg' });
  svgWrap.appendChild(svg);

  function highlight(key) {
    active = key;
    svg.querySelectorAll('[data-room]').forEach((g) => {
      const on = g.dataset.room === key;
      g.dataset.on = on;
      g.querySelectorAll('rect').forEach((r) => r.setAttribute('fill', on ? VURGU : r.dataset.fill));
    });
    list.querySelectorAll('[data-room]').forEach((b) => (b.dataset.on = b.dataset.room === key));
    three?.highlight(key);
    const oda = model.odalar.find((o) => o.key === key);
    readout.textContent = oda ? `${oda.ad} · ${fmt(odaAlani(oda))} m²` : 'Bir odanın üzerine gelin';
  }

  function drawSvg() {
    svg.replaceChildren();
    const maxY = Math.max(model.d, ...model.odalar.flatMap((o) => o.r.map(([, y, , h]) => y + h)));
    const pad = 70;
    svg.setAttribute('viewBox', `${-pad} ${-pad} ${model.w * S + pad * 2} ${maxY * S + pad * 2}`);
    el('title', {}, svg).textContent = `${model.ad} ${model.tip} kat planı — odaları seçerek inceleyin`;

    // Ölçü çizgileri
    const dim = el('g', { class: 'plan-dim', 'aria-hidden': 'true' }, svg);
    el('path', { d: `M0 -34H${model.w * S} M0 -42V-26 M${model.w * S} -42V-26` }, dim);
    el('text', { x: (model.w * S) / 2, y: -44, 'text-anchor': 'middle' }, dim).textContent = `${fmt(model.w)} m`;
    el('path', { d: `M-34 0V${model.d * S} M-42 0H-26 M-42 ${model.d * S}H-26` }, dim);
    const t = el('text', { x: -44, y: (model.d * S) / 2, 'text-anchor': 'middle', transform: `rotate(-90 -44 ${(model.d * S) / 2})` }, dim);
    t.textContent = `${fmt(model.d)} m`;

    for (const oda of model.odalar) {
      const g = el('g', {
        role: 'button',
        tabindex: 0,
        'aria-label': `${oda.ad}, ${fmt(odaAlani(oda))} metrekare`,
        'data-room': oda.key,
        class: 'plan-room',
      }, svg);
      for (const [x, y, w, h] of oda.r) {
        const fill = ODA_RENK[oda.tur];
        const r = el('rect', { x: x * S, y: y * S, width: w * S, height: h * S, fill, stroke: '#f5efe4', 'stroke-width': oda.disari ? 2 : 3 }, g);
        r.dataset.fill = fill;
        if (oda.disari) r.setAttribute('stroke-dasharray', '6 5');
      }
      g.addEventListener('pointerenter', () => highlight(oda.key));
      g.addEventListener('focus', () => highlight(oda.key));
      g.addEventListener('click', () => highlight(oda.key));
    }

    // Dış duvar
    el('rect', { x: 0, y: 0, width: model.w * S, height: model.d * S, fill: 'none', stroke: '#f5efe4', 'stroke-width': 9, 'pointer-events': 'none' }, svg);

    // Etiketler
    const lbl = el('g', { 'aria-hidden': 'true', 'pointer-events': 'none' }, svg);
    for (const oda of model.odalar) {
      const [x, y, w, h] = buyukRect(oda);
      const cx = (x + w / 2) * S;
      const cy = (y + h / 2) * S;
      const words = oda.ad.toLocaleUpperCase('tr-TR').split(' ');
      const lines = w < 2.6 && words.length > 1 ? words : [words.join(' ')];
      const txt = el('text', { x: cx, y: cy - (lines.length - 1) * 7, 'text-anchor': 'middle', class: 'plan-label' }, lbl);
      lines.forEach((line, i) => {
        el('tspan', { x: cx, dy: i ? 14 : 0 }, txt).textContent = line;
      });
      el('tspan', { x: cx, dy: 19, class: 'plan-area' }, txt).textContent = `${fmt(odaAlani(oda))} m²`;
    }

    // Kuzey oku
    const k = el('g', { 'aria-hidden': 'true', class: 'plan-dim', transform: `translate(${model.w * S + 30} -40)` }, svg);
    el('path', { d: 'M0 14V-6M-5 -1L0 -6L5 -1' }, k);
    el('text', { x: 0, y: 28, 'text-anchor': 'middle' }, k).textContent = 'K';
  }

  function drawList() {
    list.replaceChildren();
    for (const oda of model.odalar) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.room = oda.key;
      b.innerHTML = `<span class="sw" style="background:${ODA_RENK[oda.tur]}"></span><span>${oda.ad}</span><span class="m2">${fmt(odaAlani(oda))} <small>m²</small></span>`;
      b.addEventListener('pointerenter', () => highlight(oda.key));
      b.addEventListener('focus', () => highlight(oda.key));
      b.addEventListener('click', () => highlight(oda.key));
      li.appendChild(b);
      list.appendChild(li);
    }
    const veranda = model.odalar.filter((o) => o.disari).reduce((t, o) => t + odaAlani(o), 0);
    summary.innerHTML = `
      <div><dt>Model</dt><dd>${model.ad} ${model.tip}</dd></div>
      <div><dt>Brüt alan</dt><dd>${model.brut} m²</dd></div>
      <div><dt>Ölçü</dt><dd>${fmt(model.w)} × ${fmt(model.d)} m</dd></div>
      <div><dt>Veranda</dt><dd>${fmt(veranda)} m²</dd></div>`;
  }

  function setModel(m) {
    model = m;
    drawSvg();
    drawList();
    three?.build(model);
    highlight(null);
  }

  function setView(v) {
    view = v;
    svgWrap.hidden = v !== '2d';
    threeWrap.hidden = v !== '3d';
    if (v === '3d') {
      if (!three) three = plan3d(threeWrap, (k) => highlight(k));
      three.build(model);
      three.highlight(active);
      three.resize();
    }
  }

  return { setModel, setView, get view() { return view; } };
}

function plan3d(container, onHover) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.maxPolarAngle = 1.2;

  scene.add(new THREE.HemisphereLight('#fff4e6', '#3a3328', 1.4));
  const sun = new THREE.DirectionalLight('#ffe2bd', 1.8);
  sun.position.set(-8, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
  scene.add(sun);

  let group = new THREE.Group();
  scene.add(group);
  const floors = [];
  const wallMat = new THREE.MeshStandardMaterial({ color: '#f3eee6', roughness: 0.9 });

  function build(model) {
    scene.remove(group);
    group.traverse((o) => {
      o.geometry?.dispose();
      if (o.material && o.material !== wallMat) o.material.dispose();
    });
    group = new THREE.Group();
    floors.length = 0;
    const ox = model.w / 2;
    const oz = model.d / 2;
    const WH = 1.1;
    const t = 0.07;
    for (const oda of model.odalar) {
      const color = new THREE.Color(ODA_RENK[oda.tur]);
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
      m.userData.base = color.clone();
      for (const [x, y, w, h] of oda.r) {
        const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, h), m);
        f.position.set(x + w / 2 - ox, 0.06, y + h / 2 - oz);
        f.receiveShadow = true;
        f.userData.key = oda.key;
        group.add(f);
        floors.push(f);
        if (oda.disari) continue;
        const walls = [
          [w, t, x + w / 2, y + t / 2],
          [w, t, x + w / 2, y + h - t / 2],
          [t, h, x + t / 2, y + h / 2],
          [t, h, x + w - t / 2, y + h / 2],
        ];
        for (const [ww, dd, cx, cz] of walls) {
          const wm = new THREE.Mesh(new THREE.BoxGeometry(ww, WH, dd), wallMat);
          wm.position.set(cx - ox, 0.12 + WH / 2, cz - oz);
          wm.castShadow = true;
          wm.receiveShadow = true;
          group.add(wm);
        }
      }
    }
    // Zemin platformu
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(model.w + 1.2, 0.2, model.d + 3.6),
      new THREE.MeshStandardMaterial({ color: '#1d2420', roughness: 1 }),
    );
    base.position.set(0, -0.1, 1.2);
    base.receiveShadow = true;
    group.add(base);
    scene.add(group);

    const size = Math.max(model.w, model.d);
    camera.position.set(size * 0.55, size * 1.05, size * 1.05);
    controls.target.set(0, 0, 0.6);
    controls.minDistance = size * 0.7;
    controls.maxDistance = size * 2.6;
    controls.update();
  }

  let hoverKey = null;
  function highlight(key) {
    hoverKey = key;
    for (const f of floors) {
      f.material.color.copy(f.userData.key === key ? new THREE.Color(VURGU) : f.material.userData.base);
    }
  }

  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  renderer.domElement.addEventListener('pointermove', (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(floors)[0];
    const key = hit?.object.userData.key ?? null;
    if (key && key !== hoverKey) onHover(key);
  });

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);

  renderer.setAnimationLoop(() => {
    if (container.hidden) return;
    controls.update();
    renderer.render(scene, camera);
  });

  return { build, highlight, resize };
}
