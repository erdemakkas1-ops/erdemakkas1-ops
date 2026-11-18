// Tarayıcı testleri: tüm rotalar × 6 genişlik, bağlantılar, konsol hataları, taşma, form akışı.
// Kullanım: önce `npm run build && npm start` (varsayılan http://localhost:3000), sonra `npm run test:e2e`
// BASE_URL ortam değişkeniyle farklı adres verilebilir.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const routes = [
  '/', '/hizmetler', '/hizmetler/elektrik-arizalari', '/hizmetler/mekanik-bakim', '/hizmetler/plc-otomasyon',
  '/hizmetler/surucu-servo-sistemleri', '/hizmetler/makine-revizyonu', '/makineler', '/calismalarimiz',
  '/hakkimizda', '/iletisim', '/gizlilik', '/makineler/bobst', '/makineler/manroland', '/rehber',
  '/rehber/ariza-bildirmeden-once', '/rehber/surucu-hata-koduna-ilk-bakis', '/rehber/planli-bakimin-temel-basliklari',
];
const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
const failures = [];
const fail = (m) => { failures.push(m); console.log('  ✗', m); };

const browser = await chromium.launch();

// 1) Rotalar × genişlikler
const links = new Set();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const r of routes) {
    errors.length = 0;
    const res = await page.goto(BASE + r, { waitUntil: 'networkidle' });
    if (res.status() !== 200) fail(`${r} @${w}: HTTP ${res.status()}`);
    // tüm reveal animasyonlarını tetiklemek için kaydır
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    });
    const info = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - window.innerWidth;
      const wide = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1) && !el.closest('[aria-hidden="true"], svg, .overflow-hidden');
      }).slice(0, 3).map((el) => el.tagName + '.' + (el.className?.toString?.() || '').slice(0, 50));
      const h1 = document.querySelectorAll('h1').length;
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
      const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
      const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
      const headerClip = [...document.querySelectorAll('header a, header button')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && getComputedStyle(el).display !== 'none' && (r.right > window.innerWidth || r.left < 0);
      }).length;
      const emptyButtons = [...document.querySelectorAll('a, button')].filter((el) => !el.textContent.trim() && !el.getAttribute('aria-label')).length;
      return { over, wide, h1, brokenImgs, noAlt, hrefs, emptyButtons, headerClip };
    });
    if (info.over > 0) fail(`${r} @${w}: yatay taşma ${info.over}px ${info.wide.join(' | ')}`);
    if (info.h1 !== 1) fail(`${r} @${w}: h1 sayısı ${info.h1}`);
    if (info.brokenImgs.length) fail(`${r} @${w}: kırık görsel ${info.brokenImgs}`);
    if (info.noAlt) fail(`${r} @${w}: alt metni olmayan ${info.noAlt} görsel`);
    if (info.headerClip) fail(`${r} @${w}: başlıkta ekran dışına taşan ${info.headerClip} öğe`);
    if (info.emptyButtons) fail(`${r} @${w}: etiketsiz ${info.emptyButtons} buton/bağlantı`);
    if (errors.length) fail(`${r} @${w}: konsol hatası ${errors.join(' / ')}`);
    info.hrefs.forEach((h) => links.add(h));
  }
  await ctx.close();
  console.log(`✓ ${routes.length} rota @${w}px kontrol edildi`);
}

// 2) Bağlantılar
const req = await browser.newContext();
for (const h of links) {
  if (/^(https?:|tel:|mailto:)/.test(h)) continue;
  const [path, hash] = h.split('#');
  const url = new URL(path || '/', BASE).toString();
  const res = await req.request.get(url);
  if (res.status() !== 200) { fail(`bağlantı ${h}: HTTP ${res.status()}`); continue; }
  if (hash) {
    const html = await res.text();
    if (!html.includes(`id="${hash}"`)) fail(`bağlantı ${h}: #${hash} hedefi yok`);
  }
}
console.log(`✓ ${links.size} benzersiz bağlantı kontrol edildi`);
for (const f of ['/sitemap.xml', '/robots.txt', '/opengraph-image', '/icon.svg']) {
  const res = await req.request.get(BASE + f);
  if (res.status() !== 200) fail(`${f}: HTTP ${res.status()}`);
}
const nf = await req.request.get(BASE + '/olmayan-sayfa');
if (nf.status() !== 404) fail(`404 sayfası: HTTP ${nf.status()}`);
console.log('✓ sitemap, robots, OG görseli, ikon, 404');

