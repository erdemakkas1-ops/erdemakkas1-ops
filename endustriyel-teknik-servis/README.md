# Endüstriyel Teknik Servis – Web Sitesi

BOBST, manroland ve benzeri endüstriyel baskı/ambalaj makinelerine elektrik, mekanik ve otomasyon
teknik servisi veren **bağımsız bir uzman** için Türkçe, responsive, müşteri kazanmaya odaklı web sitesi.

**Teknolojiler:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger (`@gsap/react` useGSAP)
· Lucide React. Video, WebGL veya 3D model yoktur; sahneler fotoğraf tabanlıdır.

**Tasarım dili:** antrasit / endüstriyel siyah / titanyum gri / çelik tonları, ölçülü amber vurgu (#E39B2D);
Archivo %125 geniş büyük harf başlıklar (konturlu `<em>`), Instrument Sans metin, JetBrains Mono etiketler.
Fotoğraf tabanlı, kaydırmayla kontrol edilen üç sinematik sahne; teknik resim paftaları ve kaydırmayla çizilen
şemalar.

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
| `machines.ts` | Marka grupları, teyit edilen modeller, makinenin ana grupları – `/makineler/[marka]` sayfaları buradan üretilir |
| `projects.ts` | Çalışmalar (boşken "Örnek içerik" yer tutucuları görünür) |
| `about.ts` | Deneyim yılı, belgeler, geçmiş, usta fotoğrafı, çalışma prensipleri |
| `process.ts` | Servis süreci adımları |
| `form.ts` | Form marka ve arıza türü seçenekleri |
| `media.ts` | Sinematik sahne görselleri (slotlar), açılış etiketleri |
| `tours.ts` | Sahne 2–3 kamera turları: adım başlıkları, metinler, odak/yakınlaşma ve görsel etiketleri |
| `guides.ts` | Teknik rehber yazıları (`/rehber`) |
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
  app/                    # Rotalar, metadata, sitemap.ts, robots.ts, icon.svg (paylaşım görseli: public/og-image.png)
    hizmetler/[slug]/     # 5 hizmet detay sayfası (generateStaticParams)
    makineler/ calismalarimiz/ hakkimizda/ iletisim/ gizlilik/
  components/
    cinema/               # HeroCinema, FocusTour, ServiceScene, CoverImage (+ Hotspot)
    layout/               # Header, Footer, QuickContact (masaüstü), MobileContactBar (mobil sabit çubuk), Logo
    sections/             # Expertise, Process, Machines, Projects, About, Faq, ContactSection, ServiceCta, PageHero…
    forms/                # ServiceRequestForm (doğrulama + WhatsApp mesajı)
    animations/           # ScrollEffects (GSAP ScrollTrigger, data-* öznitelikleri)
    visuals/              # SVG teknik çizimler + Visual (foto/çizim seçici)
    ui/                   # ButtonLink, SectionHeading, Breadcrumbs, JsonLd, ContactActions, Icon
  data/                   # Tüm içerik ve işletme ayarları
  lib/                    # whatsapp.ts (saf fonksiyonlar), contact.ts, seo.ts
scripts/                  # test-whatsapp.mjs, e2e.mjs, optimize-images.py (AVIF + WebP)
public/images/            # Gerçek fotoğraflar için klasörler
```

## Usta profili (şablon değerler)

Usta onay verene kadar site kişisel bilgiler varmış gibi kurgulanır: `src/data/site.ts` içindeki `profile`
nesnesi (ad soyad, deneyim, geçmiş, merkez şehir, bölgeler, çalışma saatleri, telefon) şablon değerler taşır
(`Usta Adı Soyadı`, `XX yıl`, `0 5XX XXX XX XX`…). Sitede kesik çizgili altçizgi ve "Usta onayından sonra
doldurulacak" ipucuyla görünürler; gerçek değer girildiğinde (`value`) işaret kendiliğinden kalkar.
Telefon tanımlı değilken "Ara" butonu iletişim bölümüne gider; çalışmayan `tel:` bağlantısı oluşmaz.
Uydurma isim, yorum veya rakam girilmez.

## Sinematik sahneler (`src/components/cinema/`)

Fotoğraf tabanlı; tüm hareket kaydırmaya bağlı (otomatik oynayan animasyon ve video yok). Sahneler `position: sticky`
ile sabitlenir, GSAP ScrollTrigger zaman çizelgesi `scrub` ile ilerler ve geri kaydırınca geri sarar.

| Sahne | Dosya | Ne olur |
| --- | --- | --- |
| 1 — Açılış | `HeroCinema.tsx` | Tam ekran baskı makinesi; görüntü makineye doğru büyür (masaüstü 1.35×, mobil 1.22×), başlık ve CTA'lar kademeli kaybolur, sonda kararıp sonraki bölüme geçer |
| 2 — Mekanik (kamera turu) | `FocusTour.tsx` + `tours.ts` → `mechanicalTour` | Dişli/silindir fotoğrafında sırayla: Mekanik arıza tespiti → Rulman ve mil sistemleri → Aktarma organları → Makine revizyonu. Kamera ilgili bölgeye kayar, çevre kararır, yalnızca görünen parçalar etiketlenir |
| 3 — PLC ve otomasyon (kamera turu) | `FocusTour.tsx` + `tours.ts` → `controlTour` | Pano kadraja çerçeveyle girer; PLC → sürücüler → servo/sürücü modülü → koruma elemanları ve klemensler |
| 4 — Sahada müdahale | `ServiceScene.tsx` | Sabitlenmez: görsel çerçeveden tam genişliğe açılır (clip-path) + hafif parallax; dört hizmet ve iletişim çağrısı. Görsel temsilîdir |

Sabitlenen (sticky) yalnızca 3 bölüm vardır: açılış ve iki kamera turu.

- Görseller `src/data/media.ts` slotlarından gelir (AVIF + WebP, `<picture>`); açılış görseli `fetchpriority=high`,
  diğerleri `loading=lazy`. Etiketler `CoverImage` ile görselin yüzde koordinatlarında kalır (kapsayıcı birimleri).
- Mobil: daha kısa sahneler, daha az yakınlaşma, odak noktası ekranın üst kısmında, metin altta. `prefers-reduced-motion`:
  sabitleme yok, kamera turları sabit görsel + adım listesi olarak görünür.
- **Koordinat sistemi:** görsel ve etiketler aynı kapak kutusunda (`CoverImage`, `[data-cover-box]`); kutu yalnızca
  left/top/width/height ile yerleşir (transform yok). Kamera (`[data-cam]`) kutunun DOM ölçülerinden hesaplanır ve
  görseli + etiketleri birlikte taşır. Kamera içindeki `CoverImage` `clip={false}` kullanır (kırpma dıştaki sahnede);
  aksi hâlde yakınlaşmada sahnede boşluk açılır ve etiketler kaybolur.
- **Etiket yerleşimi:** her adımda etiket ekrana sığmıyor / metin paneline ya da başka etikete çarpıyorsa yönü
  (sağ → sol → üst → alt) değişir, hiçbiri olmuyorsa o ekranda gizlenir. Odak noktası metin panelinin dışındaki serbest
  alanın ortasına getirilir. Koordinatlar `src/data/tours.ts` içinde, görsel üzerinde %5 ızgarayla ölçülmüştür.
- **Hata ayıklama:** `npm run dev` → `http://localhost:3000/?debug`: görsel sınırı + %10 ızgara, etiket koordinatları,
  adım odak noktaları (F1…), canlı kamera ölçek/x/y. Production derlemesinde bu katman hiç oluşturulmaz.
- **Doğrulama:** `npm run build && npx next start -p 3100`, sonra `BASE_URL=http://localhost:3100 npm run test:tour [klasör]`
  — 375/390/430/768/1440/1920 px; her adımda nokta sapması (≤1 px), ekran içi, panel/etiket çakışması, piksel bazlı
  görsel kaplama, geri kaydırma; klasör verilirse %0/25/50/75/100 ekran görüntüleri.
- Gemini görselleri: [`GEMINI-GORSELLER.md`](./GEMINI-GORSELLER.md) (dosya adları, istemler, kurallar).

## Çizim dili (kaydırmayla çizilen grafikler)

`[data-draw]` içindeki SVG çizgileri `pathLength=1` + `stroke-dashoffset` ile kaydırmaya bağlı çizilir
(`data-draw="load"`: açılışta, zamana bağlı). Kullanıldığı yerler: makine paftaları (çizim + bölüm listesi + antet),
süreç devre şeması (`sections/Process.tsx`), hizmet/marka sayfalarının açılış çizimleri, örnek iş kartları.
Bölümler arası `SchematicDivider` çizgileri uçlardan çizilir. Reduced-motion'da çizimler hazır görünür.

## Sektör araştırması

Bağımsız servis sitelerinin incelemesi ve uygulanan iyileştirmeler: [`RAKIP-ARASTIRMA.md`](./RAKIP-ARASTIRMA.md).

## Teknik notlar

- **Animasyon (sahneler dışı):** Tek bir `ScrollEffects` bileşeni `data-reveal`, `data-stagger`, `data-clip`, `data-zoom`,
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
