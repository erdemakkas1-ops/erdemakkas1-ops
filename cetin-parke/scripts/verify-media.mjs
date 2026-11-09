import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const folders = ['hero', 'floor', 'finale'];
let total = 0;
for (const name of folders) {
  const base = join(process.cwd(), 'public', 'media', name);
  if (!existsSync(base)) throw Error(`Missing sequence: ${base}`);
  const files = readdirSync(base).filter(item => /^\d{4}\.webp$/.test(item)).sort();
  if (files.length !== 72) throw Error(`${name}: expected 72, found ${files.length}`);
  for (let n = 1; n <= 72; n++) {
    const file = join(base, `${String(n).padStart(4, '0')}.webp`);
    if (!existsSync(file) || statSync(file).size === 0) throw Error(`Missing frame: ${file}`);
  }
  total += files.length;
  console.log(`${name}: 72 frames OK`);
}
console.log(`PASS: ${total} static scroll-controlled frames`);
