// Açılış filminden poster ve süreç karelerini çeker (PNG). WebP'ye çevirmek için ardından:
//   python3 scripts/png-to-webp.py
// Kullanım: npm run build && npm start, sonra: node scripts/capture-film.mjs  (BASE_URL ile adres değiştirilebilir)
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = 'scripts/.capture';
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: 'poster', w: 1600, h: 900, t: 0 },
  { name: 'poster-m', w: 860, h: 1800, t: 0 },
  { name: 'step-1', w: 1200, h: 900, t: 1.6, centered: true },
  { name: 'step-2', w: 1200, h: 900, t: 3.1, centered: true },
  { name: 'step-3', w: 1200, h: 900, t: 5.2, centered: true },
  { name: 'step-4', w: 1200, h: 900, t: 9.4, centered: true },
  { name: 'og', w: 1200, h: 630, t: 9.6, centered: true },
];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
  await page.goto(`${BASE}/?capture`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__film, null, { timeout: 60000 });
  await page.evaluate(([t, c]) => window.__film.seek(t, c), [s.t, Boolean(s.centered)]);
  await page.waitForTimeout(400);
  await page.locator('.film__canvas').screenshot({ path: `${OUT}/${s.name}.png`, timeout: 120000 });
  console.log('✓', s.name);
  await page.close();
}
await browser.close();
