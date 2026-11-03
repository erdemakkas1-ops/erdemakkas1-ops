# SDM Mobilya Mimarlık — Web Sitesi

Ölçüye özel mobilya ve iç mimarlık firması SDM Mobilya Mimarlık için tek sayfalık tanıtım sitesi.
Saf HTML/CSS/JS'dir, kurulum gerektirmez. Ziyaretçiyi WhatsApp üzerinden teklif istemeye yönlendirir.

**Yayın adresi:** `https://erdemakkas1-ops.github.io/erdemakkas1-ops/sdm-mobilya/`
(`main` dalına her push'ta `.github/workflows/pages.yml` ile yayınlanır.)

## Bölümler
Hero · Taahhütler · Projeler (filtreli) · Hizmetler · Süreç (4 adım) · Malzeme & Renk · Hakkımızda · İletişim + WhatsApp teklif formu · Keşif CTA · Footer · Sabit WhatsApp butonu

## İçeriği düzenleme
`index.html` dosyasının altındaki `<script>` bölümünün başında tüm içerik dizileri var:

| Değişken | İçerik |
|---|---|
| `WHATSAPP` | WhatsApp numarası (ülke kodlu, boşluksuz) |
| `PROJECTS` | Proje kartları: başlık, açıklama, kategori, görsel |
| `SERVICES` | Hizmet kartları |
| `SWATCHES` | Malzeme / renk örnekleri |
| `CATEGORIES`, `AREAS` | Proje filtreleri ve formdaki alan seçenekleri |

## Görselleri ekleme (sonraki adım)
1. Fotoğrafları `img/` klasörüne koyun (tercihen `.webp`, ~1200 px genişlik).
2. `PROJECTS` içindeki ilgili projenin `img: null` alanını değiştirin, örn. `img: "img/siyah-mermer-mutfak.webp"`.
3. Görseli olmayan kartlar otomatik olarak renkli yer tutucu gösterir.

## Yerelde açmak
`index.html` dosyasına çift tıklayın ya da bu klasörde `python3 -m http.server` çalıştırıp `http://localhost:8000` adresine gidin.
