# Alagözler Emlak & İnşaat — premium gayrimenkul platformu (demo)

`erdem-ismail/realestate-3d-demo` (ATLAS Rezidans 3D) projesi temel alınarak geliştirildi. Mevcut 3D bina, kat/daire seçimi, 2D/3D kat planları, ödeme planı, konum ve randevu sistemleri **olduğu gibi korunup** `/proje-3d` rotasına taşındı; üzerine ilan platformu eklendi.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Three.js / React Three Fiber / Drei · GSAP ScrollTrigger · Leaflet + OpenStreetMap

## Çalıştırma

```sh
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

GitHub Pages için statik çıktı: `PAGES_BASE_PATH=/erdemakkas1-ops/alagozler-emlak npm run build` → `out/` (repo kökündeki `pages.yml` bunu `main`'e push'ta yapar).

## Sayfalar

| Rota | İçerik |
| --- | --- |
| `/` | Hero + hızlı arama, öne çıkan ilanlar, kategoriler, 3D proje önizlemesi (bölüme gelince yüklenir; mobilde dokununca), son eklenenler, danışmanlık, iletişim |
| `/ilanlar` | Katalog: tür, şehir/ilçe, fiyat, m², satılık/kiralık filtreleri ve sıralama (URL'ye yazılır, paylaşılabilir); liste / harita görünümü; mobilde alt sayfa filtre |
| `/ilanlar/[slug]` | Galeri (kaydırma, klavye, tam ekran), türe göre özellik tablosu, açıklama, harita, WhatsApp (ilan bilgisi otomatik) ve telefon, favori, benzer ilanlar |
| `/favoriler` | localStorage'da tutulan favoriler |
| `/proje-3d` | Mevcut 3D rezidans deneyimi (temsili örnek proje) |

## Nereyi düzenlemeli

- **İşletme bilgileri:** `src/config/business.ts` — telefon/WhatsApp (Instagram biyografisindeki 0541 262 85 03), Instagram, ofis. Ortam değişkeniyle de verilebilir: `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_PHONE_E164`, `NEXT_PUBLIC_WHATSAPP_E164`. Boş bırakılırsa ilgili butonlar gizlenir.
- **İlanlar:** `src/data/listings.ts` (tipler `src/types/listing.ts`). Arsa/tarla, konut ve diğer için ayrı alanlar; detay tablosu yalnızca türe uygun alanları gösterir. Gerçek ilan eklerken `demo: false` ve `images: [{ src: "/ilanlar/<slug>/1.jpg", alt: "…" }]` kullanın (dosyalar `public/` altına). `src` yoksa temsili SVG görsel çizilir.
- **Koordinatlar:** `coords.approximate: true` haritada "yaklaşık / demo konum" olarak işaretlenir.
- **Logo:** `src/components/site/Logo.tsx` geçici bir monogramdır; müşterinin orijinal logo dosyası gelince değiştirilmeli.

## Hareket ve performans

- Kaydırma animasyonları `data-reveal`, `data-reveal-stagger`, `data-parallax` öznitelikleriyle (`src/components/motion/ScrollMotion.tsx`). Doğal kaydırma engellenmez; `prefers-reduced-motion`'da kapalı, telefonda kısaltılmış ve paralaks yok.
- Three.js yalnızca `/proje-3d`'de ve ana sayfadaki önizleme bölümüne gelindiğinde yüklenir; Leaflet yalnızca harita görünür olduğunda.
- Görsellerin tamamı kod içi SVG olduğu için kırık görsel riski yok.

## Demo sınırları

İlanlar, fiyatlar, görseller ve konumlar örnektir (sitede açıkça belirtilir). Randevu formu hiçbir yere gönderilmez. Yönetim paneli, veritabanı, ödeme ve ücretli API yoktur.

3D bölüm hakkında ayrıntı: aşağıdaki orijinal proje notları.

---

## Orijinal proje notları (ATLAS Rezidans 3D)

Bina, `Ön Cephe at Dusk` referans render'ına göre kodla kurulur; model dosyası yüklenmez. `src/lib/buildingConfig.ts` (kat sayısı, ölçüler), `src/lib/buildingLayout.ts` (cephe aksları, kat hitbox'ları, pencere–daire eşleşmesi), `Tower`, `Surroundings`, `HeroCanvas`. Daireler `src/data/apartments.ts`, planlar `src/data/floorPlan.ts`, konum `src/data/location.ts`, proje metni `src/data/project.ts`. Seçili kat, daire, plan modu ve ödeme ayarları `ProjectExperience` içinde tutulur. Orijinal repodaki kullanılmayan GLB modelleri (26 MB) ve renklendirme betiği kopyalanmadı.
