# Endüstriyel Teknik Servis – Web Sitesi

BOBST, manroland ve benzeri endüstriyel baskı/ambalaj makinelerine elektrik, mekanik ve otomasyon
teknik servisi veren **bağımsız bir uzman** için Türkçe, responsive, müşteri kazanmaya odaklı web sitesi.

**Teknolojiler:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · three.js 0.180 (yalnızca açılış filmi,
dinamik import) · GSAP + ScrollTrigger (`@gsap/react` useGSAP) · Lucide React. Video yoktur.

**Tasarım dili:** Maviron Çelik demosuyla aynı aile — lacivert/bakır/kâğıt paleti, Archivo %125 geniş büyük harf
başlıklar (konturlu `<em>`), Instrument Sans metin, JetBrains Mono etiketler; açılışta scroll'a bağlı canlı three.js
"blueprint" filmi; fotoğraflı hizmet kolonları, film karelerinden süreç, SSS, bilgi tablosu + form, sağ altta hızlı
iletişim, footer'da dev konturlu yazı. 4 hizmette kullanıcı tarafından sağlanan 3 temsilî fotoğraf
(`public/images/industrial`) kullanılır.

---

## Çalıştırma

```bash
cd endustriyel-teknik-servis
npm install
npm run dev          # http://localhost:3000
```

| Komut | Açıklama |
| --- | --- |
| `npm run build` / `npm start` | Production build ve sunucu |
| `npm run lint` | ESLint (next/core-web-vitals + typescript) |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run test:whatsapp` | Form doğrulama ve WhatsApp mesajı birim testleri (Node 22.18+) |
| `npm run test:e2e` | Tarayıcı testleri – önce `npm run build && npm start` çalışıyor olmalı (`BASE_URL` ile adres değiştirilebilir) |

## Vercel'de yayınlama

1. Vercel'de **Add New → Project** ile bu depoyu içe aktarın.
2. **Root Directory** olarak `endustriyel-teknik-servis` klasörünü seçin. Framework otomatik olarak *Next.js* algılanır; başka ayar gerekmez.
3. **Settings → Environment Variables** bölümüne (gerçek bilgiler hazır olduğunda) ekleyin:

   | Değişken | Örnek biçim | Etkisi |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.alanadiniz.com` | Canonical, sitemap, Open Graph adresleri |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `905xxxxxxxxx` | Form mesajı wa.me ile açılır; mobil çubukta WhatsApp butonu görünür |
   | `NEXT_PUBLIC_PHONE` | `+90 5xx xxx xx xx` | "Telefon ile İletişim" butonu `tel:` bağlantısı olur |
   | `NEXT_PUBLIC_EMAIL` | `info@alanadiniz.com` | İletişim listesine eklenir |

4. Değişkenler `NEXT_PUBLIC_` olduğu için **build sırasında** gömülür; değiştirdikten sonra yeniden deploy edin.

`NEXT_PUBLIC_SITE_URL` verilmezse Vercel'in production alan adı (`VERCEL_PROJECT_PRODUCTION_URL`) kullanılır.

