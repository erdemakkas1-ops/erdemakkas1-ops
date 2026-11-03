# SDM Mobilya Mimarlık — Web Sitesi

Ölçüye özel mobilya ve iç mimarlık firması SDM Mobilya Mimarlık için tek sayfalık tanıtım sitesi.
Saf HTML/CSS/JS'dir, kurulum gerektirmez. Ziyaretçiyi WhatsApp üzerinden teklif istemeye yönlendirir.

**Yayın adresi:** `https://erdemakkas1-ops.github.io/erdemakkas1-ops/sdm-mobilya/`
(`main` dalına her push'ta `.github/workflows/pages.yml` ile yayınlanır.)

## Açılış filmi (Maviron Çelik demosundaki kaydırma filmiyle aynı motor)
Hero, ekrana sabitlenen bir sahne. Kaydırdıkça three.js ile kodla kurulmuş bir L mutfak + ada
"film" gibi oynar (`js/film.js`):

| Film saniyesi | Sahne |
|---|---|
| 0–1.1 | Hero; plan çizgileri açılışta çizilir |
| 1.4–3.3 | 01 Keşif & ölçü: ölçü çizgileri ve etiketleri (420 / 240 / 270 cm, ada 190 × 95) |
| 3.6–5.7 | 02 3D tasarım: parçalar yarı saydam hacimler olarak belirir, kamera döner |
| 6–8.2 | 03 Üretim & montaj: gövdeler, kapaklar, tezgahlar, ada gelir; gün ışığı açılır |
| 8.5–10.2 | Detaylar: shaker kapak, siyah mermer, bordo çıta, pirinç, gizli LED |
| 10.5–12 | Akşam: LED'ler ve sarkıtlar yanar, keşif çağrısı |

- `#film` üzerindeki `data-map` kaydırma oranını film saniyesine çevirir; sahneler `data-from`/`data-to`,
  etiketler ayrıca `data-at` (metre cinsinden 3D nokta) kullanır.
- WebGL2 yoksa, "hareketi azalt" açıksa ya da adrese `?still` eklenirse film yüklenmez, sabit hero görünür.
- `?capture` ile açıp konsolda `__film.seek(t)` filmi istenen saniyeye atlatır.
- three.js r180 `js/vendor/` içinden, meşe zemin dokusu (CC0, Poly Haven `oak_veneer_01`) `img/tex/` içinden
  servis edilir; ikisi de Maviron Çelik demosundaki dosyalar.

## Bölümler
Açılış filmi · Projeler (filtreli, yatay kaydırmalı) · Hizmetler (telefonda yatay kaydırmalı) · Süreç (4 adım) · Malzeme & Renk · Hakkımızda · İletişim + WhatsApp teklif formu · Footer · Sabit WhatsApp butonu

Sayfa kısa tutulsun diye projeler ve (telefonda) hizmetler alt alta değil yan yana kaydırılan şeritlerde; şeridin altında oklar, ilerleme çubuğu ve `03 / 09` sayacı var.

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

## Yerelde açmak
`index.html` dosyasına çift tıklayın ya da bu klasörde `python3 -m http.server` çalıştırıp `http://localhost:8000` adresine gidin.
