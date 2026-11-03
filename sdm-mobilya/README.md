# SDM Mobilya Mimarlık — Web Sitesi

Ölçüye özel mobilya ve iç mimarlık firması SDM Mobilya Mimarlık için tek sayfalık tanıtım sitesi.
Saf HTML/CSS/JS'dir, kurulum gerektirmez. Ziyaretçiyi WhatsApp üzerinden teklif istemeye yönlendirir.

**Yayın adresi:** `https://erdemakkas1-ops.github.io/erdemakkas1-ops/sdm-mobilya/`
(`main` dalına her push'ta `.github/workflows/pages.yml` ile yayınlanır.)

## Bölümler
Hero · Projeler (filtreli, yatay kaydırmalı) · Hizmetler (telefonda yatay kaydırmalı) · Süreç (4 adım) · Malzeme & Renk · Hakkımızda · İletişim + WhatsApp teklif formu · Footer · Sabit WhatsApp butonu

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