**GitHub Pages:** Depodaki `pages.yml` iş akışı siteyi `PAGES_BASE_PATH` ile statik olarak (`out/`) dışa aktarır ve
`/endustriyel-teknik-servis/` altında yayınlar (yalnızca `main` dalına push'ta).

---

## İçerik yönetimi (tek merkez: `src/data/`)

| Dosya | İçerik |
| --- | --- |
| `site.ts` | İşletme adı, usta adı, iletişim, hizmet bölgesi, çalışma saatleri, vergi bilgileri, `showContentPlaceholders` |
| `services.ts` | 5 hizmet: kart metni, kapsam, detay sayfası içerikleri, SEO. Menü, footer, sitemap ve sayfalar buradan üretilir |
| `machines.ts` | Marka grupları ve **model bazlı liste** (`models` dizisi) |
| `projects.ts` | Çalışmalar (boşken "Örnek içerik" yer tutucuları görünür) |
| `about.ts` | Deneyim yılı, belgeler, geçmiş, usta fotoğrafı, çalışma prensipleri |
| `process.ts` | Servis süreci adımları |
| `form.ts` | Form marka ve arıza türü seçenekleri |
| `film.ts` | Açılış filminin sahne metinleri ve 3D etiketleri |
| `faq.ts` | Sıkça sorulan sorular (FAQPage JSON-LD de buradan üretilir) |
| `visuals.ts` | Sayfa görselleri (hero vb.) |

`null` bırakılan alanlar sitede gösterilmez veya açıkça "eklenecek" olarak işaretlenir. Hiçbir alanda uydurma veri yoktur.

### Gerçek fotoğraf eklemek

Fotoğrafları `public/images/...` altına koyun (WebP/AVIF, ~1600–2400 px genişlik önerilir) ve ilgili kayda ekleyin:

```ts
image: { src: '/images/hero.webp', alt: 'Açıklayıcı Türkçe alt metin', width: 2400, height: 1400 }
```

- Hero: `src/data/visuals.ts` → `images.hero`
- Makine grubu: `src/data/machines.ts` → `image`
- Usta fotoğrafı: `src/data/about.ts` → `portrait`
- Çalışmalar: `src/data/projects.ts` → `photos[]`

Görsel bulunan yerde SVG çizim yerine otomatik olarak `next/image` kullanılır (hero `priority` ile yüklenir).
Gerçek veriler girildikten sonra `site.showContentPlaceholders` değerini `false` yapın.

---

## Proje yapısı

```
src/
  app/                    # Rotalar, metadata, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
    hizmetler/[slug]/     # 5 hizmet detay sayfası (generateStaticParams)
    makineler/ calismalarimiz/ hakkimizda/ iletisim/ gizlilik/
  components/
    film/                 # Film (scroll → film saniyesi, etiketler), scene.ts (three.js sahnesi)
    layout/               # Header (mobil menü), Footer (dev konturlu yazı), QuickContact, Logo
    sections/             # Expertise, Process, Machines, Projects, About, Faq, ContactSection, ServiceCta, PageHero…
    forms/                # ServiceRequestForm (doğrulama + WhatsApp mesajı)
    animations/           # ScrollEffects (GSAP ScrollTrigger, data-* öznitelikleri)
    visuals/              # SVG teknik çizimler + Visual (foto/çizim seçici)
    ui/                   # ButtonLink, SectionHeading, Breadcrumbs, JsonLd, ContactActions, Icon
  data/                   # Tüm içerik ve işletme ayarları
  lib/                    # whatsapp.ts (saf fonksiyonlar), contact.ts, seo.ts
scripts/                  # test-whatsapp.mjs, e2e.mjs, capture-film.mjs, png-to-webp.py
public/images/            # Gerçek fotoğraflar için klasörler
```

## Açılış filmi (`src/components/film/`)

Maviron Çelik filmindeki yaklaşım: kod içinde kurulan bir baskı makinesi modeli (4 baskı ünitesi, besleme, çıkış,
kumanda panosu, servo motor + redüktör), sayfa kaydırmasıyla oynatılır.

| Film saniyesi | Ne olur | Metin |
| --- | --- | --- |
| yükleme | plan çizgileri ve tüm parçaların blueprint'i plotter gibi çizilir | Hero: "Üretiminiz durmasın." |
| 1.2–3.4 | taban, yan plakalar (öndekiler yarı saydam kesit), silindirler, besleme, çıkış yerine oturur | 01 Teşhis |
| 3.6–6.0 | kumanda panosu gelir, bakır renkte vurgulanır; PLC / servo sürücü / kumanda etiketleri | 02 Elektrik ve otomasyon |
| 5.8–8.0 | servo motor + redüktör gelir, silindirler döner; rulman yatağı etiketleri | 03 Mekanik ve hareket |
| 8.0–10 | geniş kapanış planı + CTA | 04 Kontrol ve teslim |

- Bölüm masaüstünde 520vh; sahne `position: sticky` (pin-spacer yok). Scroll ilerlemesi → film saniyesi; oynatma
  kafası yumuşatılarak takip eder, her şey `t`'nin fonksiyonu olduğu için geri kaydırma geri sarar.
- Düzen CSS medya sorgusuyla belirlenir (hidrasyonda kayma yok). **Mobil (<768 px), `prefers-reduced-motion`, WebGL2
  yok veya `?still`**: durağan poster (`public/images/film/poster*.webp`) + hero metni, pin yok, three.js yüklenmez.
- three.js yalnızca film başlarken dinamik import ile ayrı parça olarak yüklenir (ana sayfa ilk JS ≈ 122 kB).
- Sahne zamanlaması/kamera: `components/film/scene.ts`; metinler ve 3D etiketler: `data/film.ts`.
- Poster ve süreç görselleri filmden çekilir: `npm run build && npm start`, sonra
  `node scripts/capture-film.mjs && python3 scripts/png-to-webp.py` (`?capture` + `__film.seek(t, ortalanmış)`).
  Model veya kamera değişince yeniden çekin.

## Teknik notlar

- **Animasyon (film dışı):** Tek bir `ScrollEffects` bileşeni `data-reveal`, `data-stagger`, `data-clip`, `data-zoom`,
  `data-parallax`, `data-line`, `data-hero`, `data-timeline` özniteliklerini `gsap.matchMedia` ile kurar; rota
  değişiminde ve unmount'ta `revert()` edilir. Pin (sayfa kilitleme) yoktur. Mobilde mesafeler küçülür, parallax/zoom
  kapanır. `prefers-reduced-motion: reduce` durumunda hiçbir animasyon kurulmaz. Hero giriş animasyonu CSS ile
  yapılır (JS beklemez, CLS oluşturmaz).
- **Form:** Sunucuya veri göndermez. Doğrulama sonrası mesaj oluşturulur; numara tanımlıysa `wa.me` yeni sekmede
  açılır ve kullanıcıya mesajı **kendisinin göndermesi** gerektiği söylenir. Numara yoksa metin önizlemesi ve
  "kopyala" seçeneği gösterilir. Hizmet sayfalarından gelindiğinde arıza türü `?ariza=` ile ön seçilir.
- **SEO:** Sayfa bazlı title/description, canonical, Open Graph, OG görseli, sitemap, robots, BreadcrumbList
  JSON-LD. `ProfessionalService` JSON-LD **yalnızca** işletme adı ve telefon/e-posta girildiğinde üretilir.
- **Erişilebilirlik:** Semantik başlıklar (sayfa başına tek h1), "İçeriğe geç" bağlantısı, görünür odak, klavye ile
  menü (Escape kapatır), form hata özeti + alan bazlı `aria-invalid`/`aria-describedby`, SVG'lerde `role="img"` ve
  Türkçe etiket.

---

## Test sonuçları (bu sürüm için gerçekten çalıştırılanlar)

- `npm run lint` – hatasız, uyarısız
- `npm run typecheck` – hatasız
- `npm run build` – başarılı (19 statik sayfa/rota). `PAGES_BASE_PATH` ile statik dışa aktarım da başarılı.
- `npm run test:whatsapp` – 8/8 test geçti
- `npm run test:e2e` (Chromium/Playwright) – geçti:
  - 12 rota × 360/390/768/1024/1440/1920 px: HTTP 200, yatay taşma yok, sayfa başına tek h1, kırık görsel yok,
    etiketsiz buton/bağlantı yok, konsol hatası yok
  - Sayfalardaki tüm iç bağlantılar ve `#` hedefleri, sitemap/robots/OG/ikon, 404 sayfası
  - Form: boş gönderim hata özeti ve odak, "Diğer" marka doğrulaması, kısa açıklama doğrulaması, `?ariza=` ön seçimi,
    mesaj içeriği, kopyalama
  - Mobil menü açma / Escape ile kapatma; `prefers-reduced-motion` altında gizli içerik kalmaması
- WhatsApp numarası tanımlı build ayrıca test edildi (geçici test numarasıyla): `wa.me/<numara>?text=...` yeni sekmede
  açıldı, mesaj doğru kodlandı, `tel:` bağlantısı ve mobil WhatsApp butonu göründü.
- **Yapılmayanlar:** Gerçek iOS/Android cihaz ve Safari/Firefox testi, Lighthouse ölçümü yapılmadı. Gerçek WhatsApp
  uygulamasına mesaj gönderimi denenmedi (yalnızca bağlantının açıldığı doğrulandı).

---

## Doğrulanması / girilmesi gereken işletme bilgileri

Bu bilgiler olmadan site yayınlanabilir, ancak ilgili alanlar gizli kalır veya "eklenecek" olarak görünür.

1. **İşletme / ticari unvan** ve logo için kısa işaret (`site.ts → name`, `shortMark`) – şu an genel tanım "Endüstriyel Teknik Servis" kullanılıyor
2. **Ustanın adı soyadı** (`ownerName`)
3. **Telefon** ve **WhatsApp numarası** (ortam değişkeni veya `site.ts`) – tanımlanmadan form "kopyala" modunda çalışır
4. **E-posta** (KVKK başvuru adresi olarak da kullanılır)
5. **Hizmet bölgesi** (hangi il/bölgelere yerinde hizmet verildiği)
6. **Çalışma saatleri** (girilmezse gösterilmez; 7/24 gibi ifadeler yalnızca gerçekse)
7. **Vergi dairesi, VKN/TCKN, MERSİS** – yasal bilgilendirme satırı için
8. **Alan adı** (`NEXT_PUBLIC_SITE_URL`)
9. **Deneyim yılı, mesleki belgeler/sertifikalar, kariyer geçmişi** (`about.ts`)
10. **Gerçekten çalışılan BOBST ve manroland modelleri** (`machines.ts → models`)
11. **Marka ürün grupları** (`machineTypes`) – hangi makine türlerinde çalışıldığının teyidi
12. **Hizmet kapsamı maddeleri** (`services.ts`) – taslak olarak yazıldı; ustanın onayı gerekir (ör. PLC programına müdahale, atölye onarımı, yüksek gerilim işleri gibi sınırlar)
13. **Gerçek çalışma fotoğrafları ve iş kayıtları** – müşteri izni alınmış olarak (`projects.ts`)
14. **Usta fotoğrafı** ve gerçek makine/saha fotoğrafları
15. **`public/images/industrial` altındaki 3 fotoğrafın kullanım hakları** – kullanıcı tarafından sağlandı; sitede "Temsilî görsel" notuyla, marka/model ya da gerçek servis vakası iddiası olmadan kullanılıyor
16. **Gizlilik/KVKK metni** – bir hukukçu tarafından gözden geçirilmesi önerilir
17. Sosyal medya hesapları (varsa)
