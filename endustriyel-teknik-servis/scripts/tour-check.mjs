/**
 * Kamera turu doğrulaması (mekanik + PLC sahneleri).
 *   BASE_URL=http://localhost:3100 node scripts/tour-check.mjs [ekran-görüntüsü-klasörü]
 *
 * Her genişlikte ve her adımın sabit durduğu noktada:
 *  - görünür her etiketin noktası, görselin ekrandaki gerçek dikdörtgenine göre beklenen yerde mi (≤ 1 px)
 *  - nokta ve etiket ekran içinde mi, metin paneliyle / birbirleriyle çakışıyor mu
 *  - görsel sahneyi tamamen kaplıyor mu (kenar boşluğu yok)
 *  - her adımda en az bir etiket görünüyor mu
 *  - geri kaydırınca kamera aynı değere dönüyor mu
 * Ayrıca %0/25/50/75/100 ilerlemede ekran görüntüsü alınır (klasör verilirse).
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

// Playwright önceden kurulu (global); e2e.mjs ile aynı yükleme
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = (process.env.BASE_URL || 'http://localhost:3100').replace(/\/$/, '') + '/';
const SHOTS = process.argv[2];
const WIDTHS = [375, 390, 430, 768, 1440, 1920];
const TOURS = ['mekanik', 'otomasyon'];
const fails = [];
const fail = (m) => fails.push(m);
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
for (const w of WIDTHS) {
  const h = w < 768 ? 844 : w < 1200 ? 1024 : w >= 1920 ? 1080 : 900;
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // sahne kurulumları tarayıcı boşta kalınca yapılır (idleMatchMedia): hazır olmalarını bekle
  await page.waitForFunction(() => [...document.querySelectorAll('.scene--tour')].every((x) => x.dataset.tourDuration));

  const scrollTo = async (id, f) => {
    await page.evaluate(([id, f]) => {
      const e = document.getElementById(id);
      window.scrollTo(0, e.offsetTop + (e.offsetHeight - innerHeight) * f);
    }, [id, f]);
    await page.waitForTimeout(1500); // scrub yetişsin
  };

  for (const id of TOURS) {
    const dur = await page.evaluate((id) => +document.getElementById(id).dataset.tourDuration, id);
    const steps = await page.evaluate((id) => document.querySelectorAll(`#${id} [data-hs]`).length, id);
    const camAt = [];
    for (let i = 0; i < steps; i++) {
      await scrollTo(id, (0.15 + i + 0.62) / dur);
      const r = await page.evaluate(([id, i]) => {
        const sec = document.getElementById(id);
        const stage = sec.querySelector('[data-tour-stage]').getBoundingClientRect();
        const img = sec.querySelector('[data-cover-box] img').getBoundingClientRect();
        const copy = sec.querySelector('[data-tour-copy]').getBoundingClientRect();
        const cam = sec.querySelector('[data-cam]').style.transform;
        const items = [...sec.querySelectorAll(`[data-hs="${i}"] [data-hotspot]`)].map((el) => {
          const inner = el.querySelector('.hotspot__inner');
          const visible = !el.classList.contains('hotspot--off') && +getComputedStyle(inner).opacity > 0.95;
          const d = el.querySelector('.hotspot__dot').getBoundingClientRect();
          const t = el.querySelector('.hotspot__tag').getBoundingClientRect();
          const fx = +el.dataset.x / 100, fy = +el.dataset.y / 100;
          const cx = d.left + d.width / 2, cy = d.top + d.height / 2;
          // nokta gerçekten çiziliyor mu (kırpılmamış, üstü kapanmamış)
          const painted = document.elementsFromPoint(cx, cy).some((e) => e.classList.contains('hotspot__dot'));
          return {
            title: el.textContent.trim(),
            visible,
            painted,
            err: [d.left + d.width / 2 - (img.left + fx * img.width), d.top + d.height / 2 - (img.top + fy * img.height)],
            dot: { l: d.left, t: d.top, r: d.right, b: d.bottom },
            tag: { l: t.left, t: t.top, r: t.right, b: t.bottom },
          };
        });
        // Piksel bazlı kontrol: sahnenin 5×5 noktasında en üstteki içerik görsel mi (kırpma / boşluk yakalanır)
        const holes = [];
        for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) {
          const x = stage.left + 4 + (stage.width - 8) * (a / 4);
          const y = stage.top + 4 + (stage.height - 8) * (b / 4);
          if (!document.elementsFromPoint(x, y).some((e) => e.matches('[data-cover-box] img'))) holes.push(`${x | 0},${y | 0}`);
        }
        return {
          cam,
          holes,
          covers: img.left <= stage.left + 0.5 && img.top <= stage.top + 0.5 && img.right >= stage.right - 0.5 && img.bottom >= stage.bottom - 0.5,
          stage: { l: stage.left, t: stage.top, r: stage.right, b: stage.bottom },
          copy: { l: copy.left, t: copy.top, r: copy.right, b: copy.bottom },
          items,
        };
      }, [id, i]);
      camAt.push(r.cam);
      const tag = `${w}px ${id} adım ${i + 1}`;
      if (!r.covers) fail(`${tag}: görsel sahneyi kaplamıyor`);
      if (r.holes.length) fail(`${tag}: görselin görünmediği noktalar ${r.holes.join(' ')}`);
      const vis = r.items.filter((x) => x.visible);
      if (!vis.length) fail(`${tag}: hiç etiket görünmüyor`);
      const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
      const inside = (a) => a.l >= r.stage.l - 1 && a.r <= r.stage.r + 1 && a.t >= r.stage.t - 1 && a.b <= r.stage.b + 1;
      vis.forEach((x, k) => {
        if (Math.abs(x.err[0]) > 1 || Math.abs(x.err[1]) > 1) fail(`${tag} ${x.title}: nokta sapması ${x.err.map((v) => v.toFixed(1))}`);
        if (!inside(x.dot) || !inside(x.tag)) fail(`${tag} ${x.title}: ekran dışında`);
        if (!x.painted) fail(`${tag} ${x.title}: nokta çizilmiyor (kırpılmış / örtülü)`);
        if (hit(x.tag, r.copy) || hit(x.dot, r.copy)) fail(`${tag} ${x.title}: metin paneliyle çakışıyor`);
        vis.slice(k + 1).forEach((o) => hit(x.tag, o.tag) && fail(`${tag}: "${x.title}" ve "${o.title}" çakışıyor`));
      });
      console.log(`${tag}: ${vis.map((x) => x.title).join(', ')}${r.items.length > vis.length ? `  (gizli: ${r.items.filter((x) => !x.visible).map((x) => x.title).join(', ')})` : ''}`);
    }
    // geri kaydırma: ilk adıma dönünce kamera aynı mı
    await scrollTo(id, (0.15 + 0.62) / dur);
    const back = await page.evaluate((id) => document.querySelector(`#${id} [data-cam]`).style.transform, id);
    if (back !== camAt[0]) fail(`${w}px ${id}: geri kaydırmada kamera farklı (${back} ≠ ${camAt[0]})`);

    if (SHOTS) {
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        await scrollTo(id, f);
        await page.screenshot({ path: `${SHOTS}/${id}-${w}-${String(f * 100).padStart(3, '0')}.png` });
      }
    }
  }
  if (errors.length) fail(`${w}px konsol: ${errors.join(' | ')}`);
  await page.close();
}
await browser.close();

if (fails.length) {
  console.error(`\n${fails.length} SORUN:\n- ${fails.join('\n- ')}`);
  process.exit(1);
}
console.log('\nKAMERA TURU KONTROLLERİ GEÇTİ');
