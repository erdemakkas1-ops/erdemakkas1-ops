import { MODELLER, ASAMALAR, FIRMA } from './data.js';
import { createPlan } from './plan.js';
import { createCalculator } from './calculator.js';
import { createMap } from './map.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let modelIndex = 2; // Konfor 3+1 ile aç
let hero = null;
let plan = null;
let calc = null;

// ---------- Menü ----------
const toggle = $('[data-nav-toggle]');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
});
$$('[data-menu] a').forEach((a) =>
  a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }),
);
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Model seçiciler ----------
const select = $('[data-model-select]');
const contactModel = $('[data-contact-model]');
const tabs = $('[data-model-tabs]');
MODELLER.forEach((m, i) => {
  select.add(new Option(`${m.ad} ${m.tip}`, i));
  contactModel.add(new Option(`${m.ad} ${m.tip} · ${m.brut} m²`, `${m.ad} ${m.tip}`));
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.dataset.i = i;
  b.innerHTML = `<b>${m.ad}</b><span>${m.tip} · ${m.brut} m²</span>`;
  b.addEventListener('click', () => setModel(i));
  tabs.appendChild(b);
});
contactModel.add(new Option('Henüz karar vermedim', 'Kararsızım'));

function setModel(i, { from } = {}) {
  modelIndex = (i + MODELLER.length) % MODELLER.length;
  const m = MODELLER[modelIndex];
  select.value = modelIndex;
  $('[data-model-note]').textContent = `${m.tip} · ${m.brut} m² — ${m.aciklama}`;
  $('[data-prev]').disabled = modelIndex === 0;
  $('[data-next]').disabled = modelIndex === MODELLER.length - 1;
  $$('button', tabs).forEach((b) => b.setAttribute('aria-selected', +b.dataset.i === modelIndex));
  $('[data-plan-desc]').textContent = m.aciklama;
  contactModel.value = `${m.ad} ${m.tip}`;
  hero?.setModel(m);
  plan?.setModel(m);
  if (from !== 'calc') calc?.setAlan(m.brut);
}
select.addEventListener('change', () => setModel(+select.value));
$('[data-prev]').addEventListener('click', () => setModel(modelIndex - 1));
$('[data-next]').addEventListener('click', () => setModel(modelIndex + 1));

// ---------- Yapım aşamaları ----------
const stageList = $('[data-stages]');
ASAMALAR.forEach((a, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" data-stage="${i}" aria-pressed="false"><span class="dot">${i + 1}</span><span class="t"><b>${a.ad}</b><small>${a.not}</small></span></button>`;
  li.firstChild.addEventListener('click', () => hero?.setStage(i));
  stageList.appendChild(li);
});
function showStage(s) {
  $$('[data-stage]').forEach((b) => {
    const i = +b.dataset.stage;
    b.setAttribute('aria-pressed', i === s);
    b.dataset.done = i <= s;
  });
  stageList.style.setProperty('--p', s / (ASAMALAR.length - 1));
}
$('[data-replay]').addEventListener('click', () => hero?.replay());

// ---------- Hero 3D ----------
const heroCanvas = $('[data-hero-canvas]');
function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
if (webglOk()) {
  const { createHero } = await import('./hero3d.js');
  hero = createHero(heroCanvas, { onStage: showStage });
} else {
  heroCanvas.innerHTML = '<p class="no-webgl">3D görünüm için WebGL destekli bir tarayıcı gerekiyor.</p>';
  $('.build-steps').hidden = true;
}

// ---------- Plan ----------
plan = createPlan({
  svgWrap: $('[data-plan-svg]'),
  threeWrap: $('[data-plan-3d]'),
  list: $('[data-room-list]'),
  summary: $('[data-plan-summary]'),
  readout: $('[data-plan-readout]'),
});
$$('[data-view]').forEach((b) =>
  b.addEventListener('click', () => {
    if (b.dataset.view === '3d' && !webglOk()) return;
    $$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', x === b));
    plan.setView(b.dataset.view);
  }),
);
$('[data-plan-price]').addEventListener('click', () => calc?.setAlan(MODELLER[modelIndex].brut));

// ---------- Fiyat ----------
calc = createCalculator($('[data-calc]'));

// ---------- Harita ----------
createMap($('[data-map]'), $('[data-town-list]'), $('[data-map-readout]'));

// ---------- Instagram yer tutucuları ----------
const insta = $('[data-insta]');
['Bağ evi kurulumu', '3+1 anahtar teslim', 'Çelik iskelet montajı', 'Zemin betonu', 'Veranda detayı', 'Teslim günü'].forEach((t, i) => {
  insta.insertAdjacentHTML(
    'beforeend',
    `<li><a href="${FIRMA.instagram}" target="_blank" rel="noopener" class="insta-tile t${i % 3}">
      <svg viewBox="0 0 120 80" aria-hidden="true"><path d="M20 70V40l40-26 40 26v30z"/><path d="M50 70V52h20v18"/><path d="M8 70h104"/></svg>
      <span>${t}</span></a></li>`,
  );
});

// ---------- İletişim formu ----------
$('[data-contact]').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg = [
    `Merhaba, ben ${f.get('ad')}.`,
    `${f.get('model')} modeli hakkında bilgi almak istiyorum.`,
    f.get('konum') ? `Arsa konumu: ${f.get('konum')}` : null,
    f.get('mesaj') || null,
    `Telefon: ${f.get('tel')}`,
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

$('[data-year]').textContent = new Date().getFullYear();

// ---------- Görünür olunca belir ----------
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add('in'), io.unobserve(en.target))),
  { rootMargin: '0px 0px -8% 0px' },
);
$$('.reveal').forEach((n) => io.observe(n));

setModel(modelIndex);
