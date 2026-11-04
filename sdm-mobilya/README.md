# SDM Mobilya Mimarlık — Web Sitesi

Ölçüye özel mobilya ve iç mimarlık firması SDM Mobilya Mimarlık için tek sayfalık tanıtım sitesi.
Saf HTML/CSS/JS'dir, kurulum gerektirmez. Ziyaretçiyi WhatsApp üzerinden teklif istemeye yönlendirir.

**Yayın adresi:** `https://erdemakkas1-ops.github.io/erdemakkas1-ops/sdm-mobilya/`
(`main` dalına her push'ta `.github/workflows/pages.yml` ile yayınlanır.)

## Açılış filmi (Maviron / D&M Mutfak'taki kaydırma filmiyle aynı fikir)
Hero ekrana sabitlenen bir sahne; kaydırdıkça aynı mutfağın Gemini ile üretilmiş kareleri birbirine geçer
(`js/film.js`, kareler `img/film/`, nasıl üretildikleri `GEMINI.md`):

| Film saniyesi | Kare | Bölüm |
|---|---|---|
| 0–1.1 | `1-olcu` (varsa) / `2-tasarim` | Hero |
| 1.4–3.1 | `1-olcu` / `2-tasarim` | 01 Keşif & ölçü, ölçü etiketleri |
| 3.4–5.1 | `2-tasarim` | 02 3D tasarım, parça etiketleri |
| 5.5–7.6 | `3-govde`, ardından `4-gunduz` pirinç bir tarama çizgisiyle soldan sağa açılır | 03 Üretim & montaj |
| 8.3–9.9 | `4-gunduz` | Detaylar: shaker kapak, siyah mermer, bordo çıta, pirinç sarkıt, ceviz raf |
| 10.4–12 | `5-aksam` | Kapanış ve keşif çağrısı |

- Kareler `data-in="a,b"` ile a–b saniyeleri arasında öncekilerin üstüne gelir (`data-wipe` varsa tarama ile).
  Sahneler `data-from`/`data-to`, etiketler ayrıca `data-at="u,v"` (görselin genişlik/yüksekliğine oranla nokta) kullanır.
- Film boyunca görüntü %7 yavaşça yakınlaşır; etiketler görsele kilitli kalır.
- Dikey ekranlarda (`max-aspect-ratio: 4/5`) `-m` ekli 1080 × 1920 kareler tam ekran gösterilir, yazı alttaki zeminin
  üzerinde durur; etiketlerin dikey konumu `data-m`. `1-olcu` şimdilik yalnızca dikey var: geniş ekranda o yuvada `2-tasarim` görünür.
- Gemini dikey karelerde kadrajı çok değiştirdi (akşam karesi gündüzden ~%23 daha yakın); `keyframes.py` bunları oda
  kabuğuna (tavan kornişi, duvar köşeleri, pencere) göre geniş aralıkta eşleştirip hepsini en sıkı kadraja büyütür.
- `python3 tools/keyframes.py`: `gemini/` klasöründeki kareleri birbirine hizalar, EDSR ile 2 kat netleştirir ve
  1920 × 1080 (varsa `-m` için 1080 × 1920) WebP'ye çevirir; paylaşım görseli `img/og.jpg` akşam karesinden üretilir.
- "Hareketi azalt" açıksa ya da adrese `?still` eklenirse film yerine sabit hero görünür. `?capture` ile `__film.seek(t)`.
- Önceki three.js sürümü (kodla kurulmuş 3D mutfak) git geçmişinde: commit `cd9e23d`.

## Bölümler
Açılış filmi · Projeler (filtreli, yatay kaydırmalı) · Hizmetler (telefonda yatay kaydırmalı) · Süreç (4 adım) · Malzeme & Renk ·
**Işık** (gündüz/akşam karşılaştırma) · **Mutfağını tasarla** · Hakkımızda · İletişim + WhatsApp teklif formu · Footer · Sabit WhatsApp butonu

- **Işık** (`#isik`, `js/extras.js`): gündüz ve akşam kareleri üst üste; çizgi bir `range` girdisi (klavye ve dokunmayla çalışır).
  Bölüm ilk göründüğünde çizgi bir kez gidip gelir ki hareket ettiği anlaşılsın ("hareketi azalt" açıksa yapmaz).
- **Mutfağını tasarla** (`#tasarla`, `js/extras.js` + `js/kitchen3d.js`): düz / L / U, ada, A-B-C duvar ölçüleri,
  kapak (shaker / düz kulpsuz / parlak lake), renk, tezgah (siyah mermer / beyaz mermer / ahşap), LED.
  Tek bir cm yerleşimi (D&M Mutfak demosunun kuralları: 60 cm alt dolap, 35 cm üst dolap, koşuyu kapatan buzdolabı
  kolonu, adanın önünde 110 cm, yan dolaptan 100 cm koridor) hem 3D'yi, hem kuşbakışı planı, hem modül sayılarını,
  hem WhatsApp mesajını üretir. 3D mutfak three.js r180 ile (`js/vendor/`, import map `<head>` içinde), bölüme
  ~600 px kala ya da sayfa yüklenince yüklenir; sürükleyerek / ok tuşlarıyla döner, masaüstünde GTAO gölgelendirme
  yapar. WebGL2 yoksa ya da yükleme başarısız olursa plan görünür. `js/kitchen3d.js` D&M'nin modülünden uyarlandı
  (pirinç bar kulp, shaker çerçeve, mermer / ahşap tezgah, pirinç kubbe sarkıtlar). Rakamlar ilk fikir içindir.
- Filmde ve karşılaştırmada "Temsili görseldir" notu var: Gemini kareleri SDM'nin gerçek bir işi değil.

## Paylaşım ve Google
- `og:image` / Twitter kartı `img/og.jpg` (akşam karesi, 1200 × 630); `canonical` yayın adresini gösterir.
  Alan adı alınınca `og:url`, `og:image`, `twitter:image`, `canonical` ve JSON-LD'deki adresler güncellenmeli.
- `application/ld+json` içinde `HomeAndConstructionBusiness` (LocalBusiness) bilgisi var. **Adres ve hizmet bölgesi
  (`address`, `areaServed`) SDM'den gelince eklenmeli**; yerel aramada en çok bunlar işe yarar.

## İçeriği düzenleme
`index.html` dosyasının altındaki `<script>` bölümünün başında tüm içerik dizileri var:

| Değişken | İçerik |
|---|---|
| `WHATSAPP` | WhatsApp numarası (ülke kodlu, boşluksuz) |
| `PROJECTS` | Proje kartları: başlık, açıklama, kategori, görsel |
| `SERVICES` | Hizmet kartları |
| `SWATCHES` | Malzeme / renk örnekleri |
| `CATEGORIES`, `AREAS` | Proje filtreleri ve formdaki alan seçenekleri |

## Görseller
- 6 proje görseli SDM'nin Instagram profil ekran görüntüsünden kırpıldı (`python3 tools/instagram.py`,
  kaynak `instagram-raw/` içinde, git'e eklenmez). Kırpımlar EDSR süper çözünürlük modeliyle 2 kat
  büyütülüp hafifçe keskinleştirildi (~712 px). Bu yalnızca görüntüyü temizler, gerçek detay eklemez;
  yayından önce SDM'den tam çözünürlüklü fotoğraflar istenmeli.
- Giyinme odası, kiler ve banyo kartları hâlâ yer tutucu (`img: null`).
- Yeni görsel eklemek: dosyayı `img/proje/` içine koyun ve `PROJECTS` içinde ilgili kartın `img`
  alanına yolunu yazın, örn. `img: "img/proje/giyinme-mozaik.webp"`.

## Vercel'de yayınlamak
Kurulum gerektirmez; `vercel.json` önbellek ve güvenlik başlıklarını ayarlar.
1. vercel.com → **Add New… → Project** → GitHub'dan `erdemakkas1-ops/erdemakkas1-ops` reposunu içe aktar.
2. **Root Directory:** `sdm-mobilya` · **Framework Preset:** Other · Build ve Output ayarları boş kalır.
3. **Deploy.** Sonraki her `main` push'unda Vercel kendiliğinden yeniden yayınlar.
Alan adı alındığında Vercel'de **Settings → Domains** altından eklenir; ardından `index.html` içindeki
`og:url`, `og:image`, `twitter:image`, `canonical` ve JSON-LD adresleri yeni adrese çevrilmeli.

## Yerelde açmak
`index.html` dosyasına çift tıklayın ya da bu klasörde `python3 -m http.server` çalıştırıp `http://localhost:8000` adresine gidin.
