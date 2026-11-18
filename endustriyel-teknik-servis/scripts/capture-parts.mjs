// "Neye bakıyorum?" yörüngesi için filmin 3D modelinden şeffaf arka planlı parça görselleri çeker.
// Kullanım: npm run build && npm start, sonra: node scripts/capture-parts.mjs && python3 scripts/png-to-webp.py --parts
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = 'scripts/.capture/parts';
mkdirSync(OUT, { recursive: true });

const ALL = ['base', 'unit0', 'unit1', 'unit2', 'unit3', 'feed', 'delivery', 'console', 'panel', 'plc', 'drive', 'cable'];
const parts = [
  { name: 'elektrik-arizalari', tags: ['panel', 'plc'], dir: [0.85, 0.3, 1], hi: [] },
  { name: 'mekanik-bakim', tags: ['unit1'], dir: [0.9, 0.35, 1], hi: [], cutaway: true },
  { name: 'plc-otomasyon', tags: ['panel', 'plc'], dir: [-0.35, 0.12, 1], hi: ['plc'] },
  { name: 'surucu-servo-sistemleri', tags: ['unit2', 'drive'], dir: [0.75, 0.28, 1], hi: ['drive'] },
  { name: 'makine-revizyonu', tags: ALL, dir: [0.8, 0.5, 1], hi: [] },
];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const p of parts) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  await page.goto(`${BASE}/?capture`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__film, null, { timeout: 60000 });
  const url = await page.evaluate(({ tags, dir, hi, cutaway }) => {
    window.__film.part(tags, dir, hi, cutaway);
    return document.querySelector('.film__canvas').toDataURL('image/png');
  }, { tags: p.tags, dir: p.dir, hi: p.hi, cutaway: Boolean(p.cutaway) });
  writeFileSync(`${OUT}/${p.name}.png`, Buffer.from(url.split(',')[1], 'base64'));
  console.log('✓', p.name);
  await page.close();
}
await browser.close();
