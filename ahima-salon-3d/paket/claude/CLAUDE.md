# AHIMA DEKORASYON — PROJE KURALLARI

## Kullanıcının kesin kararı

İlk ekran **BOŞ SALON**. Kullanıcı scroll yaptıkça **AYNI ODA**, kesintisiz ve geri sarılabilen bir dönüşümle gerçekçi olarak döşenir. Tamamlanmış ev açılışta gösterilmez. **Bina dış cephe / kesit / başka odaya uçuş / video / hero slayt yok.**

## Mevcut dosyalar

- `3d/00_shell.glb`: ham oda
- `3d/01_surfaces.glb`: yüzeyler
- `3d/02_furniture.glb`: mobilyalar
- `3d/03_details.glb`: son dekoratif detaylar
- `3d/scene_manifest.json`: kamera ve zamanlama bilgisi
- `konsept/`: AI konsept görselleri. Bunlar render değil; yalnız görsel hedef.
- `docs/`: tasarım, storyboard, lisans ve müşteri kontrol listesi

## Teknik ilkeler

- Next.js (App Router) + TypeScript + React Three Fiber + Drei + Three.js + GSAP ScrollTrigger.
- Her GLB'yi **orijinde** konumlandır, Y up, metre. Tek ana kamera. `00_shell` sürekli görünür.
- `01_surfaces`, `02_furniture`, `03_details` içindeki adlandırılmış node'ları ayrıştır ve scroll progress'e bağla.
- Her node son transformunu korumalı; ileri/geri kaydırmada drift olmamalı.
- GLB'lerin kalitesi blockout; gerçek PBR materyal ve yüksek kaliteli mobilya eklemeyi ayrı bir iyileştirme olarak ele al. İlk olarak fonksiyonel akışı tamamla.
- Tasarım referansı görüntüleri sitede gerçek proje gibi gösterme.
- Resmi marka verisi yoksa placeholder olarak göster; gerçek olmayan veri uydurma.
- Yukarıdaki kuralları kullanıcı değiştirmedikçe koru.

## Kontrol / teslim

`npm install`, `npm run build` ve temel görüntüleme; tarayıcı konsol hataları yok; scroll geri çalışıyor; mobil fallback; net README, kaynak kodu. Kullanıcının onayı olmadan gerçek domain veya resmi canlı siteyi değiştirme.
