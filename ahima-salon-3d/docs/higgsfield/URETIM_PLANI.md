# Ahima salon: Higgsfield üretim planı

Amaç, **aynı kameradan, aynı odada** kesintisiz bir dönüşüm filmi üretmek: boş salon → zemin ve duvar → mobilya → son dokunuş.
Scroll bu filmi kare kare ileri ve geri sarar. Ortada geçiş efekti, kesme ya da "iki farklı fotoğraf" hissi olmayacak.

## Kesintisizliğin sırrı

1. Önce **4 anahtar kare** üretilir. Her kare bir öncekinin **düzenlenmiş hâlidir**; kamera, pencere, duvarlar ve ışık aynı kalır.
2. Sonra **3 video** üretilir. Her videonun başlangıç karesi bir anahtar kare, bitiş karesi bir sonraki anahtar karedir.
3. Böylece 1. videonun son karesi ile 2. videonun ilk karesi **aynı görüntüdür**. Uç uca eklenince ek yeri görünmez.

```
K0 boş ──video 1──▶ K1 yüzeyler ──video 2──▶ K2 mobilya ──video 3──▶ K3 tamamlanmış
```

Referans görseller bu klasörde:
- `referans_bos_salon.jpg`: oda geometrisi ve kamera açısı (sitedeki 3D sahneden)
- `referans_dolu_salon_yerlesim.jpg`: mobilyaların yerleşimi (yalnızca yerleşim için; stil olarak kopyalanmaz)

---

## Adım A: Anahtar kareler

**Model:** Nano Banana Pro · **Oran:** 16:9 · **Çözünürlük:** 2k
Her adımda **bir önceki adımda ürettiğiniz görseli** referans olarak yükleyin. Promptlar İngilizce, aynen kopyalayın.

### K0: Boş salon
Referans: `referans_bos_salon.jpg`

```
Photorealistic architectural interior photograph of the exact room in the reference image, same camera position, same lens, same framing, same proportions. A completely empty, unfinished modern living room: raw smooth grey concrete screed floor, plain warm-white plastered walls, flat white ceiling, one wide floor-to-ceiling window in the back wall with thin dark bronze aluminium frames and two vertical mullions, lush green garden and soft sky outside. Late afternoon sunlight enters through the window and casts long soft window-shaped light patches with mullion shadows on the concrete floor. No furniture, no objects, no people, no text. Shot on a full-frame camera, 24mm lens, eye level, natural light, high dynamic range, realistic materials, subtle dust in the air, ultra detailed, real estate photography.
```

### K1: Zemin ve duvar kaplamaları
Referans: **K0 görseliniz**

```
Edit this exact photograph. Keep the camera, lens, framing, window, walls, ceiling, sunlight direction and outside view exactly identical. Change only the finishes: replace the concrete floor with light natural oak herringbone parquet with a soft satin finish; cover the entire left wall with tall vertical walnut wood slats with dark gaps between them; clad the right wall with large honed beige travertine stone panels with thin vertical joints; add a recessed ceiling cove around the perimeter with a slim dropped ceiling edge. The room is still empty: no furniture, no decor, no lamps, no people, no text. Photorealistic, same light and colour temperature as the original.
```

### K2: Mobilyalar
Referanslar: **K1 görseliniz** + `referans_dolu_salon_yerlesim.jpg` (yalnızca yerleşim için)

```
Edit the first image. Keep the camera, framing, floor, walls, window, ceiling and sunlight exactly identical. Add furniture in the layout shown in the second image: a large low cream boucle L-shaped sectional sofa on the left facing the room, a round honed travertine coffee table in the centre, two cognac leather lounge chairs with walnut frames near the window, a long low floating walnut TV console on the right wall with a large wall-mounted black TV above it, and a small round walnut side table at the far left. No rug, no cushions, no plants, no decor yet, no people, no text. Photorealistic furniture with real fabric texture, soft contact shadows, same lighting.
```

