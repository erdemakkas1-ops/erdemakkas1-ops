# Keşan Ünalanlar Prefabrik — Demo Web Sitesi

[@kesanunalanlarprefabrik](https://www.instagram.com/kesanunalanlarprefabrik/) için hazırlanmış etkileşimli tanıtım sitesi demosu.
Yapı ve etkileşim dili [realestate-3d-demo](https://realestate-3d-demo.vercel.app/) örnek alınarak prefabrik/çelik ev firmasına uyarlandı.

## Bölümler

| Bölüm | Ne yapıyor |
| --- | --- |
| **Hero (3D)** | Seçilen ev modeli Three.js ile 3D gösterilir. *Yapım aşaması* çubuğu evi zemin betonu → çelik iskelet → panel duvar → çatı → anahtar teslim sırasıyla kurar. Sürükleyerek döndürülür. |
| **Modeller & planlar** | 4 model (Bağ Evi 1+1, Aile 2+1, Konfor 3+1, Villa 4+1). 2D SVG plan ve 3D maket görünümü; odaların üzerine gelince m² görünür. |
| **Fiyat hesaplama** | Firmanın eski sitesindeki hesaplama aracından esinlenildi: m², teslim şekli, beton yüksekliği (30/40 cm), bina yüksekliği (250/280 cm), iç/dış duvar kalınlığı, ekstralar, peşinat/vade. Sonuç WhatsApp mesajı olarak gönderilir. |
| **Süreç** | Keşiften anahtar teslime 5 adım. |
| **Hizmet bölgesi** | Keşan merkezli şematik Trakya haritası; ilçeye gelince rota ve yaklaşık km. |
| **Instagram** | Gerçek proje fotoğrafları için yer tutucu kutular. |
| **İletişim** | Telefon, adres, Instagram; form mesajı WhatsApp ile iletir. |

> Fiyatlar, planlar ve ilçe mesafeleri **örnektir**. Gerçek birim fiyatlar `js/data.js` içindeki `FIYAT` nesnesinden, modeller `MODELLER` dizisinden güncellenir.

## Çalıştırma

Derleme adımı yok; statik dosyalar. Three.js `vendor/` klasöründe gömülü (r169, MIT).

```bash
cd kesan-unalanlar-demo
python3 -m http.server 8000   # → http://localhost:8000
```

ES modülleri kullanıldığı için `index.html` dosyayı doğrudan açarak (file://) değil, bir sunucu üzerinden açılmalı.

## Vercel'e yayınlama

1. Vercel → **Add New Project** → bu depoyu seçin.
2. **Root Directory**: `kesan-unalanlar-demo`, **Framework Preset**: `Other`.
3. Build komutu boş bırakılır → **Deploy**.

## Dosyalar

```
index.html          sayfa iskeleti
styles.css          tüm stiller (koyu tema, mobil uyumlu)
js/data.js          firma bilgisi, modeller/planlar, fiyat tablosu, ilçeler
js/hero3d.js        3D ev + yapım aşaması animasyonu
js/plan.js          2D SVG plan + 3D maket
js/calculator.js    fiyat hesaplama aracı
js/map.js           hizmet bölgesi haritası
js/main.js          bağlantılar, menü, form
vendor/             three.module.min.js, OrbitControls.js
```
