# Ahima Dekorasyon — sinematik web sitesi demosu

Ankara / Rüzgarlı merkezli Ahima Dekorasyon için tek sayfalık, kaydırmayla yönetilen premium demo.
**Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger · Lenis.** Ek kütüphane yok.

```bash
npm install
npm run dev            # http://localhost:3000
npm run typecheck && npm run lint && npm run verify:media && npm run build
```

## Sayfa akışı

| # | Bölüm | Ne yapar |
|---|---|---|
| 1–3 | `#donusum` — `components/BathFilm.tsx` | Hero (eski banyo) → 6 aşamalı dönüşüm (söküm, seramik, lavabo & dolap, duşakabin & armatür, ayna & detay, aydınlatma) → final başlığı. 96 kare, tamamen kaydırmaya bağlı; yukarı kaydırınca geri sarar. |
| — | `#once-sonra` — `BeforeAfter.tsx` | Aynı kamera, aynı oda: eski / yeni banyo sürgüsü (fare, dokunma, klavye). |
| 4 | `#mutfak` — `KitchenFilm.tsx` | 40 karelik mutfak sahnesi; dolaplar, tezgâh ve tezgâh arası, ankastre, ada, gizli LED sırayla. |
| — | `#tasarla` — `Configurator.tsx` | 3 seramik × 3 dolap = 9 ayrı render. Seçim anında değişir, WhatsApp’a veya teklif formuna aktarılır. |
| — | `#hizmetler` — `Services.tsx` | 6 hizmet, editoryal liste + yapışkan fotoğraf (görseller firmanın kendi işleri). |
| — | `#projeler` — `Projects.tsx` | Yalnızca Instagram’dan doğrulanabilen gerçek işler (Batıkent, İncek, diğerleri); her kare paylaşımına bağlı. |
| — | `#surec`, `#teklif` | 4 adımlı süreç; hizmet seçimli form → hazır WhatsApp mesajı (backend yok, olduğu gibi söylenir). |

Sabit iletişim: masaüstünde tek WhatsApp düğmesi, telefonda alt çubuk (Ara · WhatsApp · Keşif iste).

## Görseller ve dürüstlük kuralı

- **3D konsept görselleştirme:** banyo filmi, önce/sonra, konfigüratör ve mutfak. Blender Cycles ile tek bir modellenmiş
  odadan path-traced render (`scripts/bathroom.py`, `scripts/kitchen.py`). Sitede her yerde “Konsept görselleştirme”
  olarak etiketli.
- **Gerçek projeler:** `public/projects/` — firmanın kendi Instagram videolarından alınmış kareler (720 px).
  Yapay görsel bu bölüme karışmaz.
- Doku kaynakları: Poly Haven CC0 (ceviz, sıva, beton); mermer / antrasit / bej taş levhaları
  `scripts/make_slabs.py` ile prosedürel üretildi. Yazı tipleri SIL OFL (Fraunces, Instrument Sans, JetBrains Mono),
  `app/fonts/` içinde, dışarıya istek yok.

### Renderları yeniden üretmek

```bash
pip install bpy==5.2.3 numpy opencv-python-headless pillow   # Python 3.13
python3 scripts/make_slabs.py $AHIMA_TEX/slabs                 # + Poly Haven dokuları $AHIMA_TEX/pbr/ altına
AHIMA_TEX=... python3 scripts/bathroom.py film   --out R/film   --n 96 --res 1280x720 --samples 20
AHIMA_TEX=... python3 scripts/bathroom.py film   --out R/film_m --n 60 --res 720x1280 --portrait
AHIMA_TEX=... python3 scripts/bathroom.py config --out R/config --res 1600x900 --samples 40
AHIMA_TEX=... python3 scripts/kitchen.py  film   --out R/kfilm  --n 40 [--portrait]
python3 scripts/encode_frames.py R/film public/media/bath/d --quality 84
```

Higgsfield ile fotogerçekçilik katmanı eklemek için: `HIGGSFIELD-PROMPTS.md`.

## Performans

- Kareler canvas’a çizilir; React kaydırma sırasında yeniden render olmaz (ScrollTrigger → doğrudan DOM).
- İlk kare `<link rel=preload>` ile; film kalanı önce kaba (her 16. kare) sonra ince sırayla yüklenir, iki komşu kare
  harmanlanır. Telefonlarda dikey kamera ile render edilmiş ayrı dizi kullanılır.
- Masaüstü filmi ≈ 96 × 25–40 KB WebP. Lenis yalnızca fare/trackpad cihazlarında; dokunmatikte yerel kaydırma.
- `prefers-reduced-motion`: sabitleme ve animasyon kapanır, final karesi + statik içerik gösterilir.

## Yayın

- **Vercel:** proje kökü `ahima-dekorasyon`, framework Next.js, başka ayar gerekmez.
- **GitHub Pages:** `main`’e push → `.github/workflows/pages.yml` statik export alır
  (`PAGES_BASE_PATH=/erdemakkas1-ops/ahima-dekorasyon`) → `https://erdemakkas1-ops.github.io/erdemakkas1-ops/ahima-dekorasyon/`.
- Demo arama motorlarına kapalı (`robots: noindex`). Onaydan sonra `NEXT_PUBLIC_INDEXABLE=1` ve gerçek alan adı için
  `NEXT_PUBLIC_SITE_URL` verin.

## İşletmeden alınması gerekenler

1. **Logo** (vektör) — şimdilik yazı markası kullanılıyor.
2. **Yüksek çözünürlüklü proje fotoğrafları** — mevcut kareler 720p Instagram videolarından; özellikle Batıkent ve İncek.
3. **Mağaza / showroom fotoğrafları** ve satılan yapı malzemesi markaları — Instagram’da bulunamadı.
4. **Açık adres teyidi** (kapı no, ilçe) ve çalışma saatleri; haritada doğru pin.
5. **Hizmet bölgesi** (yalnız Ankara mı?) ve “ücretsiz keşif” koşulu.
6. Projelerde müşteri adı/semt kullanım izni (şu an yalnız semt: Batıkent, İncek).
7. Varsa gerçek müşteri yorumları (uydurma yorum kullanılmadı) ve e-posta adresi.