### K3: Son dokunuş (tamamlanmış salon)
Referans: **K2 görseliniz**

```
Edit this exact photograph. Keep the camera, framing, architecture and all furniture exactly in place. Add the finishing touches: a large soft ivory wool rug under the sofa and coffee table, linen and taupe throw pillows and a knitted throw on the sofa, a tall olive tree in a stone planter in the back left corner, sheer ivory linen curtains at both sides of the window, a two-ring brass LED pendant light above the coffee table, a vase with white hydrangeas and a stack of books on the coffee table, small ceramic vases on the TV console. Turn on warm 2700K hidden LED strips in the ceiling cove and the pendant, glowing softly, while golden late afternoon sunlight still enters the window. Warm minimal luxury interior, photorealistic, magazine-quality interior photography, no people, no text.
```

**Kontrol:** 4 görseli yan yana koyun. Pencere, kamera açısı ve oda sınırları aynı yerde olmalı. Biri kaymışsa o adımı yeniden üretin. Videoların kalitesi tamamen buna bağlı.

---

## Adım B: Videolar

**Model:** Seedance 2.0 · **mode:** std · **Çözünürlük:** 1080p · **Süre:** 5 sn · **Oran:** 16:9 · **Ses:** kapalı (`generate_audio` off)
Her videoda **start image** ve **end image** alanlarını doldurun.

| Video | Start image | End image |
|---|---|---|
| V1 | K0 | K1 |
| V2 | K1 | K2 |
| V3 | K2 | K3 |

### V1 prompt
```
Locked-off static tripod camera, absolutely no camera movement, no zoom. Smooth seamless transformation of the same room: oak herringbone parquet spreads across the concrete floor from the window towards the camera, walnut slats rise one by one from the floor along the left wall, travertine panels slide into place on the right wall, the ceiling cove forms. Elegant, calm, continuous motion. No people, no tools, no text, no cuts.
```

### V2 prompt
```
Locked-off static tripod camera, absolutely no camera movement, no zoom. The same room gently furnishes itself: the walnut TV console and TV settle onto the right wall, the cream sectional sofa glides into place on the left, the travertine coffee table and the two leather lounge chairs appear and settle softly with realistic weight. Calm, continuous, physically believable motion. No people, no text, no cuts.
```

### V3 prompt
```
Locked-off static tripod camera, absolutely no camera movement, no zoom. Final styling of the same room: the ivory rug unrolls across the floor, pillows and a throw land on the sofa, the olive tree, curtains, flowers and decor appear, the brass ring pendant lowers from the ceiling, and the warm cove LED lights slowly fade on. Calm, continuous motion ending on a still, finished luxury living room. No people, no text, no cuts.
```

Bir video kamerayı oynatır, odayı değiştirir ya da insan gösterirse **o videoyu yeniden üretin** (aynı start/end ile). Kamera sabit değilse scroll'da titreme olur.

---

## Kredi

Hesapta şu an **141 kredi** var. Higgsfield arayüzü her üretimden önce maliyeti gösteriyor; üretmeden önce kontrol edin.
Toplam 4 görsel ve 3 video gerekiyor (+ olası tekrarlar). Yetmezse videoları **720p** ile üretin; scroll filmi zaten 1600 px civarına küçültülecek.

## Bittiğinde

Bana "**üretim bitti**" yazmanız yeterli. Higgsfield geçmişinizden 4 görseli ve 3 videoyu kendim çekerim:
- videoları uç uca birleştirip kare dizisine çeviririm (masaüstü + telefon için ayrı kırpım),
- scroll animasyonunu bu filme göre baştan kurarım (kare kare scrub, geri sarma birebir, geçiş efekti yok),
- ilk kare boş salon (K0) olur, son kare tamamlanmış salon (K3).

Hangi üretimleri kullanacağımı karıştırmamam için başka işlerle araya üretim girmemesi iyi olur. Girerse hangilerini kullanacağımı yazın.
