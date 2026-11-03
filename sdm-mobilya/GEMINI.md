# Açılış filmi için Gemini görselleri

Kaydırma filmi, **aynı mutfağın aynı kameradan çekilmiş 5 karesiyle** oynayacak. Kaydırdıkça
kareler birbirine geçecek, her karede ilgili başlık ve etiketler görünecek:

| Sıra | Dosya adı | Ne görünüyor | Filmdeki bölüm |
|---|---|---|---|
| 1 | `1-olcu` | Boş, sıvalı mutfak; tesisat çıkışları, lazer çizgisi, metre | 01 · Keşif & ölçü |
| 2 | `2-tasarim` | Aynı mutfak, beyaz maket gibi 3D tasarım render'ı | 02 · 3D tasarım |
| 3 | `3-govde` | Ham dolap gövdeleri takılı, kapaklar folyolu yerde | 03 · Üretim & montaj |
| 4 | `4-gunduz` | Bitmiş mutfak, gündüz | Detayda ustalık |
| 5 | `5-aksam` | Aynı mutfak akşam, gizli LED'ler ve sarkıtlar yanık | Kapanış |

Geçişlerin düzgün görünmesi için **5 karede de kamera, duvarlar, pencere ve tavan aynı yerde** olmalı.
Bu yüzden önce `4-gunduz` üretilecek, diğer dördü **o görsel Gemini'de düzenletilerek** yapılacak.
Her seferinde yeni görsel ürettirirsen oda her karede değişir.

## Başlamadan
- Gemini'de görsel modelini kullan (Gemini uygulaması / AI Studio, "Nano Banana" görsel düzenleme).
- `gemini/referans/referans-yatay.png` sitedeki 3D sahnenin render'ı: kamera açısı, L dolap, ada,
  sarkıtlar ve pencere yerini tutturmak için bunu **ilk prompta ek olarak yükle**.
- İstersen SDM'nin Instagram'daki siyah mermer adalı mutfak gönderisini de stil referansı olarak ekle.
- Oran: masaüstü için **16:9 yatay**.

## 1) `4-gunduz` (bitmiş mutfak, gündüz) — önce bu
Referans render'ı yükle ve yaz:

> Use the attached 3D render only as a layout and camera reference: keep exactly the same camera angle, the same L-shaped cabinet layout, the island position, the two pendant lights, the tall oven and fridge columns on the right and the window on the right wall. Turn it into a photorealistic interior photograph of a newly fitted luxury kitchen in a Turkish apartment, 16:9. Matt anthracite shaker-style cabinet fronts with slim brushed brass bar handles; black marble worktops and a full-height black marble backsplash with soft warm-white and gold veins; a brass gooseneck tap over an undermount sink; a built-in black oven; a flush black induction hob under a black hood. The island has a black marble top with waterfall ends and vertical fluted panels in deep burgundy, two black metal bar stools with dark upholstered seats, two brass dome pendants above it. A walnut floating shelf on the left wall. Light natural oak floor, warm white walls, flat white ceiling. Soft natural daylight from the window, calm and premium. Architectural photography, no people, no text, no logos.

Beğenmediğin detay olursa aynı görsel üzerinde "Edit this image…" diye düzelttir; yeni görsel ürettirme.

## 2) `5-aksam` — `4-gunduz`'u yükle

> Edit this image. Keep the same kitchen, the same camera angle and every object exactly where it is. Change the time to evening: deep blue dusk sky in the window, the room lit mainly by warm 2700 K hidden LED strips under the wall cabinets and under the walnut shelf, the two brass pendants glowing over the island, the black marble catching soft warm reflections. Cosy, premium evening mood, photorealistic.

## 3) `3-govde` — `4-gunduz`'u yükle

> Edit this image. Keep the same camera angle, the same window, walls, ceiling and floor. Remove all cabinet doors and drawer fronts, the handles, the worktops, the backsplash, the appliances, the tap, the stools, the pendant lights and the shelf. Leave only the bare cabinet carcasses fixed in place: raw white melamine boxes with visible shelves, hinge plates and drawer runners; the island as an open white carcass without its top or fluted panels. A few anthracite door panels wrapped in clear protective film lean against the wall, a cordless drill and a toolbox on the floor. Daylight, photorealistic, a real kitchen mid-installation.

## 4) `2-tasarim` — `4-gunduz`'u yükle

> Edit this image. Keep the same camera angle and every object exactly where it is, but turn the whole scene into a clean 3D architectural design render: everything in matt white clay material with soft grey ambient occlusion, thin dark outline edges on every cabinet, door and the island, no textures and no colours except a very subtle warm tint, a soft studio light. It should look like the 3D design a kitchen studio shows the client before production.

## 5) `1-olcu` — `3-govde`'yi yükle

> Edit this image. Keep the same camera angle, the same window and the same ceiling. Remove every cabinet carcass, the island, the door panels, the tools and the floor finish: an empty kitchen with smooth plastered light grey walls and a bare screed floor, water and drain pipe stubs and electrical sockets coming out of the back wall at worktop height. A laser level on a tripod projects a thin red horizontal line across the walls, pencil marks on the wall and a tape measure on the floor. Daylight, photorealistic.

Her kareyi `4-gunduz` ile üst üste koyup hızlıca karşılaştır: pencere, tavan ya da duvar köşesi kaymışsa o kareyi yeniden düzenlet.

## Telefon için (önerilir)
`gemini/referans/referans-dikey.png` ile aynı sırayı **9:16 dikey** tekrarla, ya da `4-gunduz`'u
genişlettir: *"Extend this image to a vertical 9:16 frame, keep the island and the cabinet wall in the
upper half, more oak floor below."* Sonra 2–5. adımlardaki düzenlemeleri bu dikey görsel üzerinde yap.
Adlar: `1-olcu-m`, `2-tasarim-m`, `3-govde-m`, `4-gunduz-m`, `5-aksam-m`.

## Teslim
Görselleri (png, jpg ya da webp) bu sohbete yükle ya da `sdm-mobilya/gemini/` klasörüne yukarıdaki adlarla koy.
Kareler hizalanıp (Gemini'nin küçük kaymaları düzeltilir) 1920 × 1080 ve 1080 × 1920 WebP'ye çevrilecek,
film bu karelerle yeniden kurulacak. Telefon kareleri gelmezse yatay kareler telefonda ortadan kırpılır.