// 3) Form akışı (mobil)
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const popups = [];
ctx.on('page', (p) => popups.push(p.url()));
await page.goto(BASE + '/iletisim?ariza=servo#servis-formu', { waitUntil: 'networkidle' });
const pre = await page.locator('input[type=radio][value="Servo / Sürücü"]').isChecked();
if (!pre) fail('form: ?ariza=servo ön seçimi çalışmadı');
await page.locator('form button[type=submit]').click();
const alertText = await page.locator('form [role=alert]').innerText();
if (!/5 alanı kontrol edin/.test(alertText)) fail(`form: boş gönderim hata özeti beklenmedik: ${alertText}`);
const focused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
if (focused !== 'alert') fail('form: hata özetine odaklanılmadı');
await page.getByText('Makine durdu', { exact: true }).click();
await page.getByText('Diğer', { exact: true }).first().click();
await page.locator('form button[type=submit]').click();
if (!(await page.getByText('Makinenin markasını yazın.').first().isVisible())) fail('form: Diğer marka doğrulaması yok');
await page.getByLabel(/Makinenin markası/).fill('Örnek Üretici');
await page.getByLabel(/Makine modeli/).fill('Örnek Model');
await page.getByLabel(/Arıza açıklaması/).fill('Kısa');
await page.getByRole('textbox', { name: 'İl', exact: true }).fill('Bursa');
await page.locator('form button[type=submit]').click();
if (!(await page.getByText(/en az 20 karakter/).first().isVisible())) fail('form: kısa açıklama doğrulaması yok');
await page.getByLabel(/Arıza açıklaması/).fill('Makine start komutu almıyor, panoda kontaktör çekmiyor. Alarm: E-102.');
await page.locator('form button[type=submit]').click();
await page.waitForTimeout(500);
const msg = await page.getByTestId('message-preview').innerText().catch(() => '');
for (const s of ['SERVİS TALEBİ', 'Durum:* Makine durdu', 'Örnek Üretici (Diğer)', 'Örnek Model', 'Servo / Sürücü', 'Bursa', 'E-102'])
  if (!msg.includes(s)) fail(`form: mesajda eksik "${s}"`);
const waConfigured = popups.some((u) => u.includes('wa.me') || u.includes('whatsapp'));
const copyBtn = page.getByRole('button', { name: /Servis metnini kopyala/ });
await copyBtn.click();
await page.waitForTimeout(300);
const status = await page.locator('[role=status]').innerText();
if (!/kopyalandı|başarısız/.test(status)) fail('form: kopyalama durumu gösterilmedi');
const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
if (clip && !clip.includes('Örnek Model')) fail('form: panodaki metin hatalı');
console.log(`✓ form doğrulama, ön seçim, mesaj oluşturma, kopyalama (WhatsApp açılışı: ${waConfigured ? 'evet' : 'numara tanımlı değil – kopyalama modu'})`);
if (!/numarası bu sürümde henüz tanımlanmadığı|WhatsApp’ta hazır/.test(await page.locator('h3, p').allInnerTexts().then((t) => t.join(' '))))
  fail('form: sonuç bilgilendirmesi yok');

// 3b) Marka/model ön doldurma
await page.goto(BASE + '/iletisim?marka=bobst&model=Expertcut#servis-formu', { waitUntil: 'networkidle' });
if (!(await page.locator('input[type=radio][value="BOBST"]').isChecked())) fail('form: ?marka=bobst ön seçimi çalışmadı');
if ((await page.getByLabel(/Makine modeli/).inputValue()) !== 'Expertcut') fail('form: ?model= ön doldurma çalışmadı');
console.log('✓ marka/model ön doldurma');

// 4) Mobil menü + reduced motion
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Menüyü aç' }).click();
if (!(await page.locator('#mobil-menu').isVisible())) fail('mobil menü açılmadı');
await page.keyboard.press('Escape');
if (await page.locator('#mobil-menu').isVisible()) fail('mobil menü Escape ile kapanmadı');
const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
const rp = await rm.newPage();
await rp.goto(BASE + '/', { waitUntil: 'networkidle' });
const hidden = await rp.evaluate(() => [...document.querySelectorAll('[data-reveal],[data-stagger] > *')].filter((e) => getComputedStyle(e).opacity !== '1' || getComputedStyle(e).visibility === 'hidden').length);
if (hidden) fail(`reduced-motion: ${hidden} öğe gizli kaldı`);
console.log('✓ mobil menü (aç/Escape) ve prefers-reduced-motion');

await browser.close();
console.log(failures.length ? `\n${failures.length} HATA` : '\nTÜM TESTLER GEÇTİ');
process.exit(failures.length ? 1 : 0);
