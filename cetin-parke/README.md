# ÇETİN PARKE — Cinematic Experience

## V7 — Beton → Parke → Salon kaydırma filmi (Maviron tarzı)

- **Açılış filmi** (`#hero`): ekrana sabitlenen sahnede kaydırdıkça **beton zemin → balıksırtı parke tahta tahta döşenir → halı, koltuk, sehpa ve berjer gelir → salon tamamlanır.** 96 karelik WebP dizisi (`public/media/film/`), kare tamamen scroll pozisyonuna bağlı; geri kaydırınca film geri sarar. Üç adım kartı (01 Beton zemin, 02 Parke döşeme + % sayacı, 03 Salon) ve sonda "Zeminini Tasarla" çağrısı.
- Kareler `scripts/build-floor-film.py` ile salon görselinden (`public/images/cetin-parke-salon-reference.png`) üretilir: zemin fotoğrafın perspektifinde prosedürel olarak çizilir, mobilyalar elle çizilmiş maskelerle (`scripts/polys.py`) fotoğraftan kesilir. Yeniden üretmek için: `pip install numpy opencv-python-headless pillow && python3 scripts/build-floor-film.py && python3 scripts/build-floor-film.py --designer`.
- **Zeminini Tasarla** (`#tasarla`, `components/FloorDesigner.tsx`): aynı salonda dizilim (Düz, Çapraz, Balıksırtı, Macar kesim, Hasır örgü), 7 renk tonu, kalınlık ve m² seçimi; parke canlı olarak salona döşenir, mobilya açılıp kapatılabilir, fire payı hesaplanır ve seçim WhatsApp mesajı olarak gönderilir.
- **Parke Rehberi** (`#rehber`, `components/ParkeGuide.tsx`): parke türleri (laminant, lamine, masif, SPC), dizilim örnekleri (canlı çizilen desenler), renk tonları, kalınlık / AC sınıfı, uygulama süreci, SSS.
- Eski "konsept renk dönüşümü" bölümü ve ilgisiz Unsplash öncesi/sonrası karşılaştırması kaldırıldı (yerini film ve Tasarla aldı). Kullanılmayan `hero/` ve `floor/` kare dizileri silindi.
- Bilgiler Instagram (@cetin.parke) ile teyit edildi: telefon 0543 457 63 64, adres **Türkocağı Cad. No:56, Pamukova/Sakarya**, ürünler Parke · Duvar Paneli · Kapı · Banyo, Türkiye geneli kargo. (Önceki "Elerek Mah." ibaresi doğrulanamadığı için çıkarıldı.)
- Vercel: proje kökü olarak `cetin-parke` klasörünü seçin.


Premium Turkish business website demo. Built from scratch in **Next.js App Router + React + TypeScript + GSAP ScrollTrigger + Lenis**.

## Quickstart

Requirements: Node.js 20.9+ and internet access to install dependencies.

```bash
npm install
npm run dev
```

Go to http://localhost:3000

**Important:** This ZIP includes source code, not `node_modules`, and has not undergone a live Next.js build in the production environment because package registry access was not available in the creation environment. Run `npm run typecheck` and `npm run build` before deploying.

## Project architecture

- `components/SiteExperience.tsx` — GSAP ScrollTrigger progress and complete responsive site.
- `components/ScrollFrameSequence.tsx` — deterministic scroll-to-WebP-frame Canvas renderer.
- `app/globals.css` — styling and reduced-motion support.
- `lib/site.ts` — business contact details (confirm with business before publishing).
- `lib/media.ts` — asset inventory and counts.
- `scripts/generate-demo-frames.py` — credit-free illustrative image sequence creator.
- `scripts/extract-frames.sh` — convert later Higgsfield output to scroll-controlled WebP.
- `HIGGSFIELD-PROMPTS.md` — optional high-quality video-generation prompts.
- `public/media/{hero,floor,finale}/` — bundled sequences, 72 frames each.

## Current experience

- Fullscreen pinned cinematic hero
- Editorial brand narrative
- Scroll-controlled before/after reveal section
- Architectural detail editorial
- Interactive four-category product showcase
- Accessible before-after comparison slider
- Fullscreen cinematic outro
- Live WhatsApp links and Instagram link, responsive nav
- Reduced-motion CSS fallback, mobile layout and focus states

## Client/demo caveats

**Some product and supporting photography is temporary remote Unsplash mockup imagery** representing an architectural mood, not Çetin Parke products or completed installations. Remote Unsplash URLs require internet in the viewer's browser. The three demo WebP image sequences are INCLUDED in this ZIP. They are 2D scroll illustrations derived from the supplied salon reference, not genuine 3D/Higgsfield footage. Replace them with properly generated scenes later.

Business phone: `0543 457 63 64`, Instagram: `@cetin.parke`, location: Pamukova/Sakarya (provided screenshot). Street address needs to be double-checked against the actual business before publication.

Robots indexing is deliberately disabled in demo. Change `metadataBase` and `robots` in `app/layout.tsx` when deploying to a production domain. Get real asset rights, legal/privacy review, and client approval.

## Performance notes

Animation scaffolding is present but device-level QA remains necessary. The demo uses 72-frame WebP sequences (1152×648), no video players. Frames are lazy-loaded around scroll position. Before public launch, measure network transfer, mobile FPS, and accessibility; provide actual business-approved imagery.

## V2 — STRICT SCROLL CONTROL

All cinematic shots use `ScrollFrameSequence` (canvas + WebP frames), **not HTML video playback**. No autoplay, looping, or timeline running on its own. Scroll forward advances the frame; scrolling backward reverses it. Hero text/reveal animations are also `scrub: true`.

Generated Higgsfield MP4 is used as an **offline source only**. Convert with `bash scripts/extract-frames.sh clip.mp4 hero` and copy the resulting WebP sequence into `public/media/hero/`. Likewise `finale`. The old `CinematicVideo.tsx` component was intentionally removed. Older instructions mentioning `.mp4` direct playback are obsolete.

## V3 — CREDIT-SAFE WORKING DEMO

Included: three 72-frame sequences generated offline from the salon photo, without AI service credits. The floor sequence is a *conceptual flooring tone visualization*, not a faithful product-swap or real renovation. No Higgsfield credits were consumed during this revision.

`npm run typecheck`, `npm run lint`, and `npm run build` should be run after `npm install`. The development environment could not download npm packages; **runtime compilation remains unverified**.

Higgsfield video can be produced later and extracted into sequences; at no point does the website autoplay it. Update `lib/media.ts` when changing frame counts.

## Vercel V6 deliverable

See `VERCEL-DEPLOY.md` for the deployment and testing checklist, and `HIGGSFIELD-RESULT.md` for the status of the completed video generation. Canvas visibility has been hardened to prevent blank frames before the first image is painted. A site icon and Git ignore file were added.
